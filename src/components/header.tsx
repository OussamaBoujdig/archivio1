"use client";

import { Search, Bell, User, Sun, Moon, Menu, LogOut } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/documents?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors lg:hidden"
          >
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="h-8 w-48 md:w-64 lg:w-80 rounded border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground"
          />
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors sm:hidden">
          <Search className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title={theme === "light" ? "Mode sombre" : "Mode clair"}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Sun className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>

        <button className="relative flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <Link href="/profile" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-foreground">
            <User className="h-3.5 w-3.5" strokeWidth={1.5} />
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-foreground leading-none">{user?.name || "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
          </div>
        </Link>

        <button
          onClick={logout}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Déconnexion"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
