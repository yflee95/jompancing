"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { FishSpecies } from "@/data/fish-catalog";

interface FishSpeciesCardProps {
  fish: FishSpecies;
  variant?: "rail" | "grid";
}

export function FishSpeciesCard({
  fish,
  variant = "grid",
}: FishSpeciesCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("fish");
  const name = fish.name[locale];
  const sizeClass =
    variant === "rail"
      ? "w-[72vw] max-w-[18rem] shrink-0 snap-start"
      : "min-w-0";

  return (
    <article className={`overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/40 ${sizeClass}`}>
      <Link href={`/fish/${fish.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ocean-light)]">
          <Image
            src={fish.photo.src}
            alt={name}
            fill
            sizes={variant === "rail" ? "72vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-10">
            {fish.habitats.slice(0, 2).map((habitat) => (
              <span key={habitat} className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[var(--ink)]">
                {t(`habitats.${habitat}` as "habitats.freshwater")}
              </span>
            ))}
            <span className="rounded-full bg-[var(--ocean)]/90 px-2.5 py-1 text-[10px] font-semibold text-white">
              {t(`styles.${fish.style}` as "styles.both")}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif-display text-lg font-bold leading-tight text-[var(--ink)] group-hover:text-[var(--ocean)]">
            {name}
          </h3>
          <p className="mt-1 text-xs italic text-[var(--ink-muted)]">
            {fish.latinName}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--ink-muted)]">
            {fish.overview[locale]}
          </p>
          <p className="mt-3 text-xs font-semibold text-[var(--ocean)]">
            {t("viewFish")}
          </p>
        </div>
      </Link>
      <p className="border-t border-[var(--sand-dark)]/30 px-4 py-2 text-[10px] text-[var(--ink-muted)]">
        {t("photoBy")} {fish.photo.credit} · {fish.photo.license}{" "}
        <a
          href={fish.photo.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-[var(--ocean)]"
          onClick={(event) => event.stopPropagation()}
        >
          {t("photoSource")}
        </a>
      </p>
    </article>
  );
}
