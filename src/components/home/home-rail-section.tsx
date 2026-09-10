import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

interface HomeRailSectionProps {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  children: ReactNode;
}

export function HomeRailSection({
  title,
  href,
  linkLabel,
  className,
  children,
}: HomeRailSectionProps) {
  return (
    <section className={cn("animate-fade-up py-5", className)}>
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader title={title} href={href} linkLabel={linkLabel} />
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto scroll-pl-4 scroll-pr-4 px-4 pb-1 scrollbar-none snap-x snap-mandatory">
        {children}
      </div>
    </section>
  );
}
