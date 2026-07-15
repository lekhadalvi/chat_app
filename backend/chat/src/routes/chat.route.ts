import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { createNewChat, fetchAllChats, sendMessage } from '../controllers/chat.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/chat/new',isAuth, createNewChat);
router.get('/chat/all',isAuth, fetchAllChats);
router.post('/chat/message',isAuth,upload.single('image') , sendMessage);


export default router;