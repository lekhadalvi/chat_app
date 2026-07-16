"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { ChatList } from "@/components/home/ChatList";
import { StoryRail } from "@/components/home/StoryRail";
import { SearchInput } from "@/components/ui/SearchInput";
import type { Chat, Story } from "@/types";

export interface HomeScreenProps {
  stories: Story[];
  chats: Chat[];
  onNewChat?: () => void;
}

export function HomeScreen({ stories, chats, onNewChat }: HomeScreenProps) {
  const [query, setQuery] = useState("");

  const visibleChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(q) || chat.lastMessage.toLowerCase().includes(q)
    );
  }, [chats, query]);

  return (
    <div className="relative flex-1">
      <div className="space-y-3">
        <StoryRail stories={stories} />
        <SearchInput value={query} onChange={setQuery} />
        <ChatList chats={visibleChats} />
      </div>

      <button
        type="button"
        onClick={onNewChat}
        aria-label="New chat"
        className="absolute -bottom-2 right-0 grid size-12 place-items-center rounded-2xl bg-brand-yellow text-2xl font-black text-ink ink-border ink-shadow-lg transition-transform hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        <Plus className="size-6" strokeWidth={4} />
      </button>
    </div>
  );
}
