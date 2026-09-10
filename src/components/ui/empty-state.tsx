import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: "/post" | "/spots" | "/login" | "/forum/new";
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div className={`mx-auto mt-12 max-w-sm rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/40 ${className ?? ""}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ocean-light)]">
        <MapPin className="h-6 w-6 text-[var(--ocean)]" />
      </div>
      <p className="font-serif-display mt-4 text-lg font-semibold text-[var(--ink)]">
        {title}
      </p>
      {description && (
        <p className="mt-2 text-sm text-[var(--ink-muted)]">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Button asChild className="mt-6" size="lg">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
