import { TryCatch } from "../components/reuse_code.js";
import { redisClient } from "../config/redis.js";
import { publishToQueue } from "../config/rabbitmq.js"
import { User } from "../models/User.models.js";
import { generateToken } from "../config/generateToken.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const LoginController = TryCatch(async (req, res) => {
    const { email } = req.body

    const rateLimitKey = `otp:rate:limit:${email}`
    const rateLimit = await redisClient.get(rateLimitKey);

    if (rateLimit) {
        res.status(409).json({ message: "to many request at a time,please wait for some time" })
        return;
    }

    const otp = Math.floor(10000 + Math.random() * 9000).toString()
    const otpkey = `otp:${email}`
    await redisClient.set(otpkey, otp, { EX: 300 })
    await redisClient.set(rateLimitKey, "true", { EX: 60 })

    const message = {
        email,
        otp,
    };

    await publishToQueue("send-otp", message)
    res.status(200).json({ message: "otp send to your mail" })

})

export const VerifyController = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body

    if (!email || !enteredOtp) {
        res.status(400).json({ message: "email and otp both required" })
        return;
    }

    const otpkey = `otp:${email}`

    const storedotp = await redisClient.get(otpkey)

    if (!storedotp || storedotp !== enteredOtp) {
        res.status(400).json({ message: "Invalid or expired otp" })
        return;
    }

await redisClient.del(otpkey)
let user = await User.findOne({email})

if(!user){
    const name = email.slice(0,8);
    user = await User.create({name,email});
}
const token =generateToken(user);
res.json({
    message:"user verified",
    user,
    token
});

}) 

export const myProfile = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    res.json(user);
})

export const updateName = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = await User.findById(req.user?._id)
    if(!user){
        res.status(401).json({message:"user not found"})
        return;
    }
    user.name = req.body.name;
    await user.save();

    const token = generateToken(user)
    res.json({
        message :"user updated",
        token,
        user
    })

})

export const getAllUsers = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const users = await User.find();
    res.json(users)
})

export const getAUser = TryCatch(async(req,res)=>{
    const user = await User.findById(req.params.id);
    res.json(user)
})

export const findOrCreateUser = TryCatch(async(req,res)=>{
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "email is required" });
        return;
    }
    let user = await User.findOne({ email });
    if (!user) {
        const name = email.split('@')[0] || "gamer";
        user = await User.create({ name, email });
    }
    res.json(user);
})