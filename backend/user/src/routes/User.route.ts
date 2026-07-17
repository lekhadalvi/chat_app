import express from 'express';
import { getAllUsers, getAUser, LoginController, myProfile, updateName, VerifyController, findOrCreateUser } from '../controllers/User.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const Userrouter = express.Router()

Userrouter.post("/login",LoginController)
Userrouter.post("/verify",VerifyController)
Userrouter.get("/me",isAuth,myProfile)
Userrouter.get("/users/all",isAuth,getAllUsers)
Userrouter.get("/user/:id",getAUser)
Userrouter.get("/updatename",isAuth,updateName)
Userrouter.post("/user/find-or-create",isAuth,findOrCreateUser)

export default Userrouter