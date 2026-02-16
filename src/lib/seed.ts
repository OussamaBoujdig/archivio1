import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function id(): string {
  return crypto.randomUUID();
}

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

const adminId = id();

const users = [
  {
    id: adminId,
    name: "Admin",
    email: "admin@entreprise.fr",
    passwordHash: hashPassword("admin123"),
    role: "admin",
    organization: "Mon Entreprise",
    bio: "",
    createdAt: daysAgo(90),
  },
];

const categories = [
  { id: id(), name: "Rapports", icon: "FileText", description: "Rapports annuels, trimestriels et mensuels", createdBy: adminId, createdAt: daysAgo(60) },
  { id: id(), name: "Contrats", icon: "FileSignature", description: "Contrats clients, fournisseurs et partenaires", createdBy: adminId, createdAt: daysAgo(60) },
  { id: id(), name: "Factures", icon: "Receipt", description: "Factures entrantes et sortantes", createdBy: adminId, createdAt: daysAgo(60) },
  { id: id(), name: "Juridique", icon: "Scale", description: "Documents juridiques et conformité", createdBy: adminId, createdAt: daysAgo(60) },
  { id: id(), name: "Ressources Humaines", icon: "Users", description: "Documents RH, contrats de travail, fiches de paie", createdBy: adminId, createdAt: daysAgo(60) },
];

const documents = [
  {
    id: id(), title: "Rapport annuel 2025", category: "Rapports", type: "PDF", size: "2.4 MB", sizeBytes: 2516582,
    status: "archivé", date: "2025-01-15", tags: ["finance", "annuel", "2025"], description: "Rapport annuel complet de l'exercice 2025",
    fileName: "rapport-annuel-2025.pdf", uploadedBy: adminId, createdAt: daysAgo(30), updatedAt: daysAgo(2),
  },
  {
    id: id(), title: "Contrat de prestation N°4521", category: "Contrats", type: "DOCX", size: "842 KB", sizeBytes: 862208,
    status: "en traitement", date: "2025-02-20", tags: ["prestation", "client"], description: "Contrat de prestation de services pour le client ABC",
    fileName: "contrat-4521.docx", uploadedBy: adminId, createdAt: daysAgo(20), updatedAt: daysAgo(5),
  },
  {
    id: id(), title: "Facture #2025-0892", category: "Factures", type: "PDF", size: "156 KB", sizeBytes: 159744,
    status: "archivé", date: "2025-03-01", tags: ["facture", "mars"], description: "Facture mensuelle de mars 2025",
    fileName: "facture-2025-0892.pdf", uploadedBy: adminId, createdAt: daysAgo(15), updatedAt: daysAgo(15),
  },
  {
    id: id(), title: "Politique de confidentialité v3", category: "Juridique", type: "PDF", size: "1.1 MB", sizeBytes: 1153434,
    status: "archivé", date: "2025-01-10", tags: ["rgpd", "confidentialité"], description: "Politique de confidentialité mise à jour v3",
    fileName: "politique-confidentialite-v3.pdf", uploadedBy: adminId, createdAt: daysAgo(45), updatedAt: daysAgo(10),
  },
  {
    id: id(), title: "Audit interne Q4 2025", category: "Rapports", type: "XLSX", size: "3.2 MB", sizeBytes: 3355443,
    status: "en traitement", date: "2025-03-10", tags: ["audit", "Q4"], description: "Audit interne du quatrième trimestre 2025",
    fileName: "audit-q4-2025.xlsx", uploadedBy: adminId, createdAt: daysAgo(10), updatedAt: daysAgo(3),
  },
  {
    id: id(), title: "Contrat de travail - M. Leroy", category: "Ressources Humaines", type: "DOCX", size: "520 KB", sizeBytes: 532480,
    status: "archivé", date: "2025-02-01", tags: ["embauche", "CDI"], description: "Contrat CDI de M. Leroy, poste développeur senior",
    fileName: "contrat-leroy.docx", uploadedBy: adminId, createdAt: daysAgo(40), updatedAt: daysAgo(40),
  },
  {
    id: id(), title: "Budget prévisionnel 2026", category: "Rapports", type: "XLSX", size: "1.8 MB", sizeBytes: 1887436,
    status: "brouillon", date: "2025-03-15", tags: ["budget", "2026", "prévisionnel"], description: "Budget prévisionnel pour l'exercice 2026",
    fileName: "budget-2026.xlsx", uploadedBy: adminId, createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
  {
    id: id(), title: "Facture fournisseur #F-2025-112", category: "Factures", type: "PDF", size: "98 KB", sizeBytes: 100352,
    status: "archivé", date: "2025-02-28", tags: ["fournisseur", "achat"], description: "Facture du fournisseur principal pour le matériel informatique",
    fileName: "facture-f-2025-112.pdf", uploadedBy: adminId, createdAt: daysAgo(25), updatedAt: daysAgo(25),
  },
  {
    id: id(), title: "Procès-verbal AG 2025", category: "Juridique", type: "PDF", size: "450 KB", sizeBytes: 460800,
    status: "archivé", date: "2025-01-20", tags: ["AG", "procès-verbal"], description: "Procès-verbal de l'assemblée générale annuelle 2025",
    fileName: "pv-ag-2025.pdf", uploadedBy: adminId, createdAt: daysAgo(50), updatedAt: daysAgo(50),
  },
  {
    id: id(), title: "Plan de formation 2025", category: "Ressources Humaines", type: "PPTX", size: "5.6 MB", sizeBytes: 5872025,
    status: "en traitement", date: "2025-03-05", tags: ["formation", "compétences"], description: "Plan de formation annuel pour tous les collaborateurs",
    fileName: "plan-formation-2025.pptx", uploadedBy: adminId, createdAt: daysAgo(12), updatedAt: daysAgo(2),
  },
  {
    id: id(), title: "Rapport mensuel - Février 2025", category: "Rapports", type: "PDF", size: "1.2 MB", sizeBytes: 1258291,
    status: "archivé", date: "2025-03-01", tags: ["mensuel", "février"], description: "Rapport d'activité mensuel de février 2025",
    fileName: "rapport-mensuel-fev-2025.pdf", uploadedBy: adminId, createdAt: daysAgo(18), updatedAt: daysAgo(18),
  },
  {
    id: id(), title: "Contrat bail commercial", category: "Contrats", type: "PDF", size: "2.1 MB", sizeBytes: 2202009,
    status: "archivé", date: "2024-12-01", tags: ["bail", "immobilier"], description: "Contrat de bail des locaux commerciaux",
    fileName: "bail-commercial-2024.pdf", uploadedBy: adminId, createdAt: daysAgo(80), updatedAt: daysAgo(80),
  },
];

const activities = [
  { id: id(), userId: adminId, action: "Document archivé", target: "Rapport annuel 2025", targetType: "document", createdAt: hoursAgo(2) },
  { id: id(), userId: adminId, action: "Document importé", target: "Contrat de prestation N°4521", targetType: "document", createdAt: hoursAgo(5) },
  { id: id(), userId: adminId, action: "Catégorie modifiée", target: "Rapports", targetType: "category", createdAt: daysAgo(1) },
  { id: id(), userId: adminId, action: "Paramètres mis à jour", target: "Notifications", targetType: "settings", createdAt: daysAgo(3) },
  { id: id(), userId: adminId, action: "Document partagé", target: "Audit interne Q4 2025", targetType: "document", createdAt: daysAgo(7) },
  { id: id(), userId: adminId, action: "Document importé", target: "Plan de formation 2025", targetType: "document", createdAt: daysAgo(12) },
  { id: id(), userId: adminId, action: "Document archivé", target: "Facture #2025-0892", targetType: "document", createdAt: daysAgo(15) },
  { id: id(), userId: adminId, action: "Connexion", target: "Session démarrée", targetType: "user", createdAt: hoursAgo(1) },
];

const notifications = [
  { id: id(), userId: adminId, title: "Document archivé", message: "Le document 'Rapport annuel 2025' a été archivé avec succès.", read: false, createdAt: hoursAgo(2) },
  { id: id(), userId: adminId, title: "Stockage", message: "Vous utilisez 20.8 MB sur 50 GB de stockage.", read: false, createdAt: daysAgo(1) },
  { id: id(), userId: adminId, title: "Nouveau document", message: "Un nouveau document a été importé: Contrat de prestation N°4521", read: false, createdAt: hoursAgo(5) },
  { id: id(), userId: adminId, title: "Mise à jour système", message: "La plateforme a été mise à jour vers la version 2.1.0", read: true, createdAt: daysAgo(3) },
  { id: id(), userId: adminId, title: "Rappel", message: "3 documents sont en attente de traitement.", read: true, createdAt: daysAgo(5) },
];

export function seedDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Only seed if users.json doesn't exist or is empty
  const usersPath = path.join(DATA_DIR, "users.json");
  if (fs.existsSync(usersPath)) {
    const existing = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    if (existing.length > 0) return false;
  }

  fs.writeFileSync(path.join(DATA_DIR, "users.json"), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, "documents.json"), JSON.stringify(documents, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, "categories.json"), JSON.stringify(categories, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, "activities.json"), JSON.stringify(activities, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, "notifications.json"), JSON.stringify(notifications, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, "sessions.json"), JSON.stringify([]));

  return true;
}
