import React from "react";
import { Chat } from "../../types";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";
import { useSocket } from "../../context/SocketContext";

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  const { onlineUsers } = useSocket();
  const lastMsg = chat.messages[chat.messages.length - 1];
  const rawLastText = chat.lastMessage || (lastMsg ? lastMsg.content : "No messages yet.");
  const lastText = rawLastText.startsWith("IMAGE:") ? "📸 Polaroid Photo" : rawLastText;
  const displayTime = chat.lastMessageTime || (lastMsg ? lastMsg.timestamp : "");
  
  const isOnline = chat.otherUserId ? onlineUsers?.includes(chat.otherUserId) : false;
  const isUnread = chat.unreadCount > 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 p-4 border-[3px] border-black rounded-[20px] cursor-pointer select-none transition-all",
        isActive
          ? "bg-zap-yellow transform -translate-x-[2px] -translate-y-[2px] shadow-[4px_4.5px_0px_#000]"
          : "bg-white hover:bg-neutral-50 hover:transform hover:-translate-y-[1px] shadow-[4px_4.5px_0px_#000]"
      )}
    >
      <Avatar
        name={chat.name}
        color={chat.avatarColor}
        size="md"
        isOnline={isOnline}
      />

      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <div className="flex items-baseline justify-between mb-0.5">
          <h4 className="font-lilita text-sm md:text-md uppercase truncate tracking-wide flex items-center gap-1 text-black">
            {chat.name}
          </h4>
          <span className={cn("font-lilita text-[10px] whitespace-nowrap", isUnread ? "text-[#FF00E0]" : "text-black/45")}>
            {displayTime}
          </span>
        </div>
        <p className={cn("text-xs truncate font-semibold leading-normal font-sans", isUnread ? "text-black font-bold" : "text-black/60")}>
          {lastText}
        </p>
      </div>

      {isUnread && (
        <div className="w-5 h-5 bg-[#FF00E0] border-[2px] border-black rounded-full flex items-center justify-center font-lilita text-[9px] text-white shadow-[1px_1px_0px_#000]">
          {chat.unreadCount}
        </div>
      )}
    </div>
  );
}
