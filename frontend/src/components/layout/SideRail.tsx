"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isNavItemActive, NAV_ITEMS } from "@/lib/nav-items";

export interface SideRailProps {
  className?: string;
}

/** Desktop navigation. Replaced by BottomNav on phones. */
export function SideRail({ className }: SideRailProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "w-20 shrink-0 flex-col items-center gap-1 rounded-2xl bg-surface p-3 ink-border ink-shadow",
        className
      )}
    >
      <Link
        href="/"
        aria-label="Chit-Chat home"
        className="mb-3 grid size-11 shrink-0 place-items-center rounded-xl bg-brand-yellow text-xl font-black text-ink italic ink-border ink-shadow-sm"
      >
        C
      </Link>

      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(item, pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex w-full flex-col items-center gap-1 rounded-xl py-2"
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
                "text-[9px] tracking-wider uppercase",
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
