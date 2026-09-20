import crypto from "crypto";
import mongoose from "mongoose";
import { TryCatch } from "../components/reuse_code.js";
import { redisClient } from "../config/redis.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { User } from "../models/User.models.js";
import { generateToken } from "../config/generateToken.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const LoginController = TryCatch(async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
        res.status(400).json({ message: "A valid email is required" });
        return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const rateLimitKey = `otp:rate:limit:${normalizedEmail}`;
    const rateLimit = await redisClient.get(rateLimitKey);

    const otpRateLimitSecs = Number(process.env.OTP_RATE_LIMIT_SECONDS) || 60;
    const otpExpirySecs = Number(process.env.OTP_EXPIRY_SECONDS) || 300;
    const otpMaxAttempts = Number(process.env.OTP_MAX_ATTEMPTS) || 5;

    if (rateLimit) {
        res.status(409).json({ message: `Too many requests. Please wait ${otpRateLimitSecs} seconds before requesting another OTP.` });
        return;
    }

    // Cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpkey = `otp:${normalizedEmail}`;
    const attemptKey = `otp:attempts:${normalizedEmail}`;

    await redisClient.set(otpkey, otp, { EX: otpExpirySecs });
    await redisClient.del(attemptKey);
    await redisClient.set(rateLimitKey, "true", { EX: otpRateLimitSecs });

    if (process.env.NODE_ENV !== "production") {
        console.log(`[USER SERVICE] 🔑 Generated OTP for ${normalizedEmail}: ${otp}`);
    }

    const message = {
        email: normalizedEmail,
        otp,
    };

    const published = await publishToQueue("send-otp", message);
    if (!published) {
        console.warn(`[USER SERVICE] ⚠️ Could not send to RabbitMQ, but OTP is saved in Redis`);
    }

    res.status(200).json({ message: "OTP sent to your email!" });
});

export const VerifyController = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;

    if (!email || !enteredOtp) {
        res.status(400).json({ message: "Email and OTP are both required" });
        return;
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(enteredOtp).trim();
    const otpkey = `otp:${normalizedEmail}`;
    const attemptKey = `otp:attempts:${normalizedEmail}`;

    const otpExpirySecs = Number(process.env.OTP_EXPIRY_SECONDS) || 300;
    const otpMaxAttempts = Number(process.env.OTP_MAX_ATTEMPTS) || 5;

    const storedotp = await redisClient.get(otpkey);

    if (!storedotp) {
        res.status(400).json({ message: "Invalid or expired OTP. Please request a new one." });
        return;
    }

    // Track failed verification attempts
    const attempts = await redisClient.incr(attemptKey);
    if (attempts === 1) {
        await redisClient.expire(attemptKey, otpExpirySecs);
    }

    // Lockout & eviction if attempts exceed threshold
    if (attempts > otpMaxAttempts) {
        await redisClient.del(otpkey);
        await redisClient.del(attemptKey);
        res.status(429).json({ message: "Too many failed attempts. This OTP has been invalidated." });
        return;
    }

    if (storedotp !== cleanOtp) {
        const remaining = otpMaxAttempts - attempts;
        res.status(400).json({ message: `Invalid OTP. ${remaining} attempt(s) remaining.` });
        return;
    }

    // Successful verification -> clean up Redis keys
    await redisClient.del(otpkey);
    await redisClient.del(attemptKey);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        const name = normalizedEmail.slice(0, 8);
        user = await User.create({ name, email: normalizedEmail });
    }

    const token = generateToken(user);
    res.json({
        message: "User verified",
        user,
        token
    });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    res.json(user);
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
        res.status(400).json({ message: "Valid name is required" });
        return;
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    user.name = name.trim().slice(0, 30);
    await user.save();

    const token = generateToken(user);
    res.json({
        message: "User updated",
        token,
        user
    });
});

export const getAllUsers = TryCatch(async (req: AuthenticatedRequest, res) => {
    const users = await User.find().select("-__v");
    res.json(users);
});

export const getAUser = TryCatch(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid user ID format" });
        return;
    }

    const user = await User.findById(id).select("-__v");
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
});

export const findOrCreateUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
        res.status(400).json({ message: "Valid email is required" });
        return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        const name = normalizedEmail.split('@')[0] || "gamer";
        user = await User.create({ name: name.slice(0, 30), email: normalizedEmail });
    }
    res.json(user);
});

export const healthCheck = TryCatch(async (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "user-service",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

export const cronDbData = TryCatch(async (req, res) => {
    const totalUsers = await User.estimatedDocumentCount();
    const sampleData = await User.find({}, "_id name email createdAt")
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean();

    res.status(200).json({
        status: "ok",
        message: "Database ping and data fetch successful for cron job",
        database: "MongoDB Connected",
        totalUsers,
        sampleData,
        timestamp: new Date().toISOString(),
    });
});