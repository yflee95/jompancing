import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

interface HomeSpotSectionProps {
  title?: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  titleClassName?: string;
  linkClassName?: string;
  subtitleClassName?: string;
  /** Mobile horizontal scroll — ~2.1 cards on phone, grid on desktop */
  mobilePeek?: boolean;
  children: ReactNode;
}

export function HomeSpotSection({
  title,
  subtitle,
  href,
  linkLabel,
  className,
  titleClassName,
  linkClassName,
  subtitleClassName,
  mobilePeek = false,
  children,
}: HomeSpotSectionProps) {
  return (
    <section className={cn("animate-fade-up py-6 md:py-8", className)}>
      {(title || subtitle) && (
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {title && (
            <SectionHeader
              title={title}
              href={href}
              linkLabel={linkLabel}
              titleClassName={titleClassName}
              linkClassName={linkClassName}
            />
          )}
          {subtitle && (
            <p
              className={cn(
                "max-w-2xl text-sm text-[var(--ink-muted)]",
                title && "mt-1",
                subtitleClassName,
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div
        className={cn(
          "mx-auto flex max-w-7xl gap-3 md:gap-3",
          title || subtitle ? "mt-4" : "mt-0",
          "overflow-x-auto overscroll-x-contain scroll-pl-4 scroll-pr-4 pb-2 pl-4 pr-4 scrollbar-none",
          "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
          mobilePeek && "md:overflow-x-auto md:snap-x lg:overflow-visible lg:snap-none",
          !mobilePeek &&
            "md:grid md:grid-cols-3 md:overflow-visible md:snap-none lg:grid-cols-4",
          mobilePeek &&
            "md:px-6 md:pl-6 md:pr-6 md:pb-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:snap-none",
        )}
      >
        {children}
      </div>
    </section>
  );
}
