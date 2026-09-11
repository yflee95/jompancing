"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { EditSpotForm } from "@/components/spots/edit-spot-form";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserSpots } from "@/components/providers/spots-provider";
import { LoginGate } from "@/components/shared/login-gate";
import type { Locale } from "@/i18n/routing";

export default function EditSpotPage() {
  const t = useTranslations("spots");
  const tCommon = useTranslations("common");
  const params = useParams<{ locale: Locale; slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const { user, isRegisteredUser, isLoading: authLoading } = useAuth();
  const { getUserSpotBySlug, isLoaded } = useUserSpots();
  const spot = getUserSpotBySlug(slug);

  if (authLoading || !isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
      </div>
    );
  }

  if (!isRegisteredUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <LoginGate message={tCommon("loginToContinue")} />
      </div>
    );
  }

  if (!spot || !spot.isUserGenerated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--ink-muted)]">{t("notFound")}</p>
      </div>
    );
  }

  if (user?.id !== spot.authorId) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--ink-muted)]">{t("editSpotForbidden")}</p>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-[var(--ocean)]"
          onClick={() => router.push(`/spots/${slug}`)}
        >
          ← {t("backToSpot")}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <EditSpotForm spot={spot} />
    </div>
  );
}
