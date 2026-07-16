import React from "react";
import { Chat, User } from "../../types";
import { ChatHeader } from "../chats/ChatHeader";
import { MessageList } from "../chats/MessageList";
import { MessageInput } from "../chats/MessageInput";

interface ChatAreaProps {
  chat?: Chat;
  currentUser: User;
  onSendMessage: (chatId: string, content: string) => void;
}

export function ChatArea({ chat, currentUser, onSendMessage }: ChatAreaProps) {
  if (!chat) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-[#f8f7f3] p-8 text-center select-none">
        <div className="w-24 h-24 text-zap-purple animate-pulse mb-6">
          {/* Neon style brand lightning SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[3px_3px_0px_#000]" fill="currentColor" stroke="black" strokeWidth="4">
            <polygon points="60,5 20,55 50,55 40,95 80,45 50,45" />
          </svg>
        </div>
        <h2 className="font-lilita text-2xl md:text-3xl uppercase tracking-wider mb-2">
          WELCOME TO THE CHAOS!
        </h2>
        <p className="text-sm md:text-md text-black/60 max-w-sm font-semibold leading-relaxed">
          Select a channel or conversation from the sidebar squad list to start shooting messages!
        </p>
      </div>
    );
  }

  const handleSend = (content: string) => {
    onSendMessage(chat.id, content);
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8f7f3] min-w-0">
      {/* Top Convo Header */}
      <ChatHeader chat={chat} />

      {/* Main Message Listing */}
      <MessageList messages={chat.messages} currentUser={currentUser} />

      {/* Input panel bar */}
      <MessageInput onSendMessage={handleSend} />
    </div>
  );
}
