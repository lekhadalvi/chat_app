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
    id: "user_kiki",
    name: "Kiki",
    avatarColor: "var(--color-zap-pink)",
    isOnline: true,
    statusText: "ONLINE • TYPING...",
  },
  {
    id: "user_jax",
    name: "Jax",
    avatarColor: "var(--color-zap-yellow)",
    isOnline: true,
    statusText: "ONLINE",
  },
  {
    id: "user_mia",
    name: "Mia",
    avatarColor: "var(--color-zap-cyan)",
    isOnline: true,
    statusText: "ONLINE",
  },
  {
    id: "user_beam",
    name: "Beam",
    avatarColor: "#BBEBFF",
    isOnline: false,
    statusText: "OFFLINE",
  },
  {
    id: "user_void",
    name: "The Void",
    avatarColor: "#FFFFFF",
    isOnline: true,
    statusText: "ONLINE",
  },
];

export const mockChats: Chat[] = [
  {
    id: "chat_1",
    name: "Kiki",
    avatarColor: "var(--color-zap-pink)",
    isGroup: false,
    unreadCount: 3,
    messages: [
      {
        id: "msg_1_1",
        senderId: "user_kiki",
        content: "OMG! Have you seen the trailer for the new Neo-Void series yet? 😱",
        timestamp: "10:40 AM",
      },
      {
        id: "msg_1_2",
        senderId: "current_user",
        content: "Not yet! is it as hype as the posters looked? I was waiting for the HD drop.",
        timestamp: "10:41 AM",
      },
      {
        id: "msg_1_3",
        senderId: "user_kiki",
        content: "It's better. The animation is SO chunky and brutalist. It's literally us lol.",
        timestamp: "10:42 AM",
      },
      {
        id: "msg_1_4",
        senderId: "current_user",
        content: "Check out this screengrab I found!",
        timestamp: "10:43 AM",
      },
      {
        id: "msg_1_5",
        senderId: "current_user",
        content: "IMAGE:https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop", // placeholder text for custom image box rendering
        timestamp: "10:43 AM",
      },
    ],
  },
  {
    id: "chat_2",
    name: "Jax",
    avatarColor: "var(--color-zap-yellow)",
    isGroup: false,
    unreadCount: 0,
    messages: [
      {
        id: "msg_2_1",
        senderId: "user_jax",
        content: "GG on that last match, bro.",
        timestamp: "11:15 AM",
      },
    ],
  },
  {
    id: "chat_3",
    name: "Mia",
    avatarColor: "var(--color-zap-cyan)",
    isGroup: false,
    unreadCount: 1,
    messages: [
      {
        id: "msg_3_1",
        senderId: "user_mia",
        content: "Send me the link to that playlist, MIA ★",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "chat_4",
    name: "Beam",
    avatarColor: "#BBEBFF",
    isGroup: false,
    unreadCount: 0,
    messages: [
      {
        id: "msg_4_1",
        senderId: "user_beam",
        content: "Did you see the homework?",
        timestamp: "2h ago",
      },
    ],
    isBlocked: true,
  },
  {
    id: "chat_5",
    name: "THE VOID",
    avatarColor: "#FFFFFF",
    isGroup: true,
    unreadCount: 0,
    messages: [
      {
        id: "msg_5_1",
        senderId: "user_void",
        content: "Mystery solving tonight...",
        timestamp: "Yesterday",
      },
    ],
  },
];
