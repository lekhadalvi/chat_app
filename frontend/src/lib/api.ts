const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function requestOtp(email: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function verifyOtp(email: string, otp: string) {
  const res = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data as { message: string; user: { id: string; name: string; email: string }; token: string };
}
