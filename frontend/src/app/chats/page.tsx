"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/layout/AppShell";
import { Chat, User, Message } from "../../types";
import { mockChats, currentUser as defaultUser } from "../../lib/mock-data";

export default function ChatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>(defaultUser);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string>("chat_1");

  // Load custom user info from localStorage if available
  useEffect(() => {
    const auth = localStorage.getItem("zap_authenticated");
    if (!auth) {
      // Redirect back to login if not authenticated
      router.push("/login");
      return;
    }

    const savedName = localStorage.getItem("zap_user_name");
    if (savedName) {
      setUser((prev) => ({
        ...prev,
        name: savedName,
      }));
    }
  }, [router]);

  const handleSendMessage = (chatId: string, content: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      senderId: user.id,
      content,
      timestamp: timeStr,
    };

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );

    // Mock automatic reply from a squadmate or DM member to make the app interactive!
    setTimeout(() => {
      const activeChat = chats.find((c) => c.id === chatId);
      if (!activeChat) return;

      const mockReplies = [
        "OH DAMN! That's awesome!",
        "Yo, who let the chaos out? 😂",
        "Wait, are you coding this right now?",
        "Double-borders are looking super clean!",
        "LMAO let's gooo 🚀",
        "Indeed. Ready when you are!",
      ];
      
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      const replierId = activeChat.isGroup ? "user_2" : "user_1"; // Default mockup replier

      const replyMsg: Message = {
        id: `reply_${Date.now()}_${Math.random()}`,
        senderId: replierId,
        content: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, replyMsg],
            };
          }
          return chat;
        })
      );
    }, 1200);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    
    // Clear unread count on selection
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unreadCount: 0,
          };
        }
        return chat;
      })
    );
  };

  const handleToggleBlock = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            isBlocked: !chat.isBlocked,
          };
        }
        return chat;
      })
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-8 bg-transparent">
      <div className="w-full h-screen md:h-[85vh] max-w-[1200px] flex">
        <AppShell
          currentUser={user}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onSendMessage={handleSendMessage}
          onToggleBlock={handleToggleBlock}
        />
      </div>
    </div>
  );
}
