"use client";

import { useState } from "react";
import { DocumentTable } from "@/components/document-table";
import { documents } from "@/lib/data";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { PlatformLayout } from "@/components/platform-layout";

const statusFilters = ["Tous", "Archivé", "En cours", "En attente"];
const categoryFilters = [
  "Toutes",
  "Rapports",
  "Contrats",
  "Factures",
  "Juridique",
  "Ressources Humaines",
];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");

  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.id.toLowerCase().includes(search.toLowerCase()) ||
      doc.author.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "Tous" ||
      doc.status === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "Toutes" || doc.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

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
              placeholder="Rechercher par titre, ID ou auteur..."
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
                  {s}
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
          {filtered.length} document{filtered.length !== 1 ? "s" : ""} trouvé
          {filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <DocumentTable documents={filtered} />
    </div>
    </PlatformLayout>
  );
}
