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
  
  // Custom mock time offsets matching the user screenshots
  const displayTime = chat.name.toLowerCase() === "kiki" 
    ? "2m ago" 
    : chat.name.toLowerCase() === "jax"
      ? "15m ago"
      : chat.name.toLowerCase() === "mia"
        ? "1h ago"
        : chat.name.toLowerCase() === "beam"
          ? "3h ago"
          : "Yesterday";

  const isBlocked = chat.isBlocked;
  const isUnread = !isBlocked && (chat.name.toLowerCase() === "kiki" || chat.name.toLowerCase() === "mia");
  const lastMsgColor = isBlocked 
    ? "text-black/45" 
    : chat.name.toLowerCase() === "beam" ? "text-black/45" : "text-black/60";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 p-4 border-[3px] border-black rounded-[20px] cursor-pointer select-none transition-all",
        isActive
          ? "bg-zap-yellow transform -translate-x-[2px] -translate-y-[2px] shadow-[4px_4.5px_0px_#000]"
          : "bg-white hover:bg-neutral-50 hover:transform hover:-translate-y-[1px] shadow-[4px_4.5px_0px_#000]",
        isBlocked && "bg-[#F3F3ED] opacity-75"
      )}
    >
      <Avatar
        name={chat.name}
        color={isBlocked ? "#CCCCCC" : chat.avatarColor}
        size="md"
        isOnline={!isBlocked && chat.name.toLowerCase() !== "beam" && chat.name.toLowerCase() !== "the void"}
        className={cn(isBlocked && "grayscale contrast-75")}
      />

      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <div className="flex items-baseline justify-between mb-0.5">
          <h4 className={cn("font-lilita text-sm md:text-md uppercase truncate tracking-wide flex items-center gap-1", isBlocked ? "text-black/45" : "text-black")}>
            {chat.name.toLowerCase() === "jax" ? "JAX GAMER" : chat.name}
            {chat.name.toLowerCase() === "kiki" && !isBlocked && <span className="text-xs">⚡</span>}
            {chat.name.toLowerCase() === "mia" && !isBlocked && <span className="text-xs">★</span>}
          </h4>
          <span className={cn("font-lilita text-[10px] whitespace-nowrap", isUnread ? "text-[#FF00E0]" : "text-black/45")}>
            {displayTime}
          </span>
        </div>
        <p className={cn("text-xs truncate font-semibold leading-normal font-sans", lastMsgColor)}>
          {chat.name.toLowerCase() === "kiki" && "YOU WON'T BELIEVE WH..."}
          {chat.name.toLowerCase() === "jax" && "Ready for the boss fight? Bring..."}
          {chat.name.toLowerCase() === "mia" && "The new stickers are lit--"}
          {chat.name.toLowerCase() === "beam" && "Did you see the homework?"}
          {chat.name.toLowerCase() === "the void" && "Mystery solving tonight..."}
          {chat.name.toLowerCase() !== "kiki" && chat.name.toLowerCase() !== "jax" && chat.name.toLowerCase() !== "mia" && chat.name.toLowerCase() !== "beam" && chat.name.toLowerCase() !== "the void" && lastText}
        </p>
      </div>

      {chat.name.toLowerCase() === "kiki" && !isActive && !isBlocked && (
        <div className="w-6 h-6 bg-[#FF00E0] text-white text-[11px] border-2 border-black rounded-lg flex items-center justify-center font-lilita shadow-[1px_1.5px_0px_#000] flex-shrink-0">
          3
        </div>
      )}
      {chat.name.toLowerCase() === "mia" && !isActive && !isBlocked && (
        <div className="w-6 h-6 bg-[#FF00E0] text-white text-[11px] border-2 border-black rounded-lg flex items-center justify-center font-lilita shadow-[1px_1.5px_0px_#000] flex-shrink-0">
          1
        </div>
      )}
    </div>
  );
}
