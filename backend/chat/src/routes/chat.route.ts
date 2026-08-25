import express from 'express';
import rateLimit from 'express-rate-limit';
import { isAuth } from '../middlewares/isAuth.js';
import { createNewChat, fetchAllChats, getMessageByChat, sendMessage, createGroupChat, inviteUserChat } from '../controllers/chat.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

const msgWindowMs = Number(process.env.MESSAGE_RATE_LIMIT_WINDOW_MS) || 60 * 1000;
const msgMax = Number(process.env.MESSAGE_RATE_LIMIT_MAX) || 60;

// Configurable message sending rate limiter
const messageLimiter = rateLimit({
    windowMs: msgWindowMs,
    max: msgMax,
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