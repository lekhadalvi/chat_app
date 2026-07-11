import { TryCatch } from "../components/reusecode.js";
import { Chat } from "../models/chats.model.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";

export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
        res.status(400).json({ message: "otherUserId is required" });
        return;
    }

    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
        res.status(200).json({ message: "chat already exists", chat: existingChat._id, });
        return;
    }

    const newChat = await Chat.create({
        users: [userId, otherUserId],
    });

    res.status(201).json({ message: "chat created", chat: newChat._id });
});

export const fetchAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(400).json({ message: "user id missing" });
        return;
    }

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
    res.status(200).json({ chats });

    const chatwithUserData = await Promise.all(
        chats.map(async(chat)=>{
            const otherUserId =chat.users.find((id)>id !== userId)
        })
    )
})