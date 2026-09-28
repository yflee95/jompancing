import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/login",
          "/*/post",
          "/*/profile",
          "/*/forum/new",
          "/*/activities/promote",
          "/*/marketplace/new",
          "/*/search",
          "/*/*/edit",
          "/auth/",
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
