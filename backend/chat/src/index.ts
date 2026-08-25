import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.route.js';
import { app, server } from './config/sockets.js';
import { connectRabbitmq } from './config/rabbitmq.js';

dotenv.config();

const port = process.env.PORT || 5002;

// Security Middleware
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({ limit: process.env.MAX_BODY_LIMIT || "5mb" }));

connectDB();
connectRabbitmq();

app.use('/api/v1', chatRoutes);

// Global JSON Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error in Chat Service:", err.message || err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

server.listen(port, () => {
  console.log(`🚀 Chat & Socket Service running securely on port ${port}`);
});