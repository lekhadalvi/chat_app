import React from "react";
import { SideRail } from "./SideRail";
import { ChatList } from "./ChatList";
import { ChatArea } from "./ChatArea";
import { Chat, User } from "../../types";

interface AppShellProps {
  currentUser: User;
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onSendMessage: (chatId: string, content: string) => void;
}

export function AppShell({
  currentUser,
  chats,
  activeChatId,
  onSelectChat,
  onSendMessage,
}: AppShellProps) {
  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="flex w-full h-full border-[3.5px] border-black bg-white rounded-sm shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* 1. Left profile side rail */}
      <SideRail currentUser={currentUser} />

      {/* 2. Chat navigation items list */}
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
      />

      {/* 3. Right Message and input area */}
      <ChatArea
        chat={activeChat}
        currentUser={currentUser}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
