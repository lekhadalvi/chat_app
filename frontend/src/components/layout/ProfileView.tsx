import React from "react";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";

interface ProfileViewProps {
  onBackToChats?: () => void;
  onTabChange?: (tab: string) => void;
}

export function ProfileView({ onBackToChats, onTabChange }: ProfileViewProps) {
  const crew = [
    { name: "SKATE_RAT", color: "var(--color-zap-yellow)", avatar: "🐀" },
    { name: "PIXEL_PUNK", color: "var(--color-zap-pink)", avatar: "🎸" },
    { name: "GLITCH_CAT", color: "var(--color-zap-cyan)", avatar: "🐱" },
  ];

  const galleryItems = [
    {
      title: "TOKYO NEON",
      img: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400&auto=format&fit=crop",
    },
    {
      title: "CRYSTAL SHARDS",
      img: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&auto=format&fit=crop",
    },
    {
      title: "WINGED SHOE",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop",
    },
    {
      title: "NEBULA DRIFT",
      img: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&auto=format&fit=crop",
    },
  ];

  return (
    <div className="w-full h-full bg-[#f8f7f3] flex flex-col select-none relative min-h-0">
      
      {/* ----------------- MOBILE HEADER ----------------- */}
      <div className="bg-zap-yellow p-4 border-b-[3.5px] border-black flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Hamburger / Back button to return to chat */}
          <button 
            onClick={onBackToChats}
            className="text-black focus:outline-none w-8 h-8 flex items-center justify-center border-2 border-black rounded-sm shadow-[1.5px_1.5px_0px_#000] bg-white active:translate-y-[1px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Title */}
          <h2 className="font-lilita text-xl italic uppercase tracking-wider transform -skew-x-12" style={{ WebkitTextStroke: "1px black" }}>
            ZAP! CHAT
          </h2>
        </div>
        {/* User avatar tag */}
        <Avatar name="GamerTag 99" color="var(--color-zap-purple)" size="sm" isOnline={true} />
      </div>

      {/* ----------------- PROFILE CONTENT SCROLL AREA ----------------- */}
      <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center gap-6 relative min-h-0">
        
        {/* Star backdrop decoration */}
        <div className="absolute top-[20px] left-[20px] w-24 h-24 text-[#E2E2D9] pointer-events-none select-none opacity-60">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
          </svg>
        </div>

        {/* Large Profile Avatar Frame with Level tag */}
        <div className="relative mt-4">
          <div className="w-32 h-32 bg-white border-[3.5px] border-black rounded-full shadow-[5px_5.5px_0px_#000] p-1 overflow-hidden relative">
            {/* Custom anime boy avatar with beanie and blue hair SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full bg-[#E0F7FA] rounded-full overflow-hidden">
              <circle cx="50" cy="50" r="50" fill="#B2EBF2" />
              <path d="M20 40 C 25 30, 35 25, 50 25 C 65 25, 75 30, 80 40 C 85 50, 80 70, 75 80 C 70 85, 30 85, 25 80 C 20 70, 15 50, 20 40 Z" fill="#00ACC1" stroke="black" strokeWidth="2.5" />
              <circle cx="50" cy="55" r="22" fill="#FFE0B2" stroke="black" strokeWidth="2.5" />
              <circle cx="43" cy="53" r="3" fill="black" />
              <circle cx="57" cy="53" r="3" fill="black" />
              <path d="M47 62 Q 50 65, 53 62" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M25 38 C 30 20, 70 20, 75 38 C 75 38, 70 42, 50 42 C 30 42, 25 38, 25 38 Z" fill="#FFEB3B" stroke="black" strokeWidth="2.5" />
              <circle cx="50" cy="20" r="6" fill="#FFEB3B" stroke="black" strokeWidth="2.5" />
              <path d="M43 75 L 43 85 L 57 85 L 57 75 Z" fill="#FFE0B2" stroke="black" strokeWidth="2" />
              <path d="M30 85 L 70 85 L 65 100 L 35 100 Z" fill="#1E88E5" stroke="black" strokeWidth="2.5" />
            </svg>
          </div>
          {/* Level pink slanted badge */}
          <div className="absolute -bottom-1 right-2 bg-[#FF00E0] text-white font-lilita text-[10px] py-1 px-2 border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_#000] uppercase transform -rotate-12">
            LVL 42
          </div>
        </div>

        {/* Display name */}
        <div className="text-center select-text">
          <h2 className="font-lilita text-2xl uppercase tracking-wide">
            @CHAOZ_LORD
          </h2>
          {/* Crooked Status banner */}
          <div className="inline-block mt-3 bg-zap-yellow text-black font-lilita text-xs py-2 px-5 border-[3px] border-black rounded-sm shadow-[3px_3.5px_0px_#000] transform -rotate-[3deg]">
            Online & Hyped! ⚡
          </div>
        </div>

        {/* 3 Quick Stats columns */}
        <div className="w-full max-w-sm grid grid-cols-3 gap-3.5 mt-2">
          {/* Stickers */}
          <div className="bg-white border-[3px] border-black p-2.5 rounded-sm shadow-[3.5px_3.5px_0px_#000] flex flex-col items-center justify-center">
            <span className="font-lilita text-[8px] md:text-[9px] uppercase tracking-wider text-black/50">STICKERS</span>
            <span className="font-lilita text-lg md:text-xl text-[#FF00E0] mt-0.5">842</span>
          </div>
          {/* Streaks */}
          <div className="bg-white border-[3px] border-black p-2.5 rounded-sm shadow-[3.5px_3.5px_0px_#000] flex flex-col items-center justify-center">
            <span className="font-lilita text-[8px] md:text-[9px] uppercase tracking-wider text-black/50">STREAKS</span>
            <span className="font-lilita text-lg md:text-xl text-[#8E790B] mt-0.5">15</span>
          </div>
          {/* Art */}
          <div className="bg-white border-[3px] border-black p-2.5 rounded-sm shadow-[3.5px_3.5px_0px_#000] flex flex-col items-center justify-center">
            <span className="font-lilita text-[8px] md:text-[9px] uppercase tracking-wider text-black/50">ART</span>
            <span className="font-lilita text-lg md:text-xl text-zap-cyan mt-0.5">29</span>
          </div>
        </div>

        {/* MY CREW Section */}
        <div className="w-full max-w-sm mt-4 select-none">
          <div className="flex justify-between items-baseline mb-3">
            <h3 className="font-lilita text-sm md:text-md uppercase tracking-wider">MY CREW</h3>
            <span className="text-[10px] md:text-xs text-[#FF00E0] font-black underline cursor-pointer hover:text-purple-800">
              SEE ALL
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {crew.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <Avatar name={member.name} color={member.color} size="md" isOnline={true} shape="circle" />
                <span className="font-lilita text-[9px] text-black/60 truncate w-full text-center">
                  {member.name}
                </span>
              </div>
            ))}
            {/* Invite Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button className="w-10 h-10 md:w-11 md:h-11 bg-white border-[3.5px] border-black rounded-full shadow-[2px_2px_0px_#000] flex items-center justify-center font-lilita text-lg cursor-pointer hover:translate-y-[0.5px]">
                +
              </button>
              <span className="font-lilita text-[9px] text-black/60 uppercase">
                INVITE
              </span>
            </div>
          </div>
        </div>

        {/* GALLERY Section */}
        <div className="w-full max-w-sm mt-4 select-none">
          <h3 className="font-lilita text-sm md:text-md uppercase tracking-wider mb-4">GALLERY</h3>
          <div className="grid grid-cols-2 gap-4">
            {galleryItems.map((item, idx) => {
              // Alternate rotation angles for polaroid grids
              const rot = idx % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2.5deg]";
              return (
                <div 
                  key={idx} 
                  className={cn(
                    "bg-white border-[3px] border-black p-2 pb-3.5 shadow-[4.5px_4.5px_0px_#000] transition-transform hover:scale-105",
                    rot
                  )}
                >
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full aspect-square object-cover border-2 border-black rounded-sm"
                  />
                  <div className="mt-2 text-[8px] font-lilita text-black/70 tracking-widest text-center">
                    {item.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ----------------- BOTTOM TABS (MOBILE ONLY) ----------------- */}
      <div className="md:hidden border-t-[3.5px] border-black bg-white grid grid-cols-4 p-2 gap-1.5 flex-shrink-0 z-10">
        {/* Chats Tab */}
        <button
          onClick={onBackToChats}
          className="py-2 px-1 border-2 border-black bg-white text-black rounded-lg flex flex-col items-center justify-center gap-0.5 text-[9px] font-lilita uppercase"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
          </svg>
          <span>CHATS</span>
        </button>

        {/* Friends Tab */}
        <button
          onClick={() => onTabChange?.("friends")}
          className="py-2 px-1 border-2 border-black bg-white text-black rounded-lg flex flex-col items-center justify-center gap-0.5 text-[9px] font-lilita uppercase"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
          </svg>
          <span>FRIENDS</span>
        </button>

        {/* Boards Tab */}
        <button
          onClick={() => onTabChange?.("boards")}
          className="py-2 px-1 border-2 border-black bg-white text-black rounded-lg flex flex-col items-center justify-center gap-0.5 text-[9px] font-lilita uppercase"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0a3 3 0 11-6 0 3 3 0 016 0zm15 0a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>BOARDS</span>
        </button>

        {/* Me Tab */}
        <button
          className="py-2 px-1 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 bg-zap-yellow text-black shadow-[2px_2px_0px_#000] transform -translate-x-[1px] -translate-y-[1px] text-[9px] font-lilita uppercase"
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
