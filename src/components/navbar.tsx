"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

const navigation = [
  { name: "Vue d'ensemble", href: "/" },
  { name: "Documents", href: "/documents" },
  { name: "Catégories", href: "/categories" },
  { name: "Importer", href: "/upload" },
  { name: "Paramètres", href: "/settings" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-foreground" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-foreground">
              Archivist
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Admin</span>
          <Link
            href="/upload"
            className="rounded bg-foreground px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-80 transition-opacity"
          >
            Ouvrir la console
          </Link>
        </div>
      </div>
    </nav>
  );
}
