"use client";

import { Menu } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/types";

export interface TopBarProps {
  user: User;
  onMenuClick?: () => void;
}

export function TopBar({ user, onMenuClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-3 rounded-2xl bg-brand-yellow px-3 py-2 ink-border ink-shadow">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuClick}
        className="grid size-8 place-items-center"
      >
        <Menu className="size-6 text-ink" strokeWidth={3} />
      </button>

      <h1 className="text-2xl font-black tracking-tight text-ink italic [text-shadow:2px_2px_0_#fff]">
        CHIT-CHAT
      </h1>

      <Avatar emoji={user.emoji} tone={user.tone} imageUrl={user.imageUrl} alt={user.name} size="sm" />
    </header>
  );
}
