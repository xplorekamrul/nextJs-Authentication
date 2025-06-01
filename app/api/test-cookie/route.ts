// app/api/test-cookie/route.ts

import { setAuthCookie, getAuthCookie, deleteAuthCookie } from "@/lib/utils/cookies";

export async function GET() {
  setAuthCookie("my-token");
  const token = getAuthCookie();
  deleteAuthCookie();

  return Response.json({ token });
}
