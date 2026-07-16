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
  onCreateChat?: (name: string) => void;
}

export function AppShell({
  currentUser,
  chats,
  activeChatId,
  onSelectChat,
  onSendMessage,
  onToggleBlock,
  onCreateChat,
}: AppShellProps) {
  const [activeTab, setActiveTab] = useState<string>("chats");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    setInviteSuccess("HELL YEAH! INVITE SENT SUCCESSFULLY!");
    setTimeout(() => {
      setShowInviteModal(false);
      setInviteInput("");
      setInviteSuccess("");
    }, 1500);
  };

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
            onAddFriendClick={() => setShowInviteModal(true)}
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
          onAddFriendClick={() => setShowInviteModal(true)}
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
              onAddFriendClick={() => {
                setShowDrawer(false);
                setShowInviteModal(true);
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
          currentUser={currentUser}
          onSendMessage={onSendMessage}
          onBack={handleBack}
          onToggleBlock={onToggleBlock}
        />
      </div>

      {/* 5. ADD / INVITE FRIEND MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Click-outside Backdrop */}
          <div 
            className="absolute inset-0 bg-black/45"
            onClick={() => setShowInviteModal(false)}
          />
          {/* Modal Panel Container */}
          <div className="relative bg-white border-[3.5px] border-black p-6 rounded-sm shadow-[6px_6px_0px_#000] max-w-sm w-full mx-auto transform -rotate-[1.5deg] flex flex-col gap-4 z-10 animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-2.5 right-2.5 w-7 h-7 bg-white border-2 border-black rounded-sm shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center font-lilita font-bold text-xs cursor-pointer hover:bg-neutral-50 active:translate-y-[1px] active:shadow-none"
            >
              X
            </button>

            <h3 className="font-lilita text-lg uppercase tracking-wider border-b-[2.5px] border-black pb-2 mr-6 text-black">
              ADD SQUADMATE! 🤝
            </h3>

            {inviteSuccess ? (
              <div className="bg-[#4CD964] border-[3px] border-black p-3.5 text-black font-lilita text-xs tracking-wide shadow-[3px_3px_0px_#000] my-2 text-center animate-pulse">
                {inviteSuccess}
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-lilita text-[10px] tracking-wider uppercase text-black/60">
                    EMAIL OR USERNAME
                  </label>
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="gamer@zaptalk.com or GamerTag_99"
                    className="w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-4 py-3 rounded-full shadow-[3.5px_3.5px_0px_#000] focus:outline-none focus:bg-amber-50 focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-[2.5px_2.5px_0px_#000] transition-all text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF00E0] text-white font-lilita text-sm py-2.5 uppercase border-[3.5px] border-black rounded-full shadow-[3.5px_3.5px_0px_#000] cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all mt-2"
                >
                  SEND INVITE! ➔
                </button>
              </form>
            )}
          </div>
        </div>
      )}
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
            {/* Close Button */}
            <button
              onClick={() => setShowCreateChatModal(false)}
              className="absolute top-2.5 right-2.5 w-7 h-7 bg-white border-2 border-black rounded-sm shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center font-lilita font-bold text-xs cursor-pointer hover:bg-neutral-50 active:translate-y-[1px] active:shadow-none"
            >
              X
            </button>

            <h3 className="font-lilita text-lg uppercase tracking-wider border-b-[2.5px] border-black pb-2 mr-6 text-black">
              CREATE CHAT! 💬
            </h3>

            <p className="font-lilita text-[10px] uppercase text-black/50 tracking-wider -mt-1.5">
              CHOOSE A CONTACT TO START SPILLiNG TEA:
            </p>

            <div className="flex flex-col gap-2.5">
              {["FREY", "SKATE_RAT", "PIXEL_PUNK", "GLITCH_CAT", "LUNA", "COSMO"].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onCreateChat?.(name);
                    setShowCreateChatModal(false);
                  }}
                  className="w-full text-left px-4 py-2.5 border-2 border-black bg-white hover:bg-zap-yellow hover:-translate-y-[0.5px] active:translate-y-[1px] shadow-[2.5px_2.5px_0px_#000] rounded-sm font-lilita text-xs tracking-wider uppercase transition-all cursor-pointer text-black"
                >
                  💬 CHAT WITH {name.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
