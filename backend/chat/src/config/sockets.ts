import { Socket,Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const UserSocketMap: Record<string, string> = {};
io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);
  const userId = socket.handshake.query.userId as string | undefined;
  if (userId !== undefined) {
    UserSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }
  io.emit("getOnlineUsers", Object.keys(UserSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (userId) {
      delete UserSocketMap[userId];
      console.log(`User ${userId} disconnected and removed from UserSocketMap`);
      io.emit("getOnlineUsers", Object.keys(UserSocketMap));
    }
  });

  socket.on("typing", (data: { chatId: string; userId: string }) => {
    socket.to(data.chatId).emit("typing", data);
  });

  socket.on("stopTyping", (data: { chatId: string; userId: string }) => {
    socket.to(data.chatId).emit("stopTyping", data);
  });

  socket.on("online", (id: string) => {
    UserSocketMap[id] = socket.id;
    io.emit("getOnlineUsers", Object.keys(UserSocketMap));
  });

  socket.on("offline", (id: string) => {
    delete UserSocketMap[id];
    io.emit("getOnlineUsers", Object.keys(UserSocketMap));
  });

  socket.on("joinchat", (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on("leavechat", (chatId: string) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });
});

io.on("error", (error: Error) => {
  console.error(`Socket.IO error: ${error}`);
});

export {app, server, io, UserSocketMap};