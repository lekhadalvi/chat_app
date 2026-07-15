import { BottomNav } from "@/components/layout/BottomNav";
import { SideRail } from "@/components/layout/SideRail";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/cn";
import type { User } from "@/types";

export interface AppShellProps {
  user: User;
  /** List pane: chat list, friends list, etc. */
  sidebar: React.ReactNode;
  /** Detail pane: the open conversation, or an empty state. */
  children: React.ReactNode;
  /**
   * Which pane a phone shows — there isn't room for both. Desktop always
   * shows the two side by side.
   */
  mobilePane?: "sidebar" | "main";
}

/**
 * Responsive frame for every screen.
 *
 * Phone: one pane at a time, with the bottom nav.
 * Desktop (lg+): icon rail | list pane | detail pane, all visible at once.
 */
export function AppShell({ user, sidebar, children, mobilePane = "sidebar" }: AppShellProps) {
  const paneBase = "min-w-0 flex-col gap-3";
  // On phones the inactive pane is dropped entirely; both return at lg.
  const paneMobile = "w-full max-w-md mx-auto lg:mx-0 lg:max-w-none";

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[1400px] gap-3 p-3">
      <SideRail className="hidden lg:flex" />

      <div
        className={cn(
          paneBase,
          paneMobile,
          "lg:w-80 lg:shrink-0 xl:w-96",
          mobilePane === "sidebar" ? "flex" : "hidden lg:flex"
        )}
      >
        <TopBar user={user} />
        <div className="flex-1 space-y-3 overflow-y-auto pb-1">{sidebar}</div>
        <BottomNav className="lg:hidden" />
      </div>

      <main
        className={cn(
          paneBase,
          paneMobile,
          "lg:flex-1",
          mobilePane === "main" ? "flex" : "hidden lg:flex"
        )}
      >
        {children}
      </main>
    </div>
  );
}
