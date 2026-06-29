import express from 'express';
import { LoginController, myProfile, VerifyController } from '../controllers/User.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const Userrouter = express.Router()

Userrouter.post("/login",LoginController)
Userrouter.post("/verify",VerifyController)
Userrouter.get("/me",isAuth,myProfile)

export default Userrouter