"use client";

import { useTranslations } from "next-intl";
import { ProfileExplore } from "@/components/profile/profile-explore";
import { useAuth } from "@/components/providers/auth-provider";
import { LoginGate } from "@/components/shared/login-gate";

export default function ProfilePage() {
  const tCommon = useTranslations("common");
  const { isRegisteredUser, isLoading } = useAuth();

  if (isLoading) {
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

  return <ProfileExplore />;
}
