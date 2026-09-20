import express from 'express';
import rateLimit from 'express-rate-limit';
import { getAllUsers, getAUser, LoginController, myProfile, updateName, VerifyController, findOrCreateUser, healthCheck, cronDbData } from '../controllers/User.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const Userrouter = express.Router();

// Dedicated Health and DB Query APIs for Cron Jobs (Not used anywhere else)
Userrouter.get("/health", healthCheck);
Userrouter.get("/cron/db-data", cronDbData);

const authWindowMs = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const authMax = Number(process.env.AUTH_RATE_LIMIT_MAX) || 30;

// Configurable rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: authWindowMs,
    max: authMax,
    message: { message: "Too many authentication attempts from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

Userrouter.post("/login", authLimiter, LoginController);
Userrouter.post("/verify", authLimiter, VerifyController);
Userrouter.get("/me", isAuth, myProfile);
Userrouter.get("/users/all", isAuth, getAllUsers);
Userrouter.get("/user/:id", getAUser);
Userrouter.put("/updatename", isAuth, updateName);
Userrouter.post("/updatename", isAuth, updateName);
Userrouter.post("/user/find-or-create", isAuth, findOrCreateUser);

export default Userrouter;