import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  titleClassName?: string;
  linkClassName?: string;
}

export function SectionHeader({
  title,
  href,
  linkLabel,
  className,
  titleClassName,
  linkClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2
        className={cn(
          "font-serif-display text-xl font-bold text-[var(--ink)]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className={cn(
            "flex shrink-0 items-center gap-0.5 text-sm font-semibold text-[var(--ocean)] transition hover:text-[var(--ocean-dark)]",
            linkClassName,
          )}
        >
          {linkLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
