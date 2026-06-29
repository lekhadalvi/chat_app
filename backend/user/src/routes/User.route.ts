import express from 'express';
import { LoginController, VerifyController } from '../controllers/User.controller.js';

const Userrouter = express.Router()

Userrouter.post("/login",LoginController)
Userrouter.post("/verify",VerifyController)

export default Userrouter