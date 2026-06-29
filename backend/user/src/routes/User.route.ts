import express from 'express';
import { getAllUsers, getAUser, LoginController, myProfile, updateName, VerifyController } from '../controllers/User.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const Userrouter = express.Router()

Userrouter.post("/login",LoginController)
Userrouter.post("/verify",VerifyController)
Userrouter.get("/me",isAuth,myProfile)
Userrouter.post("/users/all",isAuth,getAllUsers)
Userrouter.post("/user/:id",getAUser)
Userrouter.get("/updatename",isAuth,updateName)

export default Userrouter