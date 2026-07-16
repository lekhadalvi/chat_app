import React from "react";
import { Chat } from "../../types";
import { Avatar } from "../ui/Avatar";

interface ChatHeaderProps {
  chat: Chat;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const cleanName = chat.name.replace(/[^\w\s]/g, "").trim() || chat.name;

  return (
    <div className="flex items-center justify-between p-4 border-b-[3.5px] border-black bg-white select-none">
      <div className="flex items-center gap-3">
        <Avatar
          name={cleanName}
          color={chat.avatarColor}
          size="md"
          isOnline={!chat.isGroup}
        />
        <div className="flex flex-col justify-center">
          <h3 className="font-lilita text-lg md:text-xl uppercase tracking-wide">
            {chat.name}
          </h3>
          <span className="font-semibold text-xs text-black/60">
            {chat.isGroup ? "Channel Squad" : "Online"}
          </span>
        </div>
      </div>

      {/* Comic-style decorative header control buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => alert("Search messages!")}
          className="w-9 h-9 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <button
          onClick={() => alert("Settings/Members info!")}
          className="w-9 h-9 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
