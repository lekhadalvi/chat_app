import React, { useState } from "react";
import { Chat } from "../../types";
import { ChatItem } from "../chats/ChatItem";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";

interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onToggleSidebar?: () => void; // Trigger hamburger menu click
  onTabChange?: (tab: string) => void;
}

export function ChatList({ chats, activeChatId, onSelectChat, onToggleSidebar, onTabChange }: ChatListProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("chats");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 border-r-[3.5px] border-black bg-white flex flex-col h-full select-none flex-shrink-0 relative">
      
      {/* ----------------- MOBILE HEADER ----------------- */}
      <div className="md:hidden bg-zap-yellow p-4 border-b-[3.5px] border-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button 
            onClick={onToggleSidebar}
            className="text-black focus:outline-none w-8 h-8 flex items-center justify-center border-2 border-black rounded-sm shadow-[1.5px_1.5px_0px_#000] bg-white active:translate-y-[1px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Slanted Title */}
          <h2 className="font-lilita text-xl italic uppercase tracking-wider transform -skew-x-12 select-none" style={{ WebkitTextStroke: "1px black" }}>
            ZAP! CHAT
          </h2>
        </div>
        {/* Top-Right Avatar */}
        <Avatar name="GamerTag 99" color="var(--color-zap-purple)" size="sm" isOnline={true} />
      </div>

      {/* ----------------- STORIES BAR (MOBILE ONLY) ----------------- */}
      <div className="md:hidden flex gap-4 p-4 overflow-x-auto border-b-[3.5px] border-black bg-[#f8f7f3]">
        {/* You Story card */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="w-12 h-12 bg-white border-[3px] border-black rounded-[10px] shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center font-lilita text-lg">
            +
          </div>
          <span className="font-lilita text-[10px] uppercase text-black/60">YOU</span>
        </div>

        {/* Kiki Story card */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <Avatar name="Kiki" color="var(--color-zap-pink)" size="md" shape="square" borderColor="#FF00E0" className="w-12 h-12" />
          <span className="font-lilita text-[10px] uppercase text-black/70">Kiki</span>
        </div>

        {/* Jax Story card */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <Avatar name="Jax" color="var(--color-zap-yellow)" size="md" shape="square" borderColor="var(--color-zap-yellow)" className="w-12 h-12" />
          <span className="font-lilita text-[10px] uppercase text-black/70">Jax</span>
        </div>

        {/* Mia Story card */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <Avatar name="Mia" color="var(--color-zap-cyan)" size="md" shape="square" borderColor="var(--color-zap-cyan)" className="w-12 h-12" />
          <span className="font-lilita text-[10px] uppercase text-black/70">Mia</span>
        </div>
      </div>

      {/* ----------------- DESKTOP TITLE ----------------- */}
      <div className="hidden md:block p-4 pb-0">
        <h2 className="font-lilita text-2xl uppercase tracking-wider">CHATS</h2>
      </div>

      {/* ----------------- SEARCH BAR ----------------- */}
      <div className="p-4 border-b-[3.5px] border-black bg-white">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH CHATS..."
            className="w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black pl-10 pr-4 py-2.5 rounded-[15px] shadow-[3.5px_3.5px_0px_#000] focus:outline-none focus:bg-amber-50 focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-[2.5px_2.5px_0px_#000] transition-all text-xs"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none w-4 h-4">
            <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* ----------------- CONVERSATIONS SCROLL feed ----------------- */}
      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 bg-[#f8f7f3] relative min-h-0">
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

        {/* ----------------- FLOATING ACTION BUTTON (MOBILE ONLY) ----------------- */}
        <div className="md:hidden absolute bottom-[18px] right-[18px] w-12 h-12 bg-zap-yellow border-[3px] border-black rounded-full z-30" />
        
        <button
          onClick={() => alert("Creating a new chat...")}
          className="md:hidden absolute bottom-4 right-4 w-12 h-12 bg-[#FF00E0] border-[3px] border-black rounded-[18px] shadow-[3.5px_3.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all z-35"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12h7m-7 4h4m-8 4V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6l-4 4z" />
            <path strokeLinecap="round" d="M12 7v6m-3-3h6" />
          </svg>
        </button>
      </div>

      {/* ----------------- BOTTOM NAVIGATION TABS (MOBILE ONLY) ----------------- */}
      <div className="md:hidden border-t-[3.5px] border-black bg-white grid grid-cols-4 p-2 gap-1.5 select-none">
        
        {/* Chats Tab */}
        <button
          onClick={() => {
            setActiveTab("chats");
            onTabChange?.("chats");
          }}
          className={cn(
            "py-2 px-1 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-lilita uppercase",
            activeTab === "chats"
              ? "bg-[#FF00E0] text-white shadow-[2px_2px_0px_#000] transform -translate-x-[1px] -translate-y-[1px]"
              : "bg-white text-black"
          )}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
          </svg>
          <span>CHATS</span>
        </button>

        {/* Friends Tab */}
        <button
          onClick={() => {
            setActiveTab("friends");
            onTabChange?.("friends");
          }}
          className={cn(
            "py-2 px-1 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-lilita uppercase",
            activeTab === "friends"
              ? "bg-[#FF00E0] text-white shadow-[2px_2px_0px_#000] transform -translate-x-[1px] -translate-y-[1px]"
              : "bg-white text-black"
          )}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
          </svg>
          <span>FRIENDS</span>
        </button>

        {/* Boards Tab */}
        <button
          onClick={() => {
            setActiveTab("boards");
            onTabChange?.("boards");
          }}
          className={cn(
            "py-2 px-1 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-lilita uppercase",
            activeTab === "boards"
              ? "bg-[#FF00E0] text-white shadow-[2px_2px_0px_#000] transform -translate-x-[1px] -translate-y-[1px]"
              : "bg-white text-black"
          )}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0a3 3 0 11-6 0 3 3 0 016 0zm15 0a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>BOARDS</span>
        </button>

        {/* Me Tab (Yellow active smiley face tag matching screenshot) */}
        <button
          onClick={() => {
            setActiveTab("me");
            onTabChange?.("me");
          }}
          className={cn(
            "py-2 px-1 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-lilita uppercase",
            activeTab === "me"
              ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000] transform -translate-x-[1px] -translate-y-[1px] border-2 border-black"
              : "bg-white text-black"
          )}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="currentColor">
            <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2.5" fill="#FFEB3B" />
            <circle cx="9" cy="10" r="1.5" fill="black" />
            <circle cx="15" cy="10" r="1.5" fill="black" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <span>ME</span>
        </button>
      </div>

    </div>
  );
}
