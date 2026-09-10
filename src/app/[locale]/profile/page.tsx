"use client";

import { Fish, LogOut, MapPin, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { LoginGate } from "@/components/shared/login-gate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStateById } from "@/data/malaysia-states";
import { useLocale } from "next-intl";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

export default function ProfilePage() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { user, logout, isLoading } = useAuth();
  const locale = useLocale() as Locale;

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
        <LoginGate />
      </div>
    );
  }

  const homeState = user.homeStateId
    ? getStateById(user.homeStateId)
    : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-teal-100">{user.email}</p>
              {homeState && (
                <p className="mt-1 flex items-center gap-1 text-sm text-teal-200">
                  <MapPin className="h-3.5 w-3.5" />
                  {getLocalizedText(homeState.name, locale)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-2 p-4">
          <Link
            href="/spots"
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Fish className="h-5 w-5 text-teal-600" />
            <span className="font-medium">{t("spots")}</span>
          </Link>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Settings className="h-5 w-5 text-slate-500" />
            <span className="font-medium">Settings</span>
          </button>
          <Button
            variant="ghost"
            className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {tCommon("logout")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
