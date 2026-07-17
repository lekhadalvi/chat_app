import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { createNewChat, fetchAllChats, getMessageByChat, sendMessage, createGroupChat, inviteUserChat } from '../controllers/chat.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/chat/new',isAuth, createNewChat);
router.get('/chat/all',isAuth, fetchAllChats);
router.post('/chat/message', isAuth, upload.single('image'), sendMessage);
router.get('/chat/message/:chatId', isAuth, getMessageByChat);
router.post('/chat/group', isAuth, createGroupChat);
router.post('/chat/invite', isAuth, inviteUserChat);

export default router;