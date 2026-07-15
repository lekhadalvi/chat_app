"use client";

import { useMemo, useState } from "react";
import { ChatList } from "@/components/home/ChatList";
import { StoryRail } from "@/components/home/StoryRail";
import { SearchInput } from "@/components/ui/SearchInput";
import type { Chat, Story } from "@/types";

export interface HomeScreenProps {
  stories: Story[];
  chats: Chat[];
}

export function HomeScreen({ stories, chats }: HomeScreenProps) {
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
    <>
      <StoryRail stories={stories} />
      <SearchInput value={query} onChange={setQuery} />
      <ChatList chats={visibleChats} />
    </>
  );
}
