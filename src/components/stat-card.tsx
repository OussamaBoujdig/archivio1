import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded border border-border bg-background p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded bg-accent">
          <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
