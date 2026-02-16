"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Archive,
  Upload,
  FolderOpen,
  Settings,
  FileText,
  X,
} from "lucide-react";

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: Archive },
  { name: "Catégories", href: "/categories", icon: FolderOpen },
  { name: "Importer", href: "/upload", icon: Upload },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

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

      <div className="border-t border-border px-4 py-4">
        <div className="text-xs text-muted-foreground">
          <p className="text-[11px] font-medium uppercase tracking-wider">Stockage</p>
          <div className="mt-2 h-1 w-full rounded-full bg-muted">
            <div
              className="h-1 rounded-full bg-foreground"
              style={{ width: "0.04%" }}
            />
          </div>
          <p className="mt-1.5">20.8 MB / 50 GB</p>
        </div>
      </div>
    </aside>
  );
}
