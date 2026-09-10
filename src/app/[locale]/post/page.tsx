"use client";

import { Camera, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import { LoginGate } from "@/components/shared/login-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostPage() {
  const t = useTranslations("nav");
  const tSpots = useTranslations("spots");
  const tCommon = useTranslations("common");
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">{tCommon("loading")}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <LoginGate message={tCommon("loginToContinue")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("post")} — {tSpots("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            type="button"
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 text-teal-700 transition hover:bg-teal-50 dark:border-teal-700 dark:bg-teal-950/20 dark:text-teal-300"
          >
            <Camera className="h-8 w-8" />
            <span className="text-sm font-medium">Upload photos</span>
          </button>

          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="e.g. Danga Bay Jetty"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Share tips about this spot..."
            />
          </div>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium dark:border-slate-700 dark:bg-slate-800"
          >
            <MapPin className="h-4 w-4 text-teal-600" />
            Pin location on map (GPS)
          </button>

          <Button className="w-full">{tCommon("submit")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
