import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Noto_Sans_SC } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { BottomNav, DesktopNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";
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
    title: {
      default: t("title"),
      template: `%s | Jompancing`,
    },
    description: t("description"),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: "/",
      languages: {
        ms: "/ms",
        en: "/en",
        zh: "/zh",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Jompancing",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
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

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${plusJakarta.variable} ${notoSansSC.variable} h-full`}
    >
      <body className="min-h-full bg-slate-50 pb-20 antialiased md:pb-0 dark:bg-slate-950">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SiteHeader />
            <DesktopNav />
            <main className="min-h-[calc(100vh-8rem)]">{children}</main>
            <SiteFooter />
            <BottomNav />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
