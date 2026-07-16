import React from "react";
import { User } from "../../types";
import Link from "next/link";
import { cn } from "../../lib/utils";

interface SideRailProps {
  currentUser: User;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onAddFriendClick?: () => void;
}

export function SideRail({ currentUser, activeTab = "chats", onTabChange, onAddFriendClick }: SideRailProps) {
  const tabs = [
    {
      id: "chats",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
        </svg>
      ),
      label: "Chats",
      color: "bg-[#FF00E0]",
    },
    {
      id: "groups",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: "Groups",
      color: "bg-zap-cyan",
    },
    {
      id: "games",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0a3 3 0 11-6 0 3 3 0 016 0zm15 0a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" d="M6 12v6a3 3 0 003 3h6a3 3 0 003-3v-6M9 6v6m6-6v6" />
        </svg>
      ),
      label: "Games",
      color: "bg-zap-yellow",
    },
    {
      id: "settings",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1 1 11 8H9m10.59 11.41A2 2 0 1 1 18 16h2M6 18h12M6 6h12M6 12h12" />
        </svg>
      ),
      label: "Settings",
      color: "bg-zap-pink",
    },
  ];

  return (
    <div className="w-[72px] md:w-20 h-full bg-white border-r-[3.5px] border-black flex flex-col items-center justify-between py-6 flex-shrink-0">
      
      {/* Top Header Card NC (Routes to Profile) */}
      <div 
        onClick={() => onTabChange?.("me")}
        className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
      >
        <div className="w-12 h-12 bg-white border-[3px] border-black rounded-sm shadow-[3.5px_3.5px_0px_#000] flex items-center justify-center font-lilita text-lg uppercase hover:bg-neutral-50">
          NC
        </div>
      </div>

      {/* Middle Tab Actions List */}
      {/* <div className="flex flex-col gap-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                "w-11 h-11 border-[3px] border-black rounded-sm flex items-center justify-center cursor-pointer transition-all",
                isActive
                  ? `${tab.color} text-white transform -translate-x-[2px] -translate-y-[2px] shadow-[3.5px_3.5px_0px_#000]`
                  : "bg-white text-black hover:bg-neutral-50 shadow-[2.5px_2.5px_0px_#000] hover:translate-y-[0.5px]"
              )}
              title={tab.label}
            >
              {tab.icon}
            </button>
          );
        })}
      </div> */}

      {/* Bottom Yellow Plus Add Button (Triggers invite modal) */}
      <button
        onClick={onAddFriendClick}
        className="w-11 h-11 bg-zap-yellow text-black border-[3px] border-black rounded-full shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center font-lilita text-xl font-bold cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        title="Add Chat"
      >
        +
      </button>
    </div>
  );
}
