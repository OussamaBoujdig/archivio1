"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  FileSignature,
  Receipt,
  Scale,
  Users,
  Plus,
  FolderOpen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { PlatformLayout } from "@/components/platform-layout";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  FileSignature,
  Receipt,
  Scale,
  Users,
};

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  archivedCount: number;
  processingCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories || []);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    if (res.ok) {
      setNewName("");
      setNewDesc("");
      setShowForm(false);
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchCategories();
  };

  return (
    <PlatformLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">Catégories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organisez vos documents par catégorie
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex shrink-0 items-center gap-2 rounded bg-foreground px-3 md:px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Nouvelle catégorie</span>
        </button>
      </div>

      {showForm && (
        <div className="rounded border border-border bg-background p-5 space-y-4">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Nouvelle catégorie
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-8 flex-1 rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground"
            />
            <input
              type="text"
              placeholder="Description (optionnel)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="h-8 flex-1 rounded border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground"
            />
            <button
              onClick={handleCreate}
              className="h-8 rounded bg-foreground px-4 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity"
            >
              Créer
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || FolderOpen;

          return (
            <div
              key={cat.id}
              className="rounded border border-border bg-background p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-accent">
                  <Icon
                    className="h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {cat.count} document{cat.count !== 1 ? "s" : ""}
              </p>

              <div className="mt-4 border-t border-border pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {cat.archivedCount} archivé{cat.archivedCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-muted-foreground">
                    {cat.processingCount} en traitement
                  </span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-accent">
                  <div
                    className="h-1 rounded-full bg-foreground/40"
                    style={{
                      width: `${cat.count > 0 ? (cat.archivedCount / cat.count) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/documents?category=${encodeURIComponent(cat.name)}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Voir les documents →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </PlatformLayout>
  );
}
