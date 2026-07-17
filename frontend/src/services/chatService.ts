import { CHAT_SERVICE_URL } from "../lib/constants";

export const chatService = {
  async fetchChats(token: string): Promise<any[]> {
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

  async fetchMessages(token: string, chatId: string): Promise<any[]> {
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
      body: JSON.stringify({ chatId, content })
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
  }
};
