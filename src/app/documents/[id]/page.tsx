import { documents } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PlatformLayout } from "@/components/platform-layout";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Folder,
  Tag,
  User,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const doc = documents.find((d) => d.id === id);

  if (!doc) {
    notFound();
  }

  const statusStyles = {
    archivé: "bg-accent text-foreground border-border",
    "en cours": "bg-accent text-foreground border-border",
    "en attente": "bg-background text-muted-foreground border-border",
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
          <p className="text-sm text-muted-foreground">{doc.id}</p>
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
                <button className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                  Partager
                </button>
                <button className="flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-destructive hover:bg-accent transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
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
                <User
                  className="mt-0.5 h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-xs text-muted-foreground">Auteur</p>
                  <p className="text-sm font-medium text-foreground">
                    {doc.author}
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
            </div>
          </div>

          <div className="rounded border border-border bg-background p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Statut
            </h2>
            <span
              className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-medium border ${statusStyles[doc.status]}`}
            >
              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
            </span>
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
