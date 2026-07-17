import React, { useEffect, useRef } from "react";
import { Message, User } from "../../types";
import { Avatar } from "../ui/Avatar";

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  chatName: string;
  chatColor: string;
}

export function MessageList({ messages, currentUser, chatName, chatColor }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-6 flex flex-col gap-5 bg-[#f8f7f3] relative">
      
      {/* Grey Background star outline inside list */}
      <div className="absolute top-[20%] left-[10%] w-24 h-24 text-black/5 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
          <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
        </svg>
      </div>

      {/* Date separator badge */}
      <div className="flex justify-center my-3 select-none">
        <div className="bg-[#E5E5E0] text-black font-lilita text-[10px] md:text-xs py-1 px-3 border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
          TODAY
        </div>
      </div>

      {messages.map((msg, idx) => {
        const isMe = msg.senderId === currentUser.id;
        const isImage = msg.content.startsWith("IMAGE:");
        
        const sender = isMe 
          ? currentUser 
          : {
              name: chatName,
              avatarColor: chatColor,
            };

        // Alternate bubble rotations for a hand-drawn crooked effect (stronger for polaroids)
        const rotationClass = idx % 2 === 0 
          ? (isImage ? "rotate-[-2.2deg]" : "rotate-[-0.6deg]") 
          : (isImage ? "rotate-[2.5deg]" : "rotate-[0.8deg]");
        
        return (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {!isMe && (
              <Avatar
                name={sender.name}
                color={sender.avatarColor}
                size="sm"
              />
            )}

            <div className="flex flex-col">
              {/* Message Bubble or Image */}
              {isImage ? (
                <div className={`flex flex-col gap-1 ${rotationClass}`}>
                  <div className="border-[3px] border-black p-3.5 pb-4 rounded-[14px] bg-white shadow-[4px_4px_0px_#000] max-w-[280px]">
                    <img
                      src={msg.content.replace("IMAGE:", "")}
                      alt="shared screengrab"
                      className="w-full h-auto object-cover border-[2.5px] border-black rounded-[8px]"
                    />
                    <div className="mt-2.5 text-xs font-lilita uppercase tracking-wider text-black px-0.5">
                      LOOK AT THIS FRAME!!
                    </div>
                  </div>
                  <span className={`block text-[9px] font-bold text-black/50 mt-1.5 ${isMe ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              ) : (
                <div className={`flex flex-col ${rotationClass}`}>
                  <div
                    className={`border-[3px] border-black p-3.5 rounded-[18px] select-text relative transition-transform ${
                      isMe
                        ? "bg-zap-yellow text-black shadow-[3.5px_4px_0px_#00D2FF]"
                        : "bg-white text-black shadow-[3.5px_4px_0px_#000]"
                    }`}
                  >
                    <p className="text-xs md:text-sm font-semibold leading-relaxed break-words font-sans">
                      {msg.content}
                    </p>
                  </div>
                  <span className={`block text-[9px] mt-1 font-bold text-black/50 ${isMe ? "text-right" : "text-left"}`}>
                    {isMe ? `SENT - ${msg.timestamp}` : msg.timestamp}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Hand-drawn pink lightning bolt outline decoration (Bottom-Right corner overlay) */}
      <div className="absolute bottom-4 right-4 w-12 h-16 text-[#FF00E0] opacity-35 pointer-events-none select-none transform rotate-12">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
          <polygon points="60,5 20,55 50,55 40,95 80,45 50,45" />
        </svg>
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
