export type AvatarTone = "pink" | "yellow" | "mint" | "sky" | "lilac" | "ink";

export interface User {
  id: string;
  name: string;
  /** Stand-in for a profile image until the API provides one. */
  emoji: string;
  tone: AvatarTone;
  imageUrl?: string;
}

export interface Story {
  id: string;
  user: User;
  seen: boolean;
}

export interface Chat {
  id: string;
  /** Group name, or the other member's name for a 1:1 chat. */
  title: string;
  emoji: string;
  tone: AvatarTone;
  imageUrl?: string;
  /** Trailing decoration next to the title, e.g. "⚡" or "★". */
  accessory?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline?: boolean;
}
