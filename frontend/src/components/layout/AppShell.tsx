"use client";

import React from "react";
import { SideRail } from "./SideRail";
import { ChatList } from "./ChatList";
import { ChatArea } from "./ChatArea";
import { ProfileView } from "./ProfileView";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

export function AppShell() {
  const { user, updateName } = useAuth();
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeTab,
    setActiveTab,
    mobileView,
    setMobileView,
    showDrawer,
    setShowDrawer,
    showCreateChatModal,
    setShowCreateChatModal,
    dbUsers,
    loadingUsers,
    sendMessage,
    createChat
  } = useChat();

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Switch to chat view on mobile when a chat is selected
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
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
            currentUser={user} 
            activeTab="settings"
            onTabChange={(tab) => {
              setActiveTab(tab);
            }}
            onAddFriendClick={() => setShowCreateChatModal(true)}
          />
        </div>
        {/* Profile Content Pane */}
        <div className="flex-grow h-full min-w-0">
          <ProfileView />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-full border-[3.5px] border-black bg-white rounded-sm shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
      
      {/* 1. Left profile side rail (Desktop only) */}
      <div className="hidden md:flex">
        <SideRail 
          currentUser={user} 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          onAddFriendClick={() => setShowCreateChatModal(true)}
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
              currentUser={user} 
              activeTab="chats"
              onTabChange={(tab) => {
                setShowDrawer(false);
                setActiveTab(tab);
              }}
              onAddFriendClick={() => {
                setShowDrawer(false);
                setShowCreateChatModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Conversations selector list panel */}
      <div className={cn(
        mobileView === "list" ? "w-full block" : "hidden",
        "md:block md:w-80"
      )}>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onToggleSidebar={() => setShowDrawer(true)}
          onCreateChatClick={() => setShowCreateChatModal(true)}
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
          currentUser={user}
          onSendMessage={sendMessage}
          onBack={handleBack}
        />
      </div>


      {/* 6. CREATE NEW CHAT MODAL */}
      {showCreateChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop closer */}
          <div 
            className="absolute inset-0 bg-black/45"
            onClick={() => setShowCreateChatModal(false)}
          />
          {/* Modal Panel Container */}
          <div className="relative bg-white border-[3.5px] border-black p-6 rounded-sm shadow-[6px_6px_0px_#000] max-w-sm w-full mx-auto transform rotate-[1.5deg] flex flex-col gap-4 z-10 animate-in zoom-in-95 duration-150">
            {/* Close button */}
            <button
              onClick={() => setShowCreateChatModal(false)}
              className="absolute top-2.5 right-2.5 w-7 h-7 bg-white border-2 border-black rounded-sm shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center font-lilita font-bold text-xs cursor-pointer hover:bg-neutral-50 active:translate-y-[1px] active:shadow-none"
            >
              X
            </button>

            <h3 className="font-lilita text-lg uppercase tracking-wider border-b-[2.5px] border-black pb-2 mr-6 text-black select-none">
              NEW CHAT SQUAD! ⚡
            </h3>

            {loadingUsers ? (
              <div className="py-4 text-center font-lilita text-xs animate-pulse text-black/50">
                LOADING SQUADMATES...
              </div>
            ) : dbUsers.length === 0 ? (
              <div className="py-4 text-center font-lilita text-xs text-black/50">
                NO REGISTERED GAMERS YET!
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                {dbUsers.map((u) => {
                  const colors = [
                    "var(--color-zap-purple)",
                    "var(--color-zap-pink)",
                    "var(--color-zap-cyan)",
                    "var(--color-zap-yellow)"
                  ];
                  const codeSum = u.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                  const randomColor = colors[codeSum % colors.length];
                  
                  return (
                    <button
                      key={u._id}
                      onClick={() => createChat(u._id)}
                      className="w-full text-left flex items-center gap-3 p-2 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_2px_0px_#000] active:translate-y-[1.5px] active:shadow-none transition-all"
                    >
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-lilita text-xs uppercase"
                        style={{ backgroundColor: randomColor }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-lilita text-xs uppercase tracking-wide text-black leading-tight">
                          {u.name}
                        </span>
                        <span className="text-[9px] text-black/50 font-bold leading-none">
                          {u.email}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
