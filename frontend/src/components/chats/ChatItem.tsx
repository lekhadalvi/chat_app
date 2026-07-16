import React from "react";
import { Chat } from "../../types";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  // Find last message snippet
  const lastMsg = chat.messages[chat.messages.length - 1];
  const lastText = lastMsg ? lastMsg.content : "No messages yet.";
  const lastTime = lastMsg ? lastMsg.timestamp : "";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3.5 border-b-[3px] border-black cursor-pointer select-none transition-all",
        isActive
          ? "bg-zap-yellow transform -translate-x-[2px] -translate-y-[2px] shadow-[3px_3px_0px_#000]"
          : "bg-white hover:bg-neutral-50 hover:transform hover:-translate-y-[1px]"
      )}
    >
      <Avatar
        name={chat.name.replace(/[^\w\s]/g, "").trim() || chat.name}
        color={chat.avatarColor}
        size="md"
        isOnline={!chat.isGroup} // Mock online state for DM chats
      />

      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <div className="flex items-baseline justify-between mb-0.5">
          <h4 className="font-lilita text-sm md:text-md uppercase truncate tracking-wide text-black">
            {chat.name}
          </h4>
          <span className="font-semibold text-[10px] text-black/60 whitespace-nowrap">
            {lastTime}
          </span>
        </div>
        <p className="text-xs text-black/70 truncate leading-snug">
          {lastText}
        </p>
      </div>

      {chat.unreadCount > 0 && !isActive && (
        <div className="w-5 h-5 bg-zap-purple text-white text-[10px] border-2 border-black rounded-sm flex items-center justify-center font-lilita shadow-[1.5px_1.5px_0px_#000] flex-shrink-0">
          {chat.unreadCount}
        </div>
      )}
    </div>
  );
}
