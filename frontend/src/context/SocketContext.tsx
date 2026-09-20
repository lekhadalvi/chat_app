"use client";

import { io, Socket } from "socket.io-client";
import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers?: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

interface ProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: ProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user.id) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("zap_token") : null;

    // Connect to the Chat Service socket.io server on port 5002
    const chatServiceUrl = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL ;
    const newSocket = io(chatServiceUrl, {
      auth: { token },
      query: { userId: user.id },
    });

    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });
    return () => {
      newSocket.disconnect();
    };
  }, [user.id]);

  return (
    <SocketContext.Provider value={{ socket , onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
export const useSocket = () => useContext(SocketContext);