"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PlatformLayout } from "@/components/platform-layout";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Folder,
  Tag,
  Trash2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface DocDetail {
  id: string;
  title: string;
  category: string;
  type: string;
  size: string;
  status: string;
  date: string;
  tags: string[];
  description: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doc, setDoc] = useState<DocDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    fetch(`/api/documents/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setDoc(d.document))
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Supprimer ce document définitivement ?")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/documents");
  };

  const handleStatusChange = async (newStatus: string) => {
    const res = await fetch(`/api/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setDoc(data.document);
    }
  };

  if (loading) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </PlatformLayout>
    );
  }

  if (!doc) {
    return (
      <PlatformLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-sm text-muted-foreground">Document introuvable</p>
          <Link href="/documents" className="text-sm text-foreground hover:underline">
            ← Retour aux documents
          </Link>
        </div>
      </PlatformLayout>
    );
  }

  const statusStyles: Record<string, string> = {
    "archivé": "bg-accent text-foreground border-border",
    "en traitement": "bg-accent text-foreground border-border",
    "brouillon": "bg-background text-muted-foreground border-border",
  };

  return (
    <PlatformLayout>
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/documents"
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{doc.title}</h1>
          <p className="text-sm text-muted-foreground">{doc.fileName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded border border-border bg-background">
            <div className="flex h-64 items-center justify-center border-b border-border bg-accent">
              <div className="text-center">
                <FileText
                  className="mx-auto h-16 w-16 text-muted-foreground/50"
                  strokeWidth={1}
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Aperçu du document
                </p>
                <p className="text-xs text-muted-foreground">
                  {doc.type} — {doc.size}
                </p>
              </div>
            </div>
            <div className="p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <button className="flex items-center gap-2 rounded bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
                  <Download className="h-4 w-4" strokeWidth={1.5} />
                  Télécharger
                </button>
                {doc.status !== "archivé" && (
                  <button
                    onClick={() => handleStatusChange("archivé")}
                    className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
                    Archiver
                  </button>
                )}
                <button
                  onClick={async () => {
                    setSummarizing(true);
                    try {
                      const res = await fetch("/api/ai/summarize", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ documentId: doc.id }),
                      });
                      const data = await res.json();
                      setSummary(data.summary || data.error || "Erreur");
                    } catch { setSummary("Erreur de connexion"); }
                    setSummarizing(false);
                  }}
                  disabled={summarizing}
                  className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                  {summarizing ? "Analyse..." : "Résumer avec l'IA"}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-destructive hover:bg-accent transition-colors"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          {summary && (
            <div className="rounded border border-foreground/20 bg-accent p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                <h2 className="text-[11px] font-medium uppercase tracking-wider text-foreground">Résumé IA</h2>
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summary}</div>
            </div>
          )}

          {doc.description && (
            <div className="rounded border border-border bg-background p-5">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Description
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{doc.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded border border-border bg-background p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Informations
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Folder
                  className="mt-0.5 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-xs text-muted-foreground">Catégorie</p>
                  <p className="text-sm font-medium text-foreground">
                    {doc.category}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar
                  className="mt-0.5 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Date d&apos;ajout
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(doc.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText
                  className="mt-0.5 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-xs text-muted-foreground">Format</p>
                  <p className="text-sm font-medium text-foreground">
                    {doc.type} — {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar
                  className="mt-0.5 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-xs text-muted-foreground">Dernière modification</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(doc.updatedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-border bg-background p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Statut
            </h2>
            <select
              value={doc.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-8 rounded border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
            >
              <option value="brouillon">Brouillon</option>
              <option value="en traitement">En traitement</option>
              <option value="archivé">Archivé</option>
            </select>
          </div>

          <div className="rounded border border-border bg-background p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded border border-border bg-accent px-2 py-1 text-xs text-muted-foreground"
                >
                  <Tag className="h-3 w-3" strokeWidth={1.5} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </PlatformLayout>
  );
}
