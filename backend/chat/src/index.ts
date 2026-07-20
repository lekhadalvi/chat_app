import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.route.js';
import { app, server } from './config/sockets.js';
import { connectRabbitmq } from './config/rabbitmq.js';

dotenv.config();

const port = process.env.PORT;

connectDB();
connectRabbitmq();

app.use(express.json());
app.use('/api/v1', chatRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});