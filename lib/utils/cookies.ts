// lib/auth-cookie.ts
import { cookies } from "next/headers";

export const COOKIE_NAME = "auth-token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

// ✅ Set auth token cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies(); // ✅ Await the promise
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

// ✅ Get auth token cookie
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// ✅ Delete auth token cookie
export async function deleteAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
