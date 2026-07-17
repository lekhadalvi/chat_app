import { useApp } from "../context/AppContext";

export function useChat() {
  const {
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
    fetchChatsList,
    sendMessage,
    createChat
  } = useApp();

  return {
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
    fetchChatsList,
    sendMessage,
    createChat
  };
}
