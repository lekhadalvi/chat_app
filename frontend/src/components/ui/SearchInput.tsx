"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search chats...",
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 ink-border ink-shadow-sm",
        className
      )}
    >
      <Search className="size-4 shrink-0 text-ink" strokeWidth={3} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-xs font-bold tracking-widest text-ink uppercase outline-none placeholder:text-muted"
      />
    </div>
  );
}
