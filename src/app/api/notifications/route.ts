import { NextResponse } from "next/server";
import { getNotifications, getUnreadNotificationCount, markAllNotificationsRead } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const notifications = getNotifications(user.id);
  const unreadCount = getUnreadNotificationCount(user.id);

  return NextResponse.json({ notifications, unreadCount });
}

export async function PUT() {
  seedDatabase();

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  markAllNotificationsRead(user.id);
  return NextResponse.json({ success: true });
}
