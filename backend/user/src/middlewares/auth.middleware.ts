import type { Request } from "express";
import { TryCatch } from "../components/reuse_code.js";
import type { IUser } from "../models/User.models.js";
import jwt, { type JwtPayload } from "jsonwebtoken"

export interface AuthenticatedRequest extends Request{
    user?: IUser | null;
}

export const isAuth = TryCatch(async(req: AuthenticatedRequest, res, next)=>{

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Please log in" });
        return; 
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        res.status(401).json({message:"invalid token"})
        return;
    }

    const decodevalue = jwt.verify(token ,process.env.JWT_SECRET as string) as JwtPayload
    if(!decodevalue || !decodevalue.user){
        res.status(401).json({message:"invalid token"})
        return;
    }

    req.user = decodevalue.user
    next();
})