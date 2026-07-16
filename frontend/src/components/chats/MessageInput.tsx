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
      className="p-4 border-t-[3.5px] border-black bg-white flex gap-3 select-none"
    >
      {/* Attachment Button */}
      <button
        type="button"
        onClick={() => alert("Attachments clicked! (Mock)")}
        className="w-12 h-12 bg-zap-cyan border-[3px] border-black rounded-sm shadow-[3.5px_3.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Main text box */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message here... don't be shy!"
        className="flex-grow bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-4 py-3 rounded-sm shadow-[3.5px_3.5px_0px_#000] focus:outline-none focus:bg-amber-50 focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-[3px_3px_0px_#000] transition-all text-sm"
      />

      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => onSendMessage("💥 BOOM!")}
        className="w-12 h-12 bg-zap-yellow border-[3px] border-black rounded-sm shadow-[3.5px_3.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex-shrink-0"
        title="Send BOOM!"
      >
        <span className="text-xl">💥</span>
      </button>

      {/* Send Button */}
      <button
        type="submit"
        className="w-12 h-12 bg-zap-purple text-white border-[3px] border-black rounded-sm shadow-[3.5px_3.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 transform rotate-90" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </form>
  );
}
