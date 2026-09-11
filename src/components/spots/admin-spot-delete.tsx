"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface AdminSpotDeleteProps {
  spotId: string;
}

export function AdminSpotDelete({ spotId }: AdminSpotDeleteProps) {
  const t = useTranslations("spots");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
        {t("devToolsLabel")}
      </p>
      <p className="mt-1 text-sm font-medium text-amber-950">
        {t("devDeleteSpotTitle")}
      </p>
      <p className="mt-1 text-xs text-amber-900/80">{t("devDeleteSpotDesc")}</p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <Button
        type="button"
        variant="outline"
        disabled={deleting}
        className="mt-3 border-amber-300 text-amber-950 hover:bg-amber-100"
        onClick={() => {
          if (!window.confirm(t("devDeleteSpotConfirm"))) return;
          setDeleting(true);
          setError(null);
          void fetch(`/api/admin/spots/${spotId}`, { method: "DELETE" })
            .then(async (res) => {
              if (!res.ok) {
                const body = (await res.json().catch(() => null)) as {
                  error?: string;
                } | null;
                throw new Error(body?.error ?? t("devDeleteSpotFailed"));
              }
              router.push("/spots");
              router.refresh();
            })
            .catch((err: unknown) => {
              setError(
                err instanceof Error ? err.message : t("devDeleteSpotFailed"),
              );
            })
            .finally(() => setDeleting(false));
        }}
      >
        <Trash2 className="h-4 w-4" />
        {deleting ? t("devDeleteSpotProgress") : t("devDeleteSpot")}
      </Button>
    </div>
  );
}
