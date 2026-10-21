import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/constants";

export const metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
