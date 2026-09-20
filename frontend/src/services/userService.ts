import { USER_SERVICE_URL } from "../lib/constants";

export const userService = {
  async fetchMe(token: string): Promise<{ _id: string; name: string; email: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch(`${USER_SERVICE_URL}/api/v1/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "UNAUTHORIZED!");
      }
      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  async fetchAllUsers(token: string): Promise<{ _id: string; name: string; email: string }[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`${USER_SERVICE_URL}/api/v1/users/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "FAILED TO LOAD CONTACTS!");
      }
      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  async updateUsername(token: string, newName: string): Promise<{ message: string; token?: string; user?: any }> {
    // Attempt with PUT first
    try {
      const res = await fetch(`${USER_SERVICE_URL}/api/v1/updatename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      }
    } catch {
      // Fallback to POST below
    }

    // Fallback to POST
    const res = await fetch(`${USER_SERVICE_URL}/api/v1/updatename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: newName })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO UPDATE USERNAME!");
    }
    return data;
  }
};
