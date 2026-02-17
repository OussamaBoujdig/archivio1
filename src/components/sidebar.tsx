"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Archive,
  Upload,
  FolderOpen,
  Settings,
  FileText,
  X,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const allNavigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard, adminOnly: false },
  { name: "Documents", href: "/documents", icon: Archive, adminOnly: false },
  { name: "Catégories", href: "/categories", icon: FolderOpen, adminOnly: true },
  { name: "Importer", href: "/upload", icon: Upload, adminOnly: false },
  { name: "Facturation", href: "/billing", icon: CreditCard, adminOnly: false },
  { name: "Paramètres", href: "/settings", icon: Settings, adminOnly: false },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [storage, setStorage] = useState({ used: "0 B", limit: "500 MB", percent: 0 });
  const [planName, setPlanName] = useState("");

  const navigation = allNavigation.filter((item) => !item.adminOnly || isAdmin);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => { if (r.ok) return r.json(); throw 0; })
      .then((d) => {
        if (d.usage?.storage) {
          setStorage({
            used: d.usage.storage.usedFormatted,
            limit: d.usage.storage.limitFormatted,
            percent: Math.max(d.usage.storage.percent, 0.1),
          });
        }
        if (d.plan?.name) setPlanName(d.plan.name);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-foreground" strokeWidth={1.5} />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Archivist
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors lg:hidden"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-[16px] w-[16px]" strokeWidth={1.5} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-4 py-4 space-y-3">
        {planName && (
          <Link href="/billing" className="flex items-center justify-between rounded bg-accent px-3 py-2 hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Plan</span>
            <span className="text-xs font-semibold text-foreground">{planName}</span>
          </Link>
        )}
        <div className="text-xs text-muted-foreground">
          <p className="text-[11px] font-medium uppercase tracking-wider">Stockage</p>
          <div className="mt-2 h-1 w-full rounded-full bg-muted">
            <div
              className="h-1 rounded-full bg-foreground"
              style={{ width: `${storage.percent}%` }}
            />
          </div>
          <p className="mt-1.5">{storage.used} / {storage.limit}</p>
        </div>
      </div>
    </aside>
  );
}
