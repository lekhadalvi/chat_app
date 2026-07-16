import React from "react";
import { User } from "../../types";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";

interface SideRailProps {
  currentUser: User;
}

export function SideRail({ currentUser }: SideRailProps) {
  return (
    <div className="w-[72px] md:w-20 bg-zap-purple border-r-[3.5px] border-black flex flex-col items-center justify-between py-6 select-none flex-shrink-0">
      {/* Brand logo block */}
      <Link href="/chats" className="flex flex-col items-center gap-1.5 group">
        <div className="w-11 h-11 bg-zap-yellow border-[3px] border-black rounded-sm shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center font-lilita text-xl transform -rotate-6 group-hover:rotate-12 transition-all duration-200">
          Z!
        </div>
      </Link>

      {/* Middle nav links */}
      <div className="flex flex-col gap-5">
        <button
          onClick={() => alert("Already in Chats!")}
          className="w-11 h-11 bg-[#BBEBFF] border-[3px] border-black rounded-sm shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          title="Chats"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
          </svg>
        </button>

        <button
          onClick={() => alert("Browse channels!")}
          className="w-11 h-11 bg-zap-pink border-[3px] border-black rounded-sm shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          title="Browse Channels"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929l-.357 2.228-.358-2.228-2.227-.358 2.227-.357.358-2.228.357 2.228 2.228.357-2.228.358ZM19.071 19.071l-.357 2.228-.358-2.228-2.227-.358 2.227-.357.358-2.228.357 2.228 2.228.357-2.228.358Z" />
          </svg>
        </button>
      </div>

      {/* User profile actions */}
      <div className="flex flex-col gap-4 items-center">
        <Avatar
          name={currentUser.name}
          color={currentUser.avatarColor}
          size="md"
          isOnline={true}
          className="cursor-pointer hover:scale-105 transition-transform"
        />
        <Link
          href="/login"
          className="w-9 h-9 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] flex items-center justify-center hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          title="Logout"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
