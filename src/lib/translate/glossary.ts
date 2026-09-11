/** Fishing terms kept verbatim during machine translation. */
const PROTECTED_TERMS = [
  "patin",
  "keli",
  "ikan keli",
  "kolam",
  "lubuk",
  "COD",
  "UL",
  "PE",
  "jig",
  "jigging",
  "casting",
  "spinning",
  "feeder",
  "float",
  "snakehead",
  "toman",
  "haruan",
  "sebarau",
  "talapia",
  "Jompancing",
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function protectGlossaryTerms(text: string): {
  protectedText: string;
  placeholders: Map<string, string>;
} {
  const placeholders = new Map<string, string>();
  let protectedText = text;

  PROTECTED_TERMS.forEach((term, index) => {
    const re = new RegExp(escapeRegExp(term), "gi");
    protectedText = protectedText.replace(re, (match) => {
      const key = `[[JP${index}_${placeholders.size}]]`;
      placeholders.set(key, match);
      return key;
    });
  });

  return { protectedText, placeholders };
}

export function restoreGlossaryTerms(
  text: string,
  placeholders: Map<string, string>,
): string {
  let restored = text;
  for (const [key, value] of placeholders) {
    restored = restored.replaceAll(key, value);
  }
  return restored;
}
