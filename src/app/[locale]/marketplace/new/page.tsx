import { setRequestLocale } from "next-intl/server";
import { PostListingForm } from "@/components/marketplace/post-listing-form";

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <PostListingForm />
    </div>
  );
}
