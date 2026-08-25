"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Chat } from "../types";
import { userService } from "../services/userService";
import { chatService } from "../services/chatService";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChatId: string;
  setActiveChatId: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  mobileView: "list" | "chat";
  setMobileView: React.Dispatch<React.SetStateAction<"list" | "chat">>;
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateChatModal: boolean;
  setShowCreateChatModal: React.Dispatch<React.SetStateAction<boolean>>;
  dbUsers: { _id: string; name: string; email: string }[];
  loadingUsers: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  verifyAuth: () => Promise<void>;
  fetchChatsList: () => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  createChat: (otherUserId: string) => Promise<void>;
  createGroupChat: (groupName: string, userIds: string[]) => Promise<void>;
  inviteUserChat: (query: string) => Promise<void>;
  updateName: (newName: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    avatarColor: "var(--color-zap-purple)",
    isOnline: true
  });
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("chats");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [dbUsers, setDbUsers] = useState<{ _id: string; name: string; email: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Verify Authentication & Load Profile
  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem("zap_token");
    if (!token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const data = await userService.fetchMe(token);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email || "",
        avatarColor: "var(--color-zap-purple)",
        isOnline: true
      });
    } catch (err) {
      console.error("Auth check failed", err);
      localStorage.clear();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 2. Fetch Chat List from Database
  const fetchChatsList = useCallback(async () => {
    const token = localStorage.getItem("zap_token");
    if (!token) return;

    try {
      const resData = await chatService.fetchChats(token);
      const dbChats = resData.chats || [];
      const mapped = dbChats.map((item: any) => {
        const lastMsgText = item.chat.latestMessage ? item.chat.latestMessage.text : "";
        const timeStr = item.chat.updatedAt 
          ? new Date(item.chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : "Now";

        const colors = [
          "var(--color-zap-pink)",
          "var(--color-zap-purple)",
          "var(--color-zap-cyan)",
          "var(--color-zap-yellow)"
        ];
        const nameSum = item.user.name.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const avatarColor = colors[nameSum % colors.length];

        return {
          id: item.chat._id,
          name: item.user.name,
          avatarColor,
          isGroup: false,
          lastMessage: lastMsgText,
          lastMessageTime: timeStr,
          unreadCount: item.chat.unseenCount,
          messages: [],
          otherUserId: item.user._id
        };
      });
      setChats(mapped);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  }, []);

  // 3. Send Message
  const sendMessage = async (chatId: string, content: string) => {
    const token = localStorage.getItem("zap_token");
    if (!token) return;

    try {
      const newMsg = await chatService.sendMessage(token, chatId, content);
      
      // Update chats list state locally for instant UI update
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: newMsg._id || Math.random().toString(),
                  senderId: user.id,
                  content: content,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  // 4. Create Chat
  const createChat = async (otherUserId: string) => {
    const token = localStorage.getItem("zap_token");
    if (!token) return;

    try {
      const newChat = await chatService.createChat(token, otherUserId);
      await fetchChatsList();
      const chatId = newChat?.chat || newChat?._id;
      if (chatId) {
        setActiveChatId(chatId);
      }
      setShowCreateChatModal(false);
      setMobileView("chat");
    } catch (err) {
      console.error("Create chat failed", err);
      alert("Failed to initialize conversation.");
    }
  };

  const createGroupChat = async (groupName: string, userIds: string[]) => {
    const token = localStorage.getItem("zap_token");
    if (!token) return;

    try {
      const newChat = await chatService.createGroupChat(token, groupName, userIds);
      await fetchChatsList();
      if (newChat.chat) {
        setActiveChatId(newChat.chat);
      }
      setShowCreateChatModal(false);
      setMobileView("chat");
    } catch (err: any) {
      console.error("Create group chat failed", err);
      alert(err.message || "Failed to initialize group squad.");
    }
  };

  const inviteUserChat = async (query: string) => {
    const token = localStorage.getItem("zap_token");
    if (!token) return;

    try {
      const newChat = await chatService.inviteUserChat(token, query);
      await fetchChatsList();
      if (newChat.chat) {
        setActiveChatId(newChat.chat);
      }
      setShowCreateChatModal(false);
      setMobileView("chat");
    } catch (err: any) {
      console.error("Invite user failed", err);
      alert(err.message || "Failed to invite gamer.");
    }
  };

  // 5. Update Name
  const updateName = async (newName: string) => {
    const token = localStorage.getItem("zap_token");
    if (!token) return;

    try {
      await userService.updateUsername(token, newName);
      setUser((prev) => ({
        ...prev,
        name: newName
      }));
      localStorage.setItem("zap_user_name", newName);
      // Reload chat names since the name has changed
      fetchChatsList();
    } catch (err) {
      console.error("Update username failed", err);
      throw err;
    }
  };

  // 6. Logout
  const logout = () => {
    authService.logout();
    router.push("/login");
  };

  // 7. Fetch all users list when Create Chat modal opens
  useEffect(() => {
    if (showCreateChatModal) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const token = localStorage.getItem("zap_token");
          if (!token) return;
          const allUsers = await userService.fetchAllUsers(token);
          const filtered = allUsers.filter((u) => u._id !== user.id);
          setDbUsers(filtered);
        } catch (err) {
          console.error("Failed to load users", err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [showCreateChatModal, user.id]);

  // 8. Load messages for active chat and poll every 3 seconds
  useEffect(() => {
    if (!activeChatId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("zap_token");
        if (!token) return;
        const resData: any = await chatService.fetchMessages(token, activeChatId);
        const dbMessages: any[] = Array.isArray(resData) ? resData : (resData?.messages || []);
        
        const mappedMessages = dbMessages.map((msg: any) => {
          const timeStr = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "Now";
          return {
            id: msg._id,
            senderId: msg.sender,
            content: msg.text,
            timestamp: timeStr
          };
        });

        setChats((prev) =>
          prev.map((c) => {
            if (c.id === activeChatId) {
              return {
                ...c,
                messages: mappedMessages
              };
            }
            return c;
          })
        );
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    loadMessages();

    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        activeChatId,
        setActiveChatId,
        activeTab,
        setActiveTab,
        mobileView,
        setMobileView,
        showDrawer,
        setShowDrawer,
        showCreateChatModal,
        setShowCreateChatModal,
        dbUsers,
        loadingUsers,
        loading,
        setLoading,
        verifyAuth,
        fetchChatsList,
        sendMessage,
        createChat,
        createGroupChat,
        inviteUserChat,
        updateName,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
