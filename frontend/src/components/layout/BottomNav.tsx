"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isNavItemActive, NAV_ITEMS } from "@/lib/nav-items";

export interface BottomNavProps {
  className?: string;
}

/** Phone navigation. Replaced by SideRail on desktop. */
export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex shrink-0 items-center justify-around rounded-2xl bg-surface px-2 py-2 ink-border ink-shadow",
        className
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(item, pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-lg",
                isActive && "bg-brand-pink ink-border ink-shadow-sm"
              )}
            >
              <item.Icon className="size-5 text-ink" strokeWidth={isActive ? 3 : 2.25} />
            </span>
            <span
              className={cn(
                "text-[10px] tracking-wider uppercase",
                isActive ? "font-black text-ink" : "font-bold text-muted"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
