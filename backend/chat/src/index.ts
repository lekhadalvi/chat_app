import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.route.js';
import { app, server } from './config/sockets.js';

dotenv.config();

const port = process.env.PORT;

connectDB();
app.use(express.json());
app.use('/api/v1', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});