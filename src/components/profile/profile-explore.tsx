"use client";

import {
  CalendarDays,
  ChevronRight,
  Fish,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  MessageSquarePlus,
  Settings,
  Sparkles,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useForum } from "@/components/providers/forum-provider";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { useUserSpots } from "@/components/providers/spots-provider";
import { AppImage } from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { malaysiaStates } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function ProfileExplore() {
  const t = useTranslations("nav");
  const tProfile = useTranslations("profile");
  const tCommon = useTranslations("common");
  const { user, logout, updateProfile } = useAuth();
  const { userPosts } = useForum();
  const { listings } = useMarketplace();
  const { getMySpots } = useUserSpots();
  const locale = useLocale() as Locale;

  if (!user) return null;

  const myTopics = userPosts.filter((p) => p.authorName === user.name);
  const mySpots = getMySpots(user.id);
  const myListings = listings.filter(
    (listing) =>
      listing.authorId === user.id ||
      listing.sellerName === user.name,
  );
  const homeState = user.homeStateId
    ? malaysiaStates.find((s) => s.id === user.homeStateId)
    : undefined;

  const quickActions = [
    {
      href: "/post" as const,
      icon: Fish,
      label: tProfile("shareSpot"),
      desc: tProfile("shareSpotDesc"),
      accent: true,
    },
    {
      href: "/forum/new" as const,
      icon: MessageSquarePlus,
      label: tProfile("newTopic"),
      desc: tProfile("newTopicDesc"),
      accent: false,
    },
    {
      href: "/map" as const,
      icon: Map,
      label: t("map"),
      desc: tProfile("exploreMapDesc"),
      accent: false,
    },
    {
      href: "/activities" as const,
      icon: CalendarDays,
      label: t("activities"),
      desc: tProfile("exploreActivitiesDesc"),
      accent: false,
    },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--ocean)] via-[#1a7580] to-[var(--ocean-dark)] shadow-xl shadow-[var(--ocean-glow)]">
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-white/5" />
        <div className="relative px-6 pb-6 pt-8">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
            <Sparkles className="h-3.5 w-3.5" />
            {tProfile("welcomeBack")}
          </p>
          <div className="mt-5 flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-[var(--ocean)] shadow-lg ring-4 ring-white/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 pb-1">
              <h1 className="font-serif-display truncate text-2xl font-bold text-white">
                {user.name}
              </h1>
              <p className="truncate text-sm text-white/75">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { value: mySpots.length, label: tProfile("spotsShared") },
              { value: myTopics.length, label: tProfile("topicsPosted") },
              { value: myListings.length, label: tProfile("listingsPosted") },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/15 px-2 py-3 text-center backdrop-blur-sm"
              >
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-[10px] font-medium leading-tight text-white/75">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl bg-white p-4 shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
        <label
          htmlFor="homeState"
          className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]"
        >
          <MapPin className="h-3.5 w-3.5 text-[var(--ocean)]" />
          {tProfile("homeStateLabel")}
        </label>
        <select
          id="homeState"
          value={user.homeStateId ?? ""}
          onChange={(e) =>
            updateProfile({
              homeStateId: e.target.value || undefined,
            })
          }
          className="h-11 w-full appearance-none rounded-2xl bg-[var(--sand)] px-4 text-sm font-medium text-[var(--ink)] ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/25"
        >
          <option value="">{tProfile("selectHomeState")}</option>
          {malaysiaStates.map((state) => (
            <option key={state.id} value={state.id}>
              {getLocalizedText(state.name, locale)}
            </option>
          ))}
        </select>
        {homeState && (
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            {tProfile("homeStateHint", {
              state: getLocalizedText(homeState.name, locale),
            })}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {quickActions.map(({ href, icon: Icon, label, desc, accent }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group relative overflow-hidden rounded-3xl p-4 shadow-[var(--shadow-travel)] ring-1 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)]",
              accent
                ? "bg-gradient-to-br from-[var(--accent)] to-[#b8553f] text-white ring-[var(--accent)]/20"
                : "bg-white text-[var(--ink)] ring-[var(--sand-dark)]/30",
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                accent ? "text-white" : "text-[var(--ocean)]",
              )}
            />
            <p className="mt-3 text-sm font-bold leading-snug">{label}</p>
            <p
              className={cn(
                "mt-1 text-[11px] leading-snug",
                accent ? "text-white/80" : "text-[var(--ink-muted)]",
              )}
            >
              {desc}
            </p>
            <ChevronRight
              className={cn(
                "absolute right-3 top-3 h-4 w-4 opacity-0 transition group-hover:opacity-100",
                accent ? "text-white/80" : "text-[var(--ocean)]",
              )}
            />
          </Link>
        ))}
      </div>

      {mySpots.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif-display text-lg font-bold text-[var(--ink)]">
              {tProfile("mySpots")}
            </h2>
            <Link href="/spots" className="text-xs font-semibold text-[var(--ocean)]">
              {tCommon("viewAll")}
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {mySpots.map((spot) => (
              <Link
                key={spot.id}
                href={`/spots/${spot.slug}`}
                className="tap-card w-36 shrink-0 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30"
              >
                <div className="relative aspect-[4/3]">
                  <AppImage
                    src={spot.imageUrl}
                    alt={getLocalizedText(spot.title, locale)}
                    sizes="144px"
                    placeholderVariant="spot"
                    className="absolute inset-0"
                  />
                </div>
                <p className="line-clamp-2 p-2.5 text-xs font-semibold text-[var(--ink)]">
                  {getLocalizedText(spot.title, locale)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {myTopics.length > 0 && (
        <section className="mt-6 rounded-3xl bg-white p-4 shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[var(--ocean)]" />
            <h2 className="font-serif-display text-lg font-bold text-[var(--ink)]">
              {tProfile("myTopics")}
            </h2>
          </div>
          <div className="space-y-1">
            {myTopics.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                href={`/forum/${post.slug}`}
                className="flex items-center justify-between rounded-xl px-2 py-2.5 text-sm text-[var(--ink)] transition hover:bg-[var(--sand)]"
              >
                <span className="line-clamp-1 font-medium">
                  {getLocalizedText(post.title, locale)}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 space-y-2">
        <button
          type="button"
          disabled
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 opacity-60 ring-1 ring-[var(--sand-dark)]/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sand)]">
            <Settings className="h-5 w-5 text-[var(--ink-muted)]" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-medium text-[var(--ink)]">
              {tProfile("settings")}
            </span>
            <span className="text-xs text-[var(--ink-muted)]">
              {tProfile("comingSoon")}
            </span>
          </div>
        </button>

        <Button
          variant="ghost"
          className="h-12 w-full justify-start rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => void logout()}
        >
          <LogOut className="h-5 w-5" />
          {tCommon("logout")}
        </Button>
      </div>
    </div>
  );
}
