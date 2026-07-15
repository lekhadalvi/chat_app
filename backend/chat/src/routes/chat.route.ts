import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { createNewChat, fetchAllChats, getMessageByChat, sendMessage } from '../controllers/chat.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/chat/new',isAuth, createNewChat);
router.get('/chat/all',isAuth, fetchAllChats);
router.post('/chat/message', isAuth, upload.single('image'), sendMessage);
router.get('/chat/message/:chatId', isAuth, getMessageByChat);

export default router;