import { TryCatch } from "../components/reusecode.js";
import { Chat } from "../models/chats.model.js";
import { Message } from "../models/Message.models.js";
import type { AuthenticatedRequest, IUser } from "../middlewares/isAuth.js";
import axios from "axios";

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

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    const chatwithUserData = await Promise.all(
        chats.map(async (chat) => {
            const otherUserId = chat.users.find((id) => id.toString() !== userId);

            const unseenCount = await Message.countDocuments({
                chatId: chat._id,
                seen: false,
                sender: { $ne: userId }
            });

            const chatData = {
                ...chat.toObject(),
                latestMessage: chat.latestMessage || null,
                unseenCount,
            };

            const unknownUser = {
                _id: otherUserId,
                name: "Unknown user name",
                email: "Unknown user email",
            };

            if (!otherUserId) {
                return { user: unknownUser, chat: chatData };
            }

            try {
                const { data } = await axios.get<IUser>(
                    `${process.env.USER_SERVICE_URL}/api/v1/user/${otherUserId}`
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
    const {chatId ,text} = req.body
    const imageFile = req.file

    if(!senderId){
        res.status(401).json({message:"please login"})
        return
    }

    if(!chatId){
        res.status(400).json({message:"chatId is required"})
        return
    }

    const chat = await Chat.findById(chatId)
})