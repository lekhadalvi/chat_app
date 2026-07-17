import React, { useEffect, useState } from "react";
import { Chat } from "../../types";
import { Avatar } from "../ui/Avatar";
import { useSocket } from "../../context/SocketContext";

interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void; // Support back button on mobile
}

export function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  const { socket, onlineUsers } = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket || !chat.id) return;

    const handleTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chat.id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chat.id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      setIsTyping(false);
    };
  }, [socket, chat.id]);

  const isOnline = chat.otherUserId ? onlineUsers?.includes(chat.otherUserId) : false;
  const subtitle = isTyping 
    ? "ONLINE • TYPING..." 
    : (isOnline ? "ONLINE" : "OFFLINE");

  return (
    <div className="flex items-center justify-between p-4 border-b-[3.5px] border-black bg-white select-none relative">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden w-9 h-9 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer mr-1 active:translate-y-[1px] active:shadow-none"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <Avatar
          name={chat.name}
          color={chat.avatarColor}
          size="md"
          isOnline={isOnline}
        />
        
        <div className="flex flex-col justify-center">
          <h3 className="font-lilita text-lg md:text-xl uppercase tracking-wide flex items-center gap-1">
            {chat.name}
          </h3>
          <span className={`font-black text-[10px] tracking-widest ${isTyping ? "text-[#FF00E0]" : "text-black/60"}`}>
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
