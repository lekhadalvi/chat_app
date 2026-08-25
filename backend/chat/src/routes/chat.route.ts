import express from 'express';
import rateLimit from 'express-rate-limit';
import { isAuth } from '../middlewares/isAuth.js';
import { createNewChat, fetchAllChats, getMessageByChat, sendMessage, createGroupChat, inviteUserChat } from '../controllers/chat.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Message sending rate limiter (up to 60 messages per minute)
const messageLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { message: "Slow down! You are sending messages too fast." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/chat/new', isAuth, createNewChat);
router.get('/chat/all', isAuth, fetchAllChats);
router.post('/chat/message', isAuth, messageLimiter, upload.single('image'), sendMessage);
router.get('/chat/message/:chatId', isAuth, getMessageByChat);
router.post('/chat/group', isAuth, createGroupChat);
router.post('/chat/invite', isAuth, inviteUserChat);

export default router;