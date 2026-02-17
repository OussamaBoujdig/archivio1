"use client";

import { FileText, Eye, Download, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface TableDocument {
  id: string;
  title: string;
  category: string;
  type: string;
  size: string;
  status: string;
  date: string;
  tags?: string[];
}

interface DocumentTableProps {
  documents: TableDocument[];
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "archivé": "bg-accent text-foreground border-border",
    "en traitement": "bg-accent text-foreground border-border",
    "brouillon": "bg-background text-muted-foreground border-border",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
      {type}
    </span>
  );
}

export function DocumentTable({
  documents,
  showActions = true,
  onDelete,
}: DocumentTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded border border-border bg-background">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Document
            </th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Catégorie
            </th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Type
            </th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Taille
            </th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Date
            </th>
            <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Statut
            </th>
            {showActions && (
              <th className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="border-b border-border last:border-b-0 hover:bg-accent transition-colors"
            >
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-accent">
                    <FileText
                      className="h-4 w-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <Link
                      href={`/documents/${doc.id}`}
                      className="font-medium text-foreground hover:underline transition-colors"
                    >
                      {doc.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{doc.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {doc.category}
              </td>
              <td className="px-4 py-2.5">
                <TypeBadge type={doc.type} />
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">{doc.size}</td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {new Date(doc.date).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-2.5">
                <StatusBadge status={doc.status} />
              </td>
              {showActions && (
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1 relative">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Voir"
                    >
                      <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                    <button
                      onClick={() => alert(`Téléchargement de "${doc.title}" — fichier démo non disponible`)}
                      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Télécharger"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Plus"
                      onClick={() =>
                        setOpenMenu(openMenu === doc.id ? null : doc.id)
                      }
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    {openMenu === doc.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded border border-border bg-background py-1">
                        <Link href={`/documents/${doc.id}`} className="flex w-full items-center px-3 py-1.5 text-sm text-foreground hover:bg-accent transition-colors">
                          Voir le détail
                        </Link>
                        {onDelete && (
                          <button
                            onClick={() => { onDelete(doc.id); setOpenMenu(null); }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-accent transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Supprimer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
