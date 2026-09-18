/** Demo forum/activities in UI, search, and sitemap (not guide editorial). */
export function shouldUseMockContent(): boolean {
  const flag = process.env.NEXT_PUBLIC_USE_MOCK_CONTENT?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV === "development";
}
