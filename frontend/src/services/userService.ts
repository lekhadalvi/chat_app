import { USER_SERVICE_URL } from "../lib/constants";

export const userService = {
  async fetchMe(token: string): Promise<{ _id: string; name: string; email: string }> {
    const res = await fetch(`${USER_SERVICE_URL}/api/v1/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "UNAUTHORIZED!");
    }
    return data;
  },

  async fetchAllUsers(token: string): Promise<{ _id: string; name: string; email: string }[]> {
    const res = await fetch(`${USER_SERVICE_URL}/api/v1/users/all`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "FAILED TO LOAD CONTACTS!");
    }
    return data;
  },

  async updateUsername(token: string, newName: string): Promise<{ message: string }> {
    const res = await fetch(`${USER_SERVICE_URL}/api/v1/updatename`, {
      method: "GET", // Backend expects GET for updatename
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
