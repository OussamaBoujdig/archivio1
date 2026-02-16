export interface Document {
  id: string;
  title: string;
  category: string;
  type: string;
  size: string;
  date: string;
  author: string;
  status: "archivé" | "en cours" | "en attente";
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export const documents: Document[] = [
  {
    id: "DOC-001",
    title: "Rapport annuel 2025",
    category: "Rapports",
    type: "PDF",
    size: "2.4 MB",
    date: "2025-12-15",
    author: "Marie Dupont",
    status: "archivé",
    tags: ["finance", "annuel"],
  },
  {
    id: "DOC-002",
    title: "Contrat de prestation N°4521",
    category: "Contrats",
    type: "PDF",
    size: "1.1 MB",
    date: "2025-11-20",
    author: "Jean Martin",
    status: "archivé",
    tags: ["juridique", "prestation"],
  },
  {
    id: "DOC-003",
    title: "Facture fournisseur — Décembre",
    category: "Factures",
    type: "PDF",
    size: "340 KB",
    date: "2025-12-01",
    author: "Sophie Bernard",
    status: "en cours",
    tags: ["comptabilité", "fournisseur"],
  },
  {
    id: "DOC-004",
    title: "Procès-verbal AG 2025",
    category: "Juridique",
    type: "DOCX",
    size: "890 KB",
    date: "2025-10-30",
    author: "Pierre Leroy",
    status: "archivé",
    tags: ["juridique", "assemblée"],
  },
  {
    id: "DOC-005",
    title: "Plan stratégique 2026-2028",
    category: "Rapports",
    type: "PPTX",
    size: "5.6 MB",
    date: "2026-01-10",
    author: "Marie Dupont",
    status: "en attente",
    tags: ["stratégie", "direction"],
  },
  {
    id: "DOC-006",
    title: "Bulletin de paie — Janvier 2026",
    category: "Ressources Humaines",
    type: "PDF",
    size: "210 KB",
    date: "2026-01-31",
    author: "Claire Moreau",
    status: "archivé",
    tags: ["RH", "paie"],
  },
  {
    id: "DOC-007",
    title: "Audit interne Q4 2025",
    category: "Rapports",
    type: "PDF",
    size: "3.2 MB",
    date: "2026-01-15",
    author: "Thomas Petit",
    status: "archivé",
    tags: ["audit", "qualité"],
  },
  {
    id: "DOC-008",
    title: "Contrat de bail commercial",
    category: "Contrats",
    type: "PDF",
    size: "1.8 MB",
    date: "2025-09-01",
    author: "Jean Martin",
    status: "archivé",
    tags: ["juridique", "immobilier"],
  },
  {
    id: "DOC-009",
    title: "Note de service — Télétravail",
    category: "Ressources Humaines",
    type: "DOCX",
    size: "120 KB",
    date: "2026-02-01",
    author: "Claire Moreau",
    status: "en cours",
    tags: ["RH", "politique"],
  },
  {
    id: "DOC-010",
    title: "Devis rénovation bureaux",
    category: "Factures",
    type: "PDF",
    size: "560 KB",
    date: "2026-02-10",
    author: "Sophie Bernard",
    status: "en attente",
    tags: ["devis", "immobilier"],
  },
  {
    id: "DOC-011",
    title: "Certificat ISO 9001",
    category: "Juridique",
    type: "PDF",
    size: "450 KB",
    date: "2025-06-15",
    author: "Thomas Petit",
    status: "archivé",
    tags: ["certification", "qualité"],
  },
  {
    id: "DOC-012",
    title: "Rapport de mission — Projet Alpha",
    category: "Rapports",
    type: "PDF",
    size: "4.1 MB",
    date: "2026-02-05",
    author: "Pierre Leroy",
    status: "en cours",
    tags: ["projet", "mission"],
  },
];

export const categories: Category[] = [
  { id: "cat-1", name: "Rapports", count: 4, icon: "FileText" },
  { id: "cat-2", name: "Contrats", count: 2, icon: "FileSignature" },
  { id: "cat-3", name: "Factures", count: 2, icon: "Receipt" },
  { id: "cat-4", name: "Juridique", count: 2, icon: "Scale" },
  { id: "cat-5", name: "Ressources Humaines", count: 2, icon: "Users" },
];

export const stats = {
  totalDocuments: 12,
  archived: 7,
  inProgress: 3,
  pending: 2,
  storageUsed: "20.8 MB",
  storageTotal: "50 GB",
};
