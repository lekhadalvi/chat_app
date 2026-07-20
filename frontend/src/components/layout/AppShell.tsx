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
    createChat,
    createGroupChat,
    inviteUserChat
  } = useChat();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
  const [groupNameInput, setGroupNameInput] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const filteredUsers = dbUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u._id.includes(searchQuery)
  );

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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

            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Gamer by ID or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f7f3] border-2 border-black px-3 py-1.5 text-xs font-semibold placeholder-black/40 rounded-sm focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>

            {loadingUsers ? (
              <div className="py-4 text-center font-lilita text-xs animate-pulse text-black/50">
                LOADING SQUADMATES...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-4 flex flex-col items-center gap-2">
                <div className="font-lilita text-xs text-black/50 text-center">
                  {searchQuery ? "NO REGISTERED GAMER MATCHED!" : "NO REGISTERED GAMERS YET!"}
                </div>
                {searchQuery.trim() !== "" && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true);
                      try {
                        await inviteUserChat(searchQuery.trim());
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="w-full py-2 bg-zap-yellow text-black border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] font-lilita text-xs uppercase cursor-pointer hover:bg-amber-400 active:translate-y-[1px] active:shadow-none"
                  >
                    {isSubmitting ? "INVITING..." : `INVITE "${searchQuery.trim()}" VIA EMAIL ⚡`}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                {filteredUsers.map((u) => {
                  const colors = [
                    "var(--color-zap-purple)",
                    "var(--color-zap-pink)",
                    "var(--color-zap-cyan)",
                    "var(--color-zap-yellow)"
                  ];
                  const codeSum = u.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                  const randomColor = colors[codeSum % colors.length];
                  const isSelected = selectedUserIds.includes(u._id);

                  return (
                    <div
                      key={u._id}
                      className={cn(
                        "w-full flex items-center justify-between p-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] transition-all",
                        isSelected ? "bg-amber-100 border-[#FF00E0]" : "bg-white"
                      )}
                    >
                      <div className="flex items-center gap-2.5 flex-grow min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectUser(u._id)}
                          className="w-4 h-4 accent-[#FF00E0] cursor-pointer"
                        />
                        <div 
                          className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center font-lilita text-xs uppercase flex-shrink-0"
                          style={{ backgroundColor: randomColor }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-lilita text-xs uppercase tracking-wide text-black truncate leading-tight">
                            {u.name}
                          </span>
                          <span className="text-[9px] text-black/50 font-bold truncate leading-none">
                            {u.email}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => createChat(u._id)}
                        className="px-2 py-1 bg-zap-cyan text-black border-[1.5px] border-black rounded-sm font-lilita text-[9px] uppercase shadow-[1px_1px_0px_#000] hover:bg-cyan-300 ml-2 flex-shrink-0"
                      >
                        CHAT
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Group Squad creation drawer if members checked */}
            {selectedUserIds.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t-2 border-black">
                <input
                  type="text"
                  placeholder="Group Squad Name..."
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  className="w-full bg-[#f8f7f3] border-2 border-black px-3 py-1 text-xs font-semibold placeholder-black/40 rounded-sm focus:outline-none shadow-[2px_2px_0px_#000]"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (!groupNameInput.trim()) {
                      alert("Please enter a Group Squad Name!");
                      return;
                    }
                    setIsSubmitting(true);
                    try {
                      await createGroupChat(groupNameInput.trim(), selectedUserIds);
                      setSelectedUserIds([]);
                      setGroupNameInput("");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="w-full py-2 bg-[#FF00E0] text-white border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] font-lilita text-xs uppercase cursor-pointer hover:bg-pink-600 active:translate-y-[1px] active:shadow-none"
                >
                  {isSubmitting ? "CREATING..." : `CREATE GROUP SQUAD (${selectedUserIds.length}) 🔥`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
