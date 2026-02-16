export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  organization: string;
  bio: string;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  type: string;
  size: string;
  sizeBytes: number;
  status: "archivé" | "en traitement" | "brouillon";
  date: string;
  tags: string[];
  description: string;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  targetType: "document" | "category" | "settings" | "user";
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
}
