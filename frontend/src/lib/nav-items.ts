import { Gamepad2, MessageSquare, User2, Users } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  Icon: typeof MessageSquare;
  /** Route prefixes that keep this tab highlighted; "/" matches exactly. */
  activePaths: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Chats", Icon: MessageSquare, activePaths: ["/", "/chat"] },
  { href: "/friends", label: "Friends", Icon: Users, activePaths: ["/friends"] },
  { href: "/games", label: "Games", Icon: Gamepad2, activePaths: ["/games"] },
  { href: "/profile", label: "You", Icon: User2, activePaths: ["/profile"] },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return item.activePaths.some((path) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)
  );
}
