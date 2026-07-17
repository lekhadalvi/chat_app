import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export function MessageInput({ onSendMessage, onTyping, onStopTyping }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
    setShowEmojiPicker(false);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    if (onStopTyping) {
      onStopTyping();
    }
  };

  const reactions = [
    { text: "🔥 FIRE!", bg: "bg-[#FF00E0] text-white" },
    { text: "LOL FR", bg: "bg-zap-cyan text-black" },
    { text: "WHAAT?!", bg: "bg-black text-[#FFD600]" },
    { text: "SLAY", bg: "bg-[#EAEAE2] text-black" },
  ];

  const emojiList = ["😱", "✨", "🌈", "🤘", "🔥", "😹", "👽", "💀", "💥", "🛸", "💬", "❤️", "👑", "🍕", "👾"];

  const mockImages = [
    {
      label: "🌆 TOKYO NEON",
      url: "IMAGE:https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&auto=format&fit=crop",
    },
    {
      label: "🔮 CRYSTALS",
      url: "IMAGE:https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop",
    },
    {
      label: "👟 WINGED SHOE",
      url: "IMAGE:https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    },
    {
      label: "🌌 NEBULA DRIFT",
      url: "IMAGE:https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop",
    },
  ];

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const handleSendMockImage = (imageUrl: string) => {
    onSendMessage(imageUrl);
    setShowAttachmentMenu(false);
  };

  return (
    <div className="flex flex-col border-t-[3.5px] border-black bg-white select-none relative">
      
      {/* 1. EMOJI PICKER DIALOG POPUP */}
      {showEmojiPicker && (
        <>
          {/* Click-outside backdrop closer */}
          <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
          <div className="absolute right-4 bottom-16 bg-white border-[3px] border-black rounded-[14px] shadow-[4px_4px_0px_#000] p-3 z-50 w-64 animate-in slide-in-from-bottom duration-150">
            <h4 className="font-lilita text-xs uppercase tracking-wide border-b-[2px] border-black pb-1.5 mb-2.5">
              CHOOSE YOUR EMOTES!
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSelectEmoji(emoji)}
                  className="w-10 h-10 border-2 border-black rounded-lg bg-[#F8F7F3] hover:bg-zap-yellow text-md flex items-center justify-center cursor-pointer hover:-translate-y-[0.5px] active:translate-y-[1px] transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 2. ATTACH IMAGE CHOICES POPUP */}
      {showAttachmentMenu && (
        <>
          {/* Click-outside backdrop closer */}
          <div className="fixed inset-0 z-40" onClick={() => setShowAttachmentMenu(false)} />
          <div className="absolute left-4 bottom-16 bg-white border-[3px] border-black rounded-[14px] shadow-[4px_4px_0px_#000] p-2.5 z-50 w-52 flex flex-col gap-1.5 animate-in slide-in-from-bottom duration-150">
            <h4 className="font-lilita text-xs uppercase tracking-wide border-b-[2px] border-black pb-1 mb-1 px-1">
              ATTACH A POLAROID
            </h4>
            {mockImages.map((img) => (
              <button
                key={img.label}
                type="button"
                onClick={() => handleSendMockImage(img.url)}
                className="w-full text-left px-2 py-1.5 border-2 border-transparent hover:border-black hover:bg-zap-cyan rounded-md font-lilita text-[10px] uppercase transition-all cursor-pointer"
              >
                {img.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Quick Reaction Badges row */}
      <div className="flex gap-2.5 px-4 py-2.5 overflow-x-auto border-b-[2px] border-black bg-[#FDFDFB]">
        {reactions.map((react, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(react.text)}
            className={`px-3 py-1 font-lilita text-[10px] uppercase border-[2.5px] border-black rounded-full shadow-[2px_2px_0px_#000] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0 cursor-pointer ${react.bg}`}
          >
            {react.text}
          </button>
        ))}
      </div>

      {/* Main input form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 flex items-center gap-3.5"
      >
        {/* Plus Icon (Square button toggles Attachment drawer) */}
        <button
          type="button"
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          className="w-10 h-10 bg-white border-[3px] border-black rounded-[10px] shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        {/* Capsule Input box with Emoji Trigger inside */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              const val = e.target.value;
              setText(val);

              if (onTyping) {
                onTyping();
              }

              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }

              const timeout = setTimeout(() => {
                if (onStopTyping) {
                  onStopTyping();
                }
              }, 1500);

              setTypingTimeout(timeout);
            }}
            placeholder="Spill the tea..."
            className="w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-5 py-3 pr-12 rounded-[15px] shadow-[3.5px_3.5px_0px_#000] focus:outline-none focus:bg-amber-50 focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-[3px_3px_0px_#000] transition-all text-xs md:text-sm"
          />
          {/* Emoji smiley icon (Smiley toggles Emoji picker) */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FF00E0] hover:scale-110 transition-transform w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
            </svg>
          </button>
        </div>

        {/* Rounded square Send Button */}
        <button
          type="submit"
          className="w-10 h-10 bg-zap-yellow border-[3px] border-black rounded-[12px] shadow-[2.5px_2.5px_0px_#000] cursor-pointer flex items-center justify-center hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
