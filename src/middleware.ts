import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Let next-intl route every public page through the default locale. Keeping
  // this list limited to the home page and /spots leaves other unprefixed
  // routes (for example /fish and /guide) to be interpreted as locale names,
  // which can produce server errors when crawlers request those URLs.
  // API/auth handlers and Next.js metadata/static assets must bypass locale
  // negotiation.
  matcher: [
    "/((?!api(?:/|$)|auth(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|icon(?:/|$)|apple-icon(?:/|$)|opengraph-image(?:/|$)|twitter-image(?:/|$)|.*\\..*).*)",
  ],
};
