import { User, Chat } from "../types";

export const currentUser: User = {
  id: "current_user",
  name: "GamerTag_99",
  avatarColor: "var(--color-zap-purple)",
  isOnline: true,
  statusText: "Ready to rumble!",
};

export const mockUsers: User[] = [
  {
    id: "user_1",
    name: "PixelQueen_x",
    avatarColor: "var(--color-zap-pink)",
    isOnline: true,
    statusText: "Designing the metaverse...",
  },
  {
    id: "user_2",
    name: "MemeLord_42",
    avatarColor: "var(--color-zap-yellow)",
    isOnline: true,
    statusText: "Spamming memes 24/7",
  },
  {
    id: "user_3",
    name: "CyberNinja",
    avatarColor: "var(--color-zap-cyan)",
    isOnline: false,
    statusText: "AFK eating noodles",
  },
  {
    id: "user_4",
    name: "GlitchHunter",
    avatarColor: "#FF5E5E",
    isOnline: true,
    statusText: "Fixing bugs in production",
  },
];

export const mockChats: Chat[] = [
  {
    id: "chat_1",
    name: "🌪️ GENERAL CHAOS",
    avatarColor: "var(--color-zap-purple)",
    isGroup: true,
    unreadCount: 3,
    messages: [
      {
        id: "msg_1_1",
        senderId: "user_2",
        content: "Yooo is anyone ready for the chat launch?!",
        timestamp: "10:32 AM",
      },
      {
        id: "msg_1_2",
        senderId: "user_1",
        content: "Hell yeah! The design is looking extremely spicy 🌶️",
        timestamp: "10:34 AM",
      },
      {
        id: "msg_1_3",
        senderId: "user_4",
        content: "Just committed the modular page refactoring. Built in 5s! 🚀",
        timestamp: "10:35 AM",
      },
    ],
  },
  {
    id: "chat_2",
    name: "👾 THE SQUAD CHAT",
    avatarColor: "var(--color-zap-pink)",
    isGroup: true,
    unreadCount: 0,
    messages: [
      {
        id: "msg_2_1",
        senderId: "user_3",
        content: "Who's gaming tonight? Minecraft or Valorant?",
        timestamp: "Yesterday",
      },
      {
        id: "msg_2_2",
        senderId: "current_user",
        content: "Minecraft for sure, let's build a neo-brutalist castle!",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "chat_3",
    name: "👑 PixelQueen_x",
    avatarColor: "var(--color-zap-pink)",
    isGroup: false,
    unreadCount: 1,
    messages: [
      {
        id: "msg_3_1",
        senderId: "user_1",
        content: "Hey, can you review the new lightning bolt asset? Wrote it as an SVG.",
        timestamp: "11:05 AM",
      },
    ],
  },
  {
    id: "chat_4",
    name: "🐸 MemeLord_42",
    avatarColor: "var(--color-zap-yellow)",
    isGroup: false,
    unreadCount: 0,
    messages: [
      {
        id: "msg_4_1",
        senderId: "user_2",
        content: "Look at this cat meme, absolute peak web design",
        timestamp: "Monday",
      },
      {
        id: "msg_4_2",
        senderId: "current_user",
        content: "LMAO true!",
        timestamp: "Monday",
      },
    ],
  },
  {
    id: "chat_5",
    name: "🕵️ CyberNinja",
    avatarColor: "var(--color-zap-cyan)",
    isGroup: false,
    unreadCount: 0,
    messages: [
      {
        id: "msg_5_1",
        senderId: "user_3",
        content: "I will be back in 2 hours, save me some pizza.",
        timestamp: "July 12",
      },
    ],
  },
];
