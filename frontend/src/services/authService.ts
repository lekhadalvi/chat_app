import { USER_SERVICE_URL } from "../lib/constants";

export const authService = {
  async login(email: string): Promise<{ message: string }> {
    const res = await fetch(`${USER_SERVICE_URL}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "COULD NOT SEND OTP!");
    }
    return data;
  },

  async verify(email: string, otp: string): Promise<{ token: string; user: { _id: string; name: string; email: string } }> {
    const res = await fetch(`${USER_SERVICE_URL}/api/v1/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "INVALID OR EXPIRED OTP!");
    }
    return data;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("zap_token");
      localStorage.removeItem("zap_user_name");
      localStorage.removeItem("zap_authenticated");
      localStorage.removeItem("zap_login_time");
      localStorage.removeItem("zap_pending_chat");
      window.location.href = "/login";
    }
  }
};
