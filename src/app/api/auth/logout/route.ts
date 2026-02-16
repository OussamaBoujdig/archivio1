import { NextResponse } from "next/server";
import { getSessionToken, clearSessionCookie, destroySession } from "@/lib/auth";

export async function POST() {
  const token = await getSessionToken();
  if (token) {
    destroySession(token);
  }
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
