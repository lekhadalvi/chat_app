import { CHAT_SERVICE_URL } from "../lib/constants";

export const chatService = {
  async fetchChats(token: string): Promise<any> {
    const res = await fetch(`${CHAT_SERVICE_URL}/api/v1/chat/all`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO LOAD CHATS!");
    }
    return data;
  },

  async fetchMessages(token: string, chatId: string): Promise<any> {
    const res = await fetch(`${CHAT_SERVICE_URL}/api/v1/chat/message/${chatId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO LOAD MESSAGES!");
    }
    return data;
  },

  async sendMessage(token: string, chatId: string, content: string): Promise<any> {
    const res = await fetch(`${CHAT_SERVICE_URL}/api/v1/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ chatId, text: content })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO SEND MESSAGE!");
    }
    return data;
  },

  async createChat(token: string, otherUserId: string): Promise<any> {
    const res = await fetch(`${CHAT_SERVICE_URL}/api/v1/chat/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ otherUserId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO CREATE CHAT!");
    }
    return data;
  },

  async createGroupChat(token: string, groupName: string, userIds: string[]): Promise<any> {
    const res = await fetch(`${CHAT_SERVICE_URL}/api/v1/chat/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ groupName, userIds })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO CREATE GROUP CHAT!");
    }
    return data;
  },

  async inviteUserChat(token: string, query: string): Promise<any> {
    const res = await fetch(`${CHAT_SERVICE_URL}/api/v1/chat/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO INVITE GAMER!");
    }
    return data;
  }
};
