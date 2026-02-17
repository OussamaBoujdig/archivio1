"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { DocumentTable } from "@/components/document-table";
import type { TableDocument } from "@/components/document-table";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { PlatformLayout } from "@/components/platform-layout";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

const statusFilters = ["Tous", "archivé", "en traitement", "brouillon"];
const categoryFilters = [
  "Toutes",
  "Rapports",
  "Contrats",
  "Factures",
  "Juridique",
  "Ressources Humaines",
];

export default function DocumentsPage() {
  return (
    <Suspense fallback={<PlatformLayout><div className="flex items-center justify-center h-64"><p className="text-sm text-muted-foreground">Chargement...</p></div></PlatformLayout>}>
      <DocumentsPageInner />
    </Suspense>
  );
}

function DocumentsPageInner() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [documents, setDocuments] = useState<TableDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (statusFilter !== "Tous") params.set("status", statusFilter);
    if (categoryFilter !== "Toutes") params.set("category", categoryFilter);

    try {
      const res = await fetch(`/api/documents?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce document ?")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <PlatformLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez et consultez tous vos documents archivés
          </p>
        </div>
        <Link
          href="/upload"
          className="flex shrink-0 items-center gap-2 rounded bg-foreground px-3 md:px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Nouveau document</span>
        </Link>
      </div>

      <div className="rounded border border-border bg-background p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Rechercher par titre ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <SlidersHorizontal
              className="h-4 w-4 text-muted-foreground"
              strokeWidth={1.5}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>
                  {s === "Tous" ? "Tous" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
            >
              {categoryFilters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Chargement..." : `${documents.length} document${documents.length !== 1 ? "s" : ""} trouvé${documents.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <DocumentTable documents={documents} onDelete={isAdmin ? handleDelete : undefined} />
    </div>
    </PlatformLayout>
  );
}
