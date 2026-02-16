import crypto from "crypto";
import { cookies } from "next/headers";
import { getUserById, getSessionByToken, createSession, deleteSession } from "./db";
import type { User } from "./types";

const SESSION_COOKIE = "archivist_session";
const SESSION_DURATION_DAYS = 7;

// ─── Password Hashing ────────────────────────────────────
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === testHash;
}

// ─── Session Management ──────────────────────────────────
export function generateSessionToken(): string {
  return crypto.randomUUID() + "-" + crypto.randomBytes(16).toString("hex");
}

export function createUserSession(userId: string): string {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  createSession({
    token,
    userId,
    expiresAt: expiresAt.toISOString(),
  });

  return token;
}

export function destroySession(token: string): void {
  deleteSession(token);
}

// ─── Cookie Helpers ──────────────────────────────────────
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

// ─── Auth Check ──────────────────────────────────────────
export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const session = getSessionByToken(token);
  if (!session) return null;

  const user = getUserById(session.userId);
  if (!user) return null;

  return user;
}

export function generateId(): string {
  return crypto.randomUUID();
}
