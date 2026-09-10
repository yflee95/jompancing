import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  href,
  linkLabel,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="font-serif-display text-xl font-bold text-[var(--ink)]">
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-sm font-semibold text-[var(--ocean)] transition hover:text-[var(--ocean-dark)]"
        >
          {linkLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
