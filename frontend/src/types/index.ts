export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarColor: string;
  isOnline: boolean;
  statusText?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  avatarColor: string;
  isGroup: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
  isBlocked?: boolean;
}
