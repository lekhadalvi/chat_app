import React from "react";
import { Chat } from "../../types";
import { Avatar } from "../ui/Avatar";

interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void; // Support back button on mobile
}

export function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  const isKiki = chat.name.toLowerCase() === "kiki";
  const subtitle = isKiki ? "ONLINE • TYPING..." : "ONLINE";

  return (
    <div className="flex items-center justify-between p-4 border-b-[3.5px] border-black bg-white select-none">
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
          isOnline={true}
        />
        
        <div className="flex flex-col justify-center">
          <h3 className="font-lilita text-lg md:text-xl uppercase tracking-wide flex items-center gap-1">
            {chat.name}
          </h3>
          <span className={`font-black text-[10px] tracking-widest ${isKiki ? "text-[#FF00E0]" : "text-black/60"}`}>
            {subtitle}
          </span>
        </div>
      </div>

      {/* Action buttons matching the screenshot */}
      <div className="flex gap-2.5">
        {/* Video Call */}
        <button
          onClick={() => alert("Starting mock video call...")}
          className="w-9 h-9 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Audio Call */}
        <button
          onClick={() => alert("Starting mock audio call...")}
          className="w-9 h-9 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>

        {/* Options */}
        <button
          onClick={() => alert("More options...")}
          className="w-9 h-9 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
