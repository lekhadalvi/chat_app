import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t-[3.5px] border-black bg-white flex items-center gap-3.5 select-none"
    >
      {/* Plus Icon */}
      <button
        type="button"
        onClick={() => alert("Mock files attachment click!")}
        className="w-10 h-10 bg-white border-[3px] border-black rounded-full shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Capsule Input box with Emoji inside */}
      <div className="relative flex-grow">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a rebellious message..."
          className="w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-5 py-3 pr-12 rounded-full shadow-[3.5px_3.5px_0px_#000] focus:outline-none focus:bg-amber-50 focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-[3px_3px_0px_#000] transition-all text-xs md:text-sm"
        />
        {/* Emoji smiley icon inside input */}
        <button
          type="button"
          onClick={() => setText((prev) => prev + " 🤘")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/55 hover:text-black transition-colors w-6 h-6 flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
          </svg>
        </button>
      </div>

      {/* Pill Send Button */}
      <button
        type="submit"
        className="h-11 bg-zap-yellow text-black font-lilita text-xs md:text-sm px-5 border-[3px] border-black rounded-full shadow-[3.5px_3.5px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex-shrink-0"
      >
        <span>SEND</span>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </form>
  );
}
