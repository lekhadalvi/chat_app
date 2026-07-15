import { ChatListItem } from "@/components/home/ChatListItem";
import type { Chat } from "@/types";

export interface ChatListProps {
  chats: Chat[];
}

export function ChatList({ chats }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <p className="rounded-2xl bg-surface p-6 text-center text-xs font-bold tracking-wider text-muted uppercase ink-border ink-shadow">
        No chats yet
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
}
