import React, { useState } from "react";
import { Chat } from "../../types";
import { ChatItem } from "../chats/ChatItem";

interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({ chats, activeChatId, onSelectChat }: ChatListProps) {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 border-r-[3.5px] border-black bg-white flex flex-col h-full select-none flex-shrink-0">
      {/* Search Input bar */}
      <div className="p-4 border-b-[3.5px] border-black bg-white">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 SEARCH CHATS..."
            className="w-full bg-white text-black font-semibold placeholder-black/40 border-[2.5px] border-black px-3.5 py-2.5 rounded-sm shadow-[3px_3px_0px_#000] focus:outline-none focus:bg-amber-50 focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-[2px_2px_0px_#000] transition-all text-xs"
          />
        </div>
      </div>

      {/* Conversations Scroll Box */}
      <div className="flex-grow overflow-y-auto divide-y-[3px] divide-black bg-[#f8f7f3]">
        <div className="px-4 py-2 bg-black text-white text-[10px] md:text-xs font-lilita tracking-wider uppercase border-b-[3px] border-black">
          Active Convos
        </div>
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center text-black/50 font-lilita text-sm">
            NO CHATS FOUND! 😭
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
