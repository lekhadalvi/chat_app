"use client";

import React, { useEffect } from "react";
import { AppProvider } from "../../context/AppContext";
import { SocketProvider, useSocket } from "../../context/SocketContext";
import { AppShell } from "../../components/layout/AppShell";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

function ChatsDashboard() {
  const { user, verifyAuth, loading, updateName } = useAuth();
  const { 
    chats, 
    setChats,
    activeChatId, 
    setActiveChatId, 
    setMobileView,
    fetchChatsList, 
    sendMessage, 
    createChat 
  } = useChat();
  const { socket } = useSocket();

  // Verify auth on mount
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Load chat list once user is verified
  useEffect(() => {
    if (user.id) {
      fetchChatsList();
    }
  }, [user.id, fetchChatsList]);

  // Auto-select chat from URL parameter ?chatId= or localStorage pending invite
  useEffect(() => {
    if (chats.length > 0) {
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const targetChatId = params?.get("chatId") || (typeof window !== "undefined" ? localStorage.getItem("zap_pending_chat") : null);
      if (targetChatId && activeChatId !== targetChatId) {
        const found = chats.find((c) => c.id === targetChatId);
        if (found) {
          setActiveChatId(targetChatId);
          setMobileView("chat");
          if (typeof window !== "undefined") {
            localStorage.removeItem("zap_pending_chat");
          }
        }
      }
    }
  }, [chats, activeChatId, setActiveChatId, setMobileView]);

  // Join/leave chat rooms for real-time messaging
  useEffect(() => {
    if (!socket || !activeChatId) return;

    socket.emit("joinchat", activeChatId);

    return () => {
      socket.emit("leavechat", activeChatId);
    };
  }, [socket, activeChatId]);

  // Listen for real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { chatId: string; message: any }) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === data.chatId) {
            // Prevent duplicate message rendering
            const exists = c.messages.some((m) => m.id === data.message.id);
            if (exists) return c;

            return {
              ...c,
              lastMessage: data.message.content,
              lastMessageTime: data.message.timestamp,
              messages: [...c.messages, data.message],
              unreadCount: c.id === activeChatId ? c.unreadCount : c.unreadCount + 1
            };
          }
          return c;
        })
      );
    };

    const handleMessagesSeen = (data: { chatId: string; seenBy: string }) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === data.chatId) {
            return {
              ...c,
              unreadCount: 0
            };
          }
          return c;
        })
      );
    };

    const handleNewChat = () => {
      fetchChatsList();
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("newChat", handleNewChat);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("newChat", handleNewChat);
    };
  }, [socket, setChats, activeChatId, fetchChatsList]);
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f7f3] select-none">
        <div className="w-16 h-20 text-zap-purple animate-bounce mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[2px_2px_0px_#000]" fill="currentColor" stroke="black" strokeWidth="4">
            <polygon points="60,5 20,55 50,55 40,95 80,45 50,45" />
          </svg>
        </div>
        <h2 className="font-lilita text-xl uppercase tracking-wider text-black animate-pulse">
          CONNECTING TO SQUAD...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-8 bg-transparent">
      <div className="w-full h-screen md:h-[85vh] max-w-[1200px] flex">
        <AppShell />
      </div>
    </div>
  );
}

export default function ChatsPage() {
  return (
    <AppProvider>
      <SocketProvider>
        <ChatsDashboard />
      </SocketProvider>
    </AppProvider>
  );
}
