"use client";

import { useState, useEffect } from "react";
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
import { PlatformLayout } from "@/components/platform-layout";
import Link from "next/link";

interface DashboardData {
  totalDocuments: number;
  totalCategories: number;
  totalStorageBytes: number;
  totalStorageFormatted: string;
  statusCounts: { "archivé": number; "en traitement": number; brouillon: number };
  categoryCounts: { name: string; count: number }[];
  recentDocuments: Array<{
    id: string; title: string; category: string; type: string;
    size: string; status: string; date: string; tags: string[];
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<Array<{ id: string; action: string; target: string; createdAt: string }>>([]);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData).catch(() => {});
    fetch("/api/activities").then((r) => r.json()).then((d) => setActivities(d.activities || [])).catch(() => {});
  }, []);

  if (!data) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </PlatformLayout>
    );
  }

  const storagePercent = (data.totalStorageBytes / (50 * 1024 * 1024 * 1024)) * 100;

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
            value={data.totalDocuments}
            subtitle={`${data.totalCategories} catégories`}
            icon={FileText}
          />
          <StatCard
            title="Archivés"
            value={data.statusCounts["archivé"]}
            icon={Archive}
          />
          <StatCard
            title="En traitement"
            value={data.statusCounts["en traitement"]}
            icon={Clock}
          />
          <StatCard
            title="Brouillons"
            value={data.statusCounts.brouillon}
            icon={Hourglass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded border border-border bg-background p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Activité récente
              </h2>
            </div>
            <div className="space-y-3">
              {activities.slice(0, 8).map((act) => (
                <div key={act.id} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="text-sm text-foreground">{act.action}</p>
                    <p className="text-xs text-muted-foreground">{act.target}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {formatTimeAgo(act.createdAt)}
                  </span>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune activité récente</p>
              )}
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
                  {data.totalStorageFormatted}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-accent">
                <div
                  className="h-1 rounded-full bg-foreground"
                  style={{ width: `${Math.max(storagePercent, 0.1)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {data.totalStorageFormatted} utilisés sur 50 GB
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
                  {data.categoryCounts.map((cat) => (
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
          <DocumentTable documents={data.recentDocuments} />
        </div>
      </div>
    </PlatformLayout>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)}sem`;
}
