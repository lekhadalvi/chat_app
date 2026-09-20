import { TryCatch } from "../components/reusecode.js";
import { Chat } from "../models/chats.model.js";
import { Message } from "../models/Message.models.js";
import type { AuthenticatedRequest, IUser } from "../middlewares/isAuth.js";
import axios from "axios";
import { io, UserSocketMap } from "../config/sockets.js";
import { publishToQueue } from "../config/rabbitmq.js";

export const createNewChat = TryCatch<AuthenticatedRequest>(async (req, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!userId) {
        res.status(401).json({ message: "please login" });
        return;
    }

    if (!otherUserId) {
        res.status(400).json({ message: "otherUserId is required" });
        return;
    }

    if (otherUserId === userId) {
        res.status(400).json({ message: "cannot create a chat with yourself" });
        return;
    }

    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
        res.status(200).json({ message: "chat already exists", chat: existingChat._id });
        return;
    }

    const newChat = await Chat.create({
        users: [userId, otherUserId],
    });

    res.status(201).json({ message: "chat created", chat: newChat._id });
});

export const fetchAllChats = TryCatch<AuthenticatedRequest>(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(400).json({ message: "user id missing" });
        return;
    }

    const userIdStr = userId.toString();
    const chats = await Chat.find({
        users: { $in: [userIdStr, userId] }
    }).sort({ updatedAt: -1 });

    const token = req.headers.authorization;

    const chatwithUserData = await Promise.all(
        chats.map(async (chat) => {
            const unseenCount = await Message.countDocuments({
                chatId: chat._id,
                seen: false,
                sender: { $ne: userIdStr }
            });

            const chatData = {
                ...chat.toObject(),
                latestMessage: chat.latestMessage || null,
                unseenCount,
            };

            if (chat.isGroup) {
                const groupUser = {
                    _id: "",
                    name: chat.groupName || "Group Squad",
                    email: "Group Chat"
                };
                return { user: groupUser, chat: chatData };
            }

            const otherUserId = chat.users.find((id) => id.toString() !== userIdStr);
            const unknownUser = {
                _id: otherUserId || "",
                name: "Unknown Gamer",
                email: "",
            };

            if (!otherUserId) {
                return { user: unknownUser, chat: chatData };
            }

            try {
                const { data } = await axios.get<IUser>(
                    `${process.env.USER_SERVICE_URL}/api/v1/user/${otherUserId}`,
                    token ? { headers: { Authorization: token } } : undefined
                );
                return { user: data, chat: chatData };
            } catch (error) {
                console.error(`Error fetching user ${otherUserId}:`, error);
                return { user: unknownUser, chat: chatData };
            }
        })
    );

    res.json({ chats: chatwithUserData });
});

export const sendMessage = TryCatch(async(req:AuthenticatedRequest,res) =>{
    const senderId = req.user?._id
    const { chatId } = req.body
    const text = req.body.text || req.body.content
    const imageFile = req.file

    if(!senderId){
        res.status(401).json({message:"please login"})
        return
    }

    if(!chatId){
        res.status(400).json({message:"chatId is required"})
        return
    }

    if(!text && !imageFile){
        res.status(400).json({message:"either text or image is required"})
        return
    }

    const chat = await Chat.findById(chatId)
    if(!chat){
        res.status(404).json({message:"chat not found"})
        return
    }

   const isUserInChat = chat.users.some(user => user.toString() === senderId.toString())
   if(!isUserInChat){
    res.status(403).json({message:"you are not a member of this chat"})
    return
   }

   const messageData: any = {
    chatId,
    sender: senderId,
    seen: false,
    seenAt: undefined,
    text: text || "",
    messageType: imageFile ? "image" : "text",
   }

   if (imageFile) {
    messageData.image = {
        public_id: imageFile.filename,
        url: imageFile.path,
    }
    messageData.messageType = "image"
    messageData.text = text || " "
   }
   else{
    messageData.messageType = "text"
    messageData.text = text || " "
   }

   const message = new Message(messageData)

   const savedMessage = await message.save()

   const latestMessageText = imageFile ? "📸Image" : text
   await Chat.findByIdAndUpdate(chatId, {
    latestMessage: {
        text: latestMessageText,
        sender: senderId,
    },
    updatedAt: new Date(),
   },{new:true})

    const messagePayload = {
        chatId,
        message: {
            id: savedMessage._id,
            senderId: savedMessage.sender,
            content: savedMessage.text,
            timestamp: new Date(savedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    };

    // Emit to room (for users currently inside the chat)
    io.to(chatId).emit("newMessage", messagePayload);

    // Emit to individual user sockets (for users in dashboard/chats list)
    chat.users.forEach((memberId) => {
        if (memberId.toString() !== senderId.toString()) {
            const socketId = UserSocketMap[memberId.toString()];
            if (socketId) {
                io.to(socketId).emit("newMessage", messagePayload);
            }
        }
    });
    
    res.status(201).json({ message: savedMessage, sender: senderId })
})

export const getMessageByChat = TryCatch<AuthenticatedRequest>(async (req, res) => {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) {
        res.status(401).json({ message: "please login" });
        return;
    }

    if (!chatId) {
        res.status(400).json({ message: "chatId is required" });
        return;
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({ message: "chat not found" });
        return;
    }

    const isUserInChat = chat.users.some(user => user.toString() === userId.toString());
    if (!isUserInChat) {
        res.status(403).json({ message: "you are not a member of this chat" });
        return;
    }

    const result = await Message.updateMany(
        { chatId, seen: false, sender: { $ne: userId } },
        { $set: { seen: true, seenAt: new Date() } }
    );

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
    if (!otherUserId) {
        res.status(404).json({ message: "other user not found" });
        return;
    }

    // socket work
    if (result.modifiedCount > 0) {
        // Emit a socket event to notify the other user that the messages have been marked as seen
        const otherUserSocketId = UserSocketMap[otherUserId.toString()];
        if (otherUserSocketId) {
            io.to(otherUserSocketId).emit("messagesSeen", { chatId, seenBy: userId });
        }
    }

    try {
        const token = req.headers.authorization;
        const { data } = await axios.get<IUser>(
            `${process.env.USER_SERVICE_URL}/api/v1/user/${otherUserId}`,
            token ? { headers: { Authorization: token } } : undefined
        );
        res.json({ messages, otherUser: data });
    } catch (error) {
        console.error(`Error fetching user ${otherUserId}:`, error);
        res.json({
            messages,
            otherUser: {
                _id: otherUserId,
                name: "Unknown Gamer",
                email: "",
            }
        });
    }
})

export const createGroupChat = TryCatch<AuthenticatedRequest>(async (req, res) => {
    const userId = req.user?._id;
    const { groupName, userIds } = req.body;

    if (!userId) {
        res.status(401).json({ message: "please login" });
        return;
    }

    if (!groupName || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ message: "groupName and non-empty userIds are required" });
        return;
    }

    const members = Array.from(new Set([userId, ...userIds]));

    const newChat = await Chat.create({
        users: members,
        isGroup: true,
        groupName,
    });

    members.forEach((memberId) => {
        const socketId = UserSocketMap[memberId.toString()];
        if (socketId) {
            io.to(socketId).emit("newChat", { chatId: newChat._id });
        }
    });

    const creatorName = req.user?.name || "A gamer";
    for (const memberId of userIds) {
        if (memberId.toString() === userId.toString()) continue;
        try {
            const token = req.headers.authorization;
            const { data: memberUser } = await axios.get<IUser>(
                `${process.env.USER_SERVICE_URL}/api/v1/user/${memberId}`,
                token ? { headers: { Authorization: token } } : undefined
            );
            if (memberUser && memberUser.email) {
                await publishToQueue("send-invite", {
                    senderName: creatorName,
                    invitedEmail: memberUser.email,
                    invitedName: memberUser.name,
                    chatName: groupName
                });
            }
        } catch (e) {
            console.error("Failed to publish invite for group member:", memberId);
        }
    }

    res.status(201).json({ message: "group chat created", chat: newChat._id });
});

export const inviteUserChat = TryCatch<AuthenticatedRequest>(async (req, res) => {
    const userId = req.user?._id;
    const { query } = req.body;

    if (!userId) {
        res.status(401).json({ message: "please login" });
        return;
    }

    if (!query || typeof query !== "string" || !query.trim()) {
        res.status(400).json({ message: "Search query (id or email) is required" });
        return;
    }

    const cleanQuery = query.trim();
    let invitedUser: any = null;
    const token = req.headers.authorization;

    try {
        if (cleanQuery.includes("@")) {
            const normalizedEmail = cleanQuery.toLowerCase();
            const { data } = await axios.post(
                `${process.env.USER_SERVICE_URL}/api/v1/user/find-or-create`,
                { email: normalizedEmail },
                {
                    headers: token ? { Authorization: token } : {},
                }
            );
            invitedUser = data;
        } else {
            const { data } = await axios.get(
                `${process.env.USER_SERVICE_URL}/api/v1/user/${cleanQuery}`,
                token ? { headers: { Authorization: token } } : undefined
            );
            invitedUser = data;
        }
    } catch (err: any) {
        console.error("Failed to query user service in inviteUserChat:", err.message);
        res.status(404).json({ message: "Invited gamer not found. Please enter a valid email address." });
        return;
    }

    if (!invitedUser || !invitedUser._id) {
        res.status(404).json({ message: "Invited gamer not found. Please enter a valid email address." });
        return;
    }

    const userIdStr = userId.toString();
    const otherUserId = invitedUser._id.toString();

    if (otherUserId === userIdStr) {
        res.status(400).json({ message: "Cannot create a chat with yourself" });
        return;
    }

    const existingChat = await Chat.findOne({
        isGroup: false,
        users: { $all: [userIdStr, otherUserId], $size: 2 },
    });

    if (existingChat) {
        res.status(200).json({ message: "chat already exists", chat: existingChat._id });
        return;
    }

    const newChat = await Chat.create({
        users: [userIdStr, otherUserId],
        isGroup: false,
    });

    const senderName = req.user?.name || "A gamer";

    // Create an initial invitation greeting message so the chat isn't blank
    const initialMessage = await Message.create({
        chatId: newChat._id,
        sender: userIdStr,
        text: `⚡ Hey! I invited you to chat on ZAP!`,
        seen: false,
    });

    newChat.latestMessage = {
        text: initialMessage.text || "⚡ Hey! I invited you to chat on ZAP!",
        sender: userIdStr,
    };
    await newChat.save();

    const socketId = UserSocketMap[otherUserId];
    if (socketId) {
        io.to(socketId).emit("newChat", { chatId: newChat._id });
    }

    await publishToQueue("send-invite", {
        senderName,
        invitedEmail: invitedUser.email,
        invitedName: invitedUser.name,
        chatName: ""
    });

    res.status(201).json({ message: "chat created and user invited", chat: newChat._id });
});