import fs from "fs";
import path from "path";
import type { User, Document, Category, Activity, Notification, Session } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

function writeJSON<T>(filename: string, data: T[]) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Users ───────────────────────────────────────────────
export function getUsers(): User[] {
  return readJSON<User>("users.json");
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: User): User {
  const users = getUsers();
  users.push(user);
  writeJSON("users.json", users);
  return user;
}

export function updateUser(id: string, data: Partial<User>): User | undefined {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index], ...data };
  writeJSON("users.json", users);
  return users[index];
}

// ─── Documents ───────────────────────────────────────────
export function getDocuments(): Document[] {
  return readJSON<Document>("documents.json");
}

export function getDocumentById(id: string): Document | undefined {
  return getDocuments().find((d) => d.id === id);
}

export function createDocument(doc: Document): Document {
  const docs = getDocuments();
  docs.push(doc);
  writeJSON("documents.json", docs);
  return doc;
}

export function updateDocument(id: string, data: Partial<Document>): Document | undefined {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === id);
  if (index === -1) return undefined;
  docs[index] = { ...docs[index], ...data, updatedAt: new Date().toISOString() };
  writeJSON("documents.json", docs);
  return docs[index];
}

export function deleteDocument(id: string): boolean {
  const docs = getDocuments();
  const filtered = docs.filter((d) => d.id !== id);
  if (filtered.length === docs.length) return false;
  writeJSON("documents.json", filtered);
  return true;
}

export function searchDocuments(query: string, category?: string, status?: string): Document[] {
  let docs = getDocuments();
  if (query) {
    const q = query.toLowerCase();
    docs = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q)
    );
  }
  if (category) {
    docs = docs.filter((d) => d.category === category);
  }
  if (status) {
    docs = docs.filter((d) => d.status === status);
  }
  return docs;
}

// ─── Categories ──────────────────────────────────────────
export function getCategories(): Category[] {
  return readJSON<Category>("categories.json");
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

export function createCategory(cat: Category): Category {
  const cats = getCategories();
  cats.push(cat);
  writeJSON("categories.json", cats);
  return cat;
}

export function updateCategory(id: string, data: Partial<Category>): Category | undefined {
  const cats = getCategories();
  const index = cats.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  cats[index] = { ...cats[index], ...data };
  writeJSON("categories.json", cats);
  return cats[index];
}

export function deleteCategory(id: string): boolean {
  const cats = getCategories();
  const filtered = cats.filter((c) => c.id !== id);
  if (filtered.length === cats.length) return false;
  writeJSON("categories.json", filtered);
  return true;
}

// ─── Activities ──────────────────────────────────────────
export function getActivities(userId?: string): Activity[] {
  const activities = readJSON<Activity>("activities.json");
  if (userId) return activities.filter((a) => a.userId === userId);
  return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createActivity(activity: Activity): Activity {
  const activities = readJSON<Activity>("activities.json");
  activities.unshift(activity);
  // Keep only last 200 activities
  writeJSON("activities.json", activities.slice(0, 200));
  return activity;
}

// ─── Notifications ───────────────────────────────────────
export function getNotifications(userId: string): Notification[] {
  return readJSON<Notification>("notifications.json")
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadNotificationCount(userId: string): number {
  return readJSON<Notification>("notifications.json").filter(
    (n) => n.userId === userId && !n.read
  ).length;
}

export function createNotification(notif: Notification): Notification {
  const notifs = readJSON<Notification>("notifications.json");
  notifs.unshift(notif);
  writeJSON("notifications.json", notifs.slice(0, 500));
  return notif;
}

export function markNotificationRead(id: string): boolean {
  const notifs = readJSON<Notification>("notifications.json");
  const index = notifs.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notifs[index].read = true;
  writeJSON("notifications.json", notifs);
  return true;
}

export function markAllNotificationsRead(userId: string): void {
  const notifs = readJSON<Notification>("notifications.json");
  notifs.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  writeJSON("notifications.json", notifs);
}

// ─── Sessions ────────────────────────────────────────────
export function getSessions(): Session[] {
  return readJSON<Session>("sessions.json");
}

export function getSessionByToken(token: string): Session | undefined {
  return getSessions().find(
    (s) => s.token === token && new Date(s.expiresAt) > new Date()
  );
}

export function createSession(session: Session): Session {
  const sessions = getSessions();
  sessions.push(session);
  writeJSON("sessions.json", sessions);
  return session;
}

export function deleteSession(token: string): void {
  const sessions = getSessions().filter((s) => s.token !== token);
  writeJSON("sessions.json", sessions);
}

export function cleanExpiredSessions(): void {
  const now = new Date();
  const sessions = getSessions().filter((s) => new Date(s.expiresAt) > now);
  writeJSON("sessions.json", sessions);
}

// ─── Dashboard Stats ─────────────────────────────────────
export function getDashboardStats() {
  const docs = getDocuments();
  const cats = getCategories();
  const totalSize = docs.reduce((sum, d) => sum + d.sizeBytes, 0);

  const statusCounts = {
    archivé: docs.filter((d) => d.status === "archivé").length,
    "en traitement": docs.filter((d) => d.status === "en traitement").length,
    brouillon: docs.filter((d) => d.status === "brouillon").length,
  };

  const categoryCounts = cats.map((c) => ({
    name: c.name,
    count: docs.filter((d) => d.category === c.name).length,
  }));

  const recentDocs = [...docs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalDocuments: docs.length,
    totalCategories: cats.length,
    totalStorageBytes: totalSize,
    totalStorageFormatted: formatBytes(totalSize),
    statusCounts,
    categoryCounts,
    recentDocuments: recentDocs,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
