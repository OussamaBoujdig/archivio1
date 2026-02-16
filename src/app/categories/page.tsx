"use client";

import { categories, documents } from "@/lib/data";
import {
  FileText,
  FileSignature,
  Receipt,
  Scale,
  Users,
  Plus,
  FolderOpen,
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

export default function CategoriesPage() {
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
        <button className="flex shrink-0 items-center gap-2 rounded bg-foreground px-3 md:px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Nouvelle catégorie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || FolderOpen;
          const catDocs = documents.filter((d) => d.category === cat.name);
          const archivedCount = catDocs.filter(
            (d) => d.status === "archivé"
          ).length;

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
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Modifier
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
                    {archivedCount} archivé{archivedCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-muted-foreground">
                    {cat.count - archivedCount} en traitement
                  </span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-accent">
                  <div
                    className="h-1 rounded-full bg-foreground/40"
                    style={{
                      width: `${cat.count > 0 ? (archivedCount / cat.count) * 100 : 0}%`,
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
