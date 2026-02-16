import {
  Archive,
  Clock,
  FileText,
  HardDrive,
  Hourglass,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { DocumentTable } from "@/components/document-table";
import { documents, stats } from "@/lib/data";
import { PlatformLayout } from "@/components/platform-layout";
import Link from "next/link";

export default function DashboardPage() {
  const recentDocuments = documents.slice(0, 5);

  return (
    <PlatformLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vue d&apos;ensemble de votre espace d&apos;archivage
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total documents"
            value={stats.totalDocuments}
            subtitle="+3 ce mois"
            icon={FileText}
          />
          <StatCard
            title="Archivés"
            value={stats.archived}
            icon={Archive}
          />
          <StatCard
            title="En cours"
            value={stats.inProgress}
            icon={Clock}
          />
          <StatCard
            title="En attente"
            value={stats.pending}
            icon={Hourglass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded border border-border bg-background p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Activité récente
              </h2>
              <span className="text-xs text-muted-foreground">
                Derniers 30 jours
              </span>
            </div>
            <div className="space-y-4">
              {[
                { month: "Oct", value: 15 },
                { month: "Nov", value: 22 },
                { month: "Déc", value: 18 },
                { month: "Jan", value: 30 },
                { month: "Fév", value: 12 },
              ].map((item) => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="w-8 text-xs text-muted-foreground">
                    {item.month}
                  </span>
                  <div className="flex-1 h-5 bg-accent rounded">
                    <div
                      className="h-5 bg-foreground/10 rounded flex items-center px-2"
                      style={{ width: `${(item.value / 30) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-border bg-background p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Résumé
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive
                    className="h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm text-muted-foreground">Stockage</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {stats.storageUsed}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-accent">
                <div
                  className="h-1 rounded-full bg-foreground"
                  style={{ width: "0.04%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.storageUsed} utilisés sur {stats.storageTotal}
              </p>

              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp
                    className="h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm text-muted-foreground">
                    Par catégorie
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Rapports", count: 4 },
                    { name: "Contrats", count: 2 },
                    { name: "Factures", count: 2 },
                    { name: "Juridique", count: 2 },
                    { name: "RH", count: 2 },
                  ].map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                        <span className="text-xs text-muted-foreground">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Documents récents
            </h2>
            <Link
              href="/documents"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Voir tout →
            </Link>
          </div>
          <DocumentTable documents={recentDocuments} />
        </div>
      </div>
    </PlatformLayout>
  );
}
