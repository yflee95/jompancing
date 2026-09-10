"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import { PostSpotForm } from "@/components/spots/post-spot-form";
import { LoginGate } from "@/components/shared/login-gate";

export default function PostPage() {
  const tCommon = useTranslations("common");
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
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
    <div className="mx-auto max-w-xl px-4 py-6 pb-28">
      <PostSpotForm />
    </div>
  );
}
