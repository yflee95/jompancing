import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { FishSpecies } from "@/data/fish-catalog";

interface FishDetailProps {
  fish: FishSpecies;
  locale: Locale;
  labels: {
    wildDiet: string;
    baitTips: string;
    lureTips: string;
    starterRig: string;
    habitat: string;
    method: string;
    source: string;
    photo: string;
    noteTitle: string;
    note: string;
    browseSpots: string;
    back: string;
    styles: Record<string, string>;
    habitats: Record<string, string>;
  };
}

export function FishDetail({ fish, locale, labels }: FishDetailProps) {
  const name = fish.name[locale];
  const habitatLabels = fish.habitats.map((habitat) => labels.habitats[habitat]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <Link href="/fish" className="text-sm font-semibold text-[var(--ocean)] hover:underline">
        ← {labels.back}
      </Link>
      <article className="mt-4 overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/40">
        <div className="grid md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative aspect-[4/3] bg-[var(--ocean-light)] md:aspect-auto md:min-h-[25rem]">
            <Image src={fish.photo.src} alt={name} fill priority unoptimized sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
          </div>
          <div className="p-5 md:p-8">
            <div className="flex flex-wrap gap-2">
              {habitatLabels.map((label) => <span key={label} className="rounded-full bg-[var(--ocean-light)] px-3 py-1 text-xs font-semibold text-[var(--ocean)]">{label}</span>)}
              <span className="rounded-full bg-[var(--sand)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)]">{labels.styles[fish.style]}</span>
            </div>
            <h1 className="mt-4 font-serif-display text-3xl font-bold leading-tight text-[var(--ink)] md:text-4xl">{name}</h1>
            <p className="mt-2 text-sm italic text-[var(--ink-muted)]">{fish.latinName}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">{fish.overview[locale]}</p>
            <p className="mt-5 rounded-2xl bg-[var(--sand)] p-4 text-sm leading-6 text-[var(--ink-muted)]">{fish.taxonNote[locale]}</p>
          </div>
        </div>
        <div className="grid gap-4 border-t border-[var(--sand-dark)]/30 p-5 sm:grid-cols-2 md:p-8">
          <InfoCard title={labels.wildDiet} text={fish.wildDiet[locale]} />
          <InfoCard title={labels.baitTips} text={fish.baitTips[locale]} />
          <InfoCard title={labels.lureTips} text={fish.lureTips[locale]} />
          <InfoCard title={labels.starterRig} text={fish.starterRig[locale]} />
        </div>
        <div className="border-t border-[var(--sand-dark)]/30 bg-[var(--sand)]/60 p-5 md:p-8">
          <h2 className="font-semibold text-[var(--ink)]">{labels.noteTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{labels.note}</p>
          <p className="mt-4 text-xs text-[var(--ink-muted)]">{labels.photo}: {fish.photo.credit} · {fish.photo.license} · <a href={fish.photo.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold underline">Wikimedia Commons</a></p>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">{labels.source}: <a href={fish.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold underline">FishBase</a></p>
          <Link href={`/search?q=${encodeURIComponent(fish.slug)}`} className="mt-5 inline-flex rounded-full bg-[var(--ocean)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">{labels.browseSpots}</Link>
        </div>
      </article>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return <section className="rounded-2xl border border-[var(--sand-dark)]/40 p-4"><h2 className="font-semibold text-[var(--ink)]">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{text}</p></section>;
}
