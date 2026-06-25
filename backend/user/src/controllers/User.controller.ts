import { TryCatch } from "../components/reuse_code.js";
import { redisClient } from "../config/redis.js";


export const LoginController = TryCatch(async(req,res)=>{
    const {email} = req.body

    const rateLimitKey = `otp:rate:limit:${email}`
    const rateLimit = await redisClient

    if(rateLimit) {
        
    }
})