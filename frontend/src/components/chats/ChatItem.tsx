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
  const lastMsg = chat.messages[chat.messages.length - 1];
  const lastText = lastMsg ? lastMsg.content : "No messages yet.";
  
  // Custom timestamps and statuses to match screenshots
  const displayTime = chat.name.toLowerCase() === "kiki" 
    ? "10:42 AM" 
    : chat.name.toLowerCase() === "jax"
      ? "11:15 AM"
      : chat.name.toLowerCase() === "mia"
        ? "Yesterday"
        : lastMsg ? lastMsg.timestamp : "";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 p-4 border-[3px] border-black rounded-sm cursor-pointer select-none transition-all",
        isActive
          ? "bg-zap-yellow transform -translate-x-[2px] -translate-y-[2px] shadow-[4px_4px_0px_#000]"
          : "bg-white hover:bg-neutral-50 hover:transform hover:-translate-y-[1px] shadow-[4px_4px_0px_#000]"
      )}
    >
      <Avatar
        name={chat.name}
        color={chat.avatarColor}
        size="md"
        isOnline={chat.name.toLowerCase() !== "beam"}
      />

      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <div className="flex items-baseline justify-between mb-1">
          <h4 className="font-lilita text-sm md:text-md uppercase truncate tracking-wide text-black">
            {chat.name}
            {chat.name.toLowerCase() === "kiki" && <span className="ml-1 text-xs">⚡</span>}
            {chat.name.toLowerCase() === "mia" && <span className="ml-1 text-xs">★</span>}
          </h4>
          <span className="font-lilita text-[10px] text-black/60 whitespace-nowrap">
            {displayTime}
          </span>
        </div>
        <p className="text-xs text-black/70 truncate font-semibold leading-normal">
          {chat.name.toLowerCase() === "kiki" && "Did you see the new ep..."}
          {chat.name.toLowerCase() === "jax" && "GG on that last match, bro."}
          {chat.name.toLowerCase() === "mia" && "Send me the link to that pla..."}
          {chat.name.toLowerCase() !== "kiki" && chat.name.toLowerCase() !== "jax" && chat.name.toLowerCase() !== "mia" && lastText}
        </p>
      </div>

      {chat.name.toLowerCase() === "kiki" && !isActive && (
        <div className="w-5 h-5 bg-[#FF00E0] text-white text-[10px] border-2 border-black rounded-sm flex items-center justify-center font-lilita shadow-[1px_1px_0px_#000] flex-shrink-0">
          3
        </div>
      )}
      {chat.name.toLowerCase() === "mia" && !isActive && (
        <div className="w-5 h-5 bg-[#FF00E0] text-white text-[10px] border-2 border-black rounded-sm flex items-center justify-center font-lilita shadow-[1px_1px_0px_#000] flex-shrink-0">
          1
        </div>
      )}
    </div>
  );
}
