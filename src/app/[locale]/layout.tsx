import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Noto_Sans_SC, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { RouteProgress } from "@/components/layout/route-progress";
import { SiteHeader } from "@/components/layout/site-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ConditionalDesktopNav } from "@/components/layout/conditional-desktop-nav";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ForumProvider } from "@/components/providers/forum-provider";
import { ActivitiesProvider } from "@/components/providers/activities-provider";
import { MarketplaceProvider } from "@/components/providers/marketplace-provider";
import { SpotsProvider } from "@/components/providers/spots-provider";
import { routing } from "@/i18n/routing";
import { WebsiteJsonLd } from "@/components/seo/website-json-ld";
import { buildRootMetadata } from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sc",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    ...buildRootMetadata(locale as "ms" | "en" | "zh", t("title"), t("description")),
    title: {
      default: t("title"),
      template: `%s | Jompancing`,
    },
    manifest: "/manifest.json",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "metadata" });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${plusJakarta.variable} ${notoSansSC.variable} ${playfair.variable} h-full ${locale === "zh" ? "locale-zh" : ""}`}
    >
      <body className="min-h-full bg-[var(--sand)] pb-20 antialiased md:pb-0">
        <WebsiteJsonLd locale={locale as "ms" | "en" | "zh"} description={t("description")} />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ForumProvider>
            <SpotsProvider>
            <ActivitiesProvider>
            <MarketplaceProvider>
              <Suspense fallback={null}>
                <RouteProgress />
              </Suspense>
              <Suspense fallback={<div className="sticky top-0 z-50 h-14 border-b border-[var(--sand-dark)]/50 bg-[var(--sand)]/95" />}>
                <SiteHeader />
              </Suspense>
              <ConditionalDesktopNav />
              <main className="min-h-[calc(100vh-8rem)]">{children}</main>
              <ConditionalFooter />
              <BottomNav />
            </MarketplaceProvider>
            </ActivitiesProvider>
            </SpotsProvider>
            </ForumProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
