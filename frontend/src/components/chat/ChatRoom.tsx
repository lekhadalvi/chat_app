import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Chat } from "@/types";

export interface ChatRoomProps {
  chat: Chat;
}

/**
 * Detail pane for one conversation. The message thread and composer land here;
 * for now the body is a placeholder.
 */
export function ChatRoom({ chat }: ChatRoomProps) {
  return (
    <>
      <header className="flex shrink-0 items-center gap-3 rounded-2xl bg-brand-yellow px-3 py-2 ink-border ink-shadow">
        {/* Desktop keeps the chat list visible, so back is phone-only. */}
        <Link href="/" aria-label="Back to chats" className="grid size-8 place-items-center lg:hidden">
          <ArrowLeft className="size-6 text-ink" strokeWidth={3} />
        </Link>

        <Avatar emoji={chat.emoji} tone={chat.tone} imageUrl={chat.imageUrl} alt="" size="sm" />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-black tracking-wide text-ink uppercase">
            {chat.title}
            {chat.accessory && <span aria-hidden="true"> {chat.accessory}</span>}
          </h2>
          <p className="text-[10px] font-bold tracking-wider text-ink/60 uppercase">
            {chat.isOnline ? "Online now" : `Active ${chat.timestamp}`}
          </p>
        </div>
      </header>

      <EmptyState emoji="💬" title="Messages coming soon" description="This thread is wired up next" />
    </>
  );
}
