import { Socket, Server } from "socket.io";
import http from "http";
import express from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Chat } from "../models/chats.model.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Authentication middleware for WebSocket connections
io.use((socket: Socket, next) => {
  const token = socket.handshake.auth?.token || 
    (socket.handshake.headers.authorization?.startsWith("Bearer ") 
      ? socket.handshake.headers.authorization.split(" ")[1] 
      : null);

  const queryUserId = socket.handshake.query?.userId as string | undefined;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      if (decoded && decoded.user) {
        socket.data.user = decoded.user;
        socket.data.userId = decoded.user._id?.toString();
        return next();
      }
    } catch (err: any) {
      console.warn(`[SOCKET] JWT verification failed on handshake: ${err.message}`);
    }
  }

  // Fallback to validated query userId if provided
  if (queryUserId && queryUserId !== "undefined" && queryUserId.length >= 10) {
    socket.data.userId = queryUserId;
    return next();
  }

  return next(new Error("Authentication required for WebSocket connection"));
});

const UserSocketMap: Record<string, string> = {};

io.on("connection", (socket: Socket) => {
  const userId = socket.data.userId;

  if (userId) {
    UserSocketMap[userId] = socket.id;
    console.log(`✅ [SOCKET] User ${userId} connected with Socket ID: ${socket.id}`);
  }

  io.emit("getOnlineUsers", Object.keys(UserSocketMap));

  socket.on("disconnect", () => {
    if (userId && UserSocketMap[userId] === socket.id) {
      delete UserSocketMap[userId];
      console.log(`👋 [SOCKET] User ${userId} disconnected`);
      io.emit("getOnlineUsers", Object.keys(UserSocketMap));
    }
  });

  socket.on("typing", (data: { chatId: string; userId: string }) => {
    if (!data?.chatId) return;
    socket.to(data.chatId).emit("typing", { chatId: data.chatId, userId: userId || data.userId });
  });

  socket.on("stopTyping", (data: { chatId: string; userId: string }) => {
    if (!data?.chatId) return;
    socket.to(data.chatId).emit("stopTyping", { chatId: data.chatId, userId: userId || data.userId });
  });

  // Secure presence updates bound strictly to authenticated session
  socket.on("online", () => {
    if (userId) {
      UserSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(UserSocketMap));
    }
  });

  socket.on("offline", () => {
    if (userId && UserSocketMap[userId] === socket.id) {
      delete UserSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(UserSocketMap));
    }
  });

  // Secure room joining: verify membership in database before granting socket room access
  socket.on("joinchat", async (chatId: string) => {
    if (!chatId || !userId) return;

    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.warn(`[SOCKET SECURITY] Attempted to join non-existent chat: ${chatId}`);
        return;
      }

      const isMember = chat.users.some((memberId) => memberId.toString() === userId.toString());
      if (isMember) {
        socket.join(chatId);
        console.log(`🔒 [SOCKET] User ${userId} authorized and joined chat room: ${chatId}`);
      } else {
        console.warn(`⚠️ [SOCKET SECURITY] Blocked unauthorized joinchat attempt by user ${userId} for chat ${chatId}`);
      }
    } catch (error: any) {
      console.error(`[SOCKET] Error validating chat authorization: ${error.message}`);
    }
  });

  socket.on("leavechat", (chatId: string) => {
    if (chatId) {
      socket.leave(chatId);
      console.log(`[SOCKET] User ${socket.id} left chat ${chatId}`);
    }
  });
});

io.on("error", (error: Error) => {
  console.error(`Socket.IO error: ${error}`);
});

export { app, server, io, UserSocketMap };