import React, { useEffect, useRef } from "react";
import { Message, User } from "../../types";
import { Avatar } from "../ui/Avatar";
import { mockUsers } from "../../lib/mock-data";

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

export function MessageList({ messages, currentUser }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-[#f8f7f3]">
      {messages.length === 0 ? (
        <div className="my-auto flex flex-col items-center select-none text-center p-8">
          <div className="w-16 h-16 bg-zap-cyan border-[3px] border-black rounded-sm shadow-[3px_3px_0px_#000] flex items-center justify-center font-lilita text-3xl mb-4">
            ?
          </div>
          <h4 className="font-lilita text-lg uppercase mb-1">NO MESSAGES HERE YET!</h4>
          <p className="text-sm text-black/60 max-w-xs font-semibold">
            Send the first message to break the ice and start the chaos!
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          
          // Find sender profile
          const sender = isMe 
            ? currentUser 
            : mockUsers.find((u) => u.id === msg.senderId) || {
                name: "Unknown User",
                avatarColor: "var(--color-zap-cyan)",
              };

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
                {/* Sender Tag */}
                {!isMe && (
                  <span className="font-lilita text-[11px] uppercase text-black/70 mb-0.5 ml-1 select-none">
                    {sender.name}
                  </span>
                )}

                {/* Message Bubble */}
                <div
                  className={`border-[2.5px] border-black p-3 rounded-sm shadow-[3px_3px_0px_#000] select-text relative ${
                    isMe
                      ? "bg-zap-purple text-white rounded-tr-none"
                      : "bg-white text-black rounded-tl-none"
                  }`}
                >
                  <p className="text-sm font-semibold leading-relaxed break-words">
                    {msg.content}
                  </p>
                  
                  {/* Message Timestamp */}
                  <span
                    className={`block text-[9px] mt-1.5 text-right font-bold ${
                      isMe ? "text-white/60" : "text-black/40"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
