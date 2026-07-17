import { useApp } from "../context/AppContext";

export function useAuth() {
  const {
    user,
    setUser,
    loading,
    setLoading,
    verifyAuth,
    updateName,
    logout
  } = useApp();

  return {
    user,
    setUser,
    loading,
    setLoading,
    verifyAuth,
    updateName,
    logout
  };
}
