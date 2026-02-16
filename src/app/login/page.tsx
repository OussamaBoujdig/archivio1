"use client";

import { useState } from "react";
import { FileText, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-foreground" strokeWidth={1.5} />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Archivist
            </span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Connexion</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connectez-vous à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@entreprise.fr"
                required
                className="h-10 w-full rounded border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10 w-full rounded border border-border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-foreground px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {loading ? "Connexion..." : "Se connecter"}
            {!loading && <ArrowRight className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-foreground hover:underline font-medium">
              S&apos;inscrire
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded border border-border p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Compte démo
          </p>
          <p className="text-xs text-muted-foreground">
            Email: <span className="text-foreground font-medium">admin@entreprise.fr</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Mot de passe: <span className="text-foreground font-medium">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
