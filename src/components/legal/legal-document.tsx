interface LegalSection {
  title: string;
  body: string;
}

interface LegalDocumentProps {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export function LegalDocument({ title, updated, sections }: LegalDocumentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 pb-24">
      <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">{updated}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              {section.title}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--ink-muted)]">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
