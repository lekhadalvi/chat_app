import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const JWT = process.env.JWT_SECRET as string;
const expiresIn = (process.env.JWT_EXPIRES_IN || "1d") as any;

export const generateToken = (user: any) => {
    return jwt.sign({ user }, JWT, { expiresIn });
};