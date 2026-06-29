import jwt from "jsonwebtoken"
import dotenv from 'dotenv'


dotenv.config()
const JWT = process.env.JWT_SECRET as string


export const generateToken = (user:any)=>{
    return jwt.sign({user}, JWT ,{expiresIn:"15d"})
}