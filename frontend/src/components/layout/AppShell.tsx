import React, { useState, useEffect } from "react";
import { SideRail } from "./SideRail";
import { ChatList } from "./ChatList";
import { ChatArea } from "./ChatArea";
import { ProfileView } from "./ProfileView";
import { Chat, User } from "../../types";
import { cn } from "../../lib/utils";

interface AppShellProps {
  currentUser: User;
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onSendMessage: (chatId: string, content: string) => void;
  onToggleBlock?: (chatId: string) => void;
}

export function AppShell({
  currentUser,
  chats,
  activeChatId,
  onSelectChat,
  onSendMessage,
  onToggleBlock,
}: AppShellProps) {
  const [activeTab, setActiveTab] = useState<string>("chats");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [showDrawer, setShowDrawer] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Switch to chat view on mobile when a chat is selected
  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    setMobileView("chat");
  };

  const handleBack = () => {
    setMobileView("list");
  };

  // Render Profile View if activeTab is "me"
  if (activeTab === "me") {
    return (
      <div className="relative flex w-full h-full border-[3.5px] border-black bg-white rounded-sm shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in duration-200">
        {/* Left profile side rail (Desktop only) */}
        <div className="hidden md:flex">
          <SideRail 
            currentUser={currentUser} 
            activeTab="settings"
            onTabChange={(tab) => {
              setActiveTab(tab);
            }}
          />
        </div>
        {/* Profile Content Pane */}
        <div className="flex-grow h-full min-w-0">
          <ProfileView 
            onBackToChats={() => setActiveTab("chats")}
            onTabChange={(tab) => {
              setActiveTab(tab);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-full border-[3.5px] border-black bg-white rounded-sm shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
      
      {/* 1. Left profile side rail (Desktop only) */}
      <div className="hidden md:flex">
        <SideRail 
          currentUser={currentUser} 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
        />
      </div>

      {/* 2. Side drawer (Mobile only, toggled via hamburger) */}
      {showDrawer && (
        <div className="md:hidden absolute inset-0 z-50 flex">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 bg-black/45"
            onClick={() => setShowDrawer(false)}
          />
          {/* Side drawer panel */}
          <div className="relative bg-white h-full w-[80px] flex flex-col border-r-[3.5px] border-black z-10 animate-in slide-in-from-left duration-200">
            <SideRail 
              currentUser={currentUser} 
              activeTab="chats"
              onTabChange={(tab) => {
                setShowDrawer(false);
                setActiveTab(tab);
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Conversations selector list panel */}
      <div className={cn(
        "h-full flex-shrink-0",
        mobileView === "list" ? "w-full block" : "hidden",
        "md:block md:w-80"
      )}>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onToggleSidebar={() => setShowDrawer(true)}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
        />
      </div>

      {/* 4. Chat discussion messages pane */}
      <div className={cn(
        "h-full flex-grow",
        mobileView === "chat" ? "w-full block" : "hidden",
        "md:block"
      )}>
        <ChatArea
          chat={activeChat}
          currentUser={currentUser}
          onSendMessage={onSendMessage}
          onBack={handleBack}
          onToggleBlock={onToggleBlock}
        />
      </div>

    </div>
  );
}
