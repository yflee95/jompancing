"use client";

import { Fish, MapPin, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HomeEmptyWelcome() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <section className="mx-auto max-w-lg px-4 py-10 text-center md:py-14">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--ocean-light)]">
        <Fish className="h-8 w-8 text-[var(--ocean)]" />
      </div>
      <h1 className="font-serif-display mt-5 text-2xl font-bold text-[var(--ink)]">
        {t("emptyTitle")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
        {t("emptyDesc")}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/post">
            <PlusCircle className="h-4 w-4" />
            {t("shareSpotBannerCta")}
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/spots">
            <MapPin className="h-4 w-4" />
            {tNav("spots")}
          </Link>
        </Button>
      </div>
    </section>
  );
}
