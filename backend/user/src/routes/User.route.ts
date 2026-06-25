import express from 'express';
import { LoginController } from '../controllers/User.controller.js';

const Userrouter = express.Router()

Userrouter.post("/login",LoginController)

export default Userrouter