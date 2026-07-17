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
    localStorage.clear();
  }
};
