import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label?: string;
  className?: string;
  compact?: boolean;
}

export function PageLoader({ label, className, compact = false }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        compact ? "py-10" : "py-16",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-loader" aria-hidden />
      {label ? (
        <p className="text-sm font-medium text-[var(--ink-muted)]">{label}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
