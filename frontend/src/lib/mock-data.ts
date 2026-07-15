import type { Chat, Story, User } from "@/types";

export const currentUser: User = {
  id: "me",
  name: "You",
  emoji: "🙂",
  tone: "pink",
};

export const stories: Story[] = [
  { id: "s1", seen: false, user: { id: "u1", name: "Kiki", emoji: "😺", tone: "pink" } },
  { id: "s2", seen: false, user: { id: "u2", name: "Jax", emoji: "🎮", tone: "yellow" } },
  { id: "s3", seen: true, user: { id: "u3", name: "Mia", emoji: "🌸", tone: "lilac" } },
];

export const chats: Chat[] = [
  {
    id: "c1",
    title: "Kiki",
    emoji: "😺",
    tone: "pink",
    accessory: "⚡",
    lastMessage: "You won't believe what happened at lunch today",
    timestamp: "2m ago",
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: "c2",
    title: "Jax Gamer",
    emoji: "🎮",
    tone: "yellow",
    lastMessage: "Ready for the boss fight? Bring snacks.",
    timestamp: "12m ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "c3",
    title: "Mia",
    emoji: "🌸",
    tone: "lilac",
    accessory: "★",
    lastMessage: "The new stickers are literally so cute",
    timestamp: "1h ago",
    unreadCount: 1,
  },
  {
    id: "c4",
    title: "Beam",
    emoji: "🛸",
    tone: "mint",
    lastMessage: "Did you see the homework thread?",
    timestamp: "3h ago",
    unreadCount: 0,
  },
  {
    id: "c5",
    title: "The Void",
    emoji: "🌌",
    tone: "sky",
    lastMessage: "Mystery solving tonight at 9?",
    timestamp: "Yesterday",
    unreadCount: 7,
  },
];
