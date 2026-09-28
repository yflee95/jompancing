import { Flag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, localePath } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

interface ReportContentLinkProps {
  locale: Locale;
  /** Path after locale, e.g. `/spots/foo` */
  path: string;
  contentLabel: string;
}

export async function ReportContentLink({
  locale,
  path,
  contentLabel,
}: ReportContentLinkProps) {
  const t = await getTranslations({ locale, namespace: "trust" });
  const pageUrl = absoluteUrl(localePath(locale, path));
  const subject = encodeURIComponent(t("reportEmailSubject", { label: contentLabel }));
  const body = encodeURIComponent(
    t("reportEmailBody", { url: pageUrl, label: contentLabel }),
  );
  const href = `mailto:hello@jompancing.my?subject=${subject}&body=${body}`;

  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)] underline-offset-2 hover:text-[var(--ocean)] hover:underline"
    >
      <Flag className="h-3.5 w-3.5" />
      {t("reportContent")}
    </a>
  );
}
