import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Chat } from "@/types";

export interface ChatListItemProps {
  chat: Chat;
}

export function ChatListItem({ chat }: ChatListItemProps) {
  return (
    <li>
      <Link
        href={`/chat/${chat.id}`}
        className="flex items-center gap-3 rounded-2xl bg-surface p-3 ink-border ink-shadow transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        <span className="relative">
          <Avatar emoji={chat.emoji} tone={chat.tone} imageUrl={chat.imageUrl} alt={chat.title} />
          {chat.isOnline && (
            <span
              aria-label="Online"
              role="img"
              className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full bg-[#3ddc84] ink-border border-2"
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-black tracking-wide text-ink uppercase">
              {chat.title}
              {chat.accessory && <span aria-hidden="true"> {chat.accessory}</span>}
            </span>
            <span className="shrink-0 text-[10px] font-bold text-muted">{chat.timestamp}</span>
          </span>
          <span className="mt-0.5 block truncate text-xs font-semibold text-muted">
            {chat.lastMessage}
          </span>
        </span>

        {chat.unreadCount > 0 && (
          <Badge>
            <span className="sr-only">{chat.unreadCount} unread messages</span>
            <span aria-hidden="true">{chat.unreadCount > 9 ? "9+" : chat.unreadCount}</span>
          </Badge>
        )}
      </Link>
    </li>
  );
}
