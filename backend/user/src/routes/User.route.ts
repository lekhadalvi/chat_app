import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllUsers, getAUser, LoginController, myProfile, updateName, VerifyController, findOrCreateUser } from '../controllers/User.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const Userrouter = express.Router();

// Strict rate limiter for authentication endpoints (15 requests per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { message: "Too many authentication attempts from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

Userrouter.post("/login", authLimiter, LoginController);
Userrouter.post("/verify", authLimiter, VerifyController);
Userrouter.get("/me", isAuth, myProfile);
Userrouter.get("/users/all", isAuth, getAllUsers);
Userrouter.get("/user/:id", isAuth, getAUser);
Userrouter.put("/updatename", isAuth, updateName);
Userrouter.post("/user/find-or-create", isAuth, findOrCreateUser);

export default Userrouter;