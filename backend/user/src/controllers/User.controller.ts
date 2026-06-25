import { TryCatch } from "../components/reuse_code.js";
import { redisClient } from "../config/redis.js";
import {publishToQueue} from "../config/rabbitmq.js"

export const LoginController = TryCatch(async(req,res)=>{
    const {email} = req.body

    const rateLimitKey = `otp:rate:limit:${email}`
    const rateLimit = await redisClient.get(rateLimitKey);

    if(rateLimit) {
        res.status(409).json({message:"to many request at a time,please wait for some time"})
        return ;
    }

    const otp = Math.floor(10000 + Math.random()* 9000).toString()
    const otpkey = `otp:${email}`
    await redisClient.set(otpkey,otp,{EX:300})
    await redisClient.set(rateLimitKey,"true",{EX:60})

    const message = {
        to : email,
        subject :"your otp code is",
        body:`your otp is ${otp}.only valid for 5 min`

    };

    await publishToQueue("send otp" ,message)
    res.status(200).json({message:"otp send to your mail"})

})
