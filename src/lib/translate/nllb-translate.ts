import type { Locale } from "@/i18n/routing";
import { protectGlossaryTerms, restoreGlossaryTerms } from "@/lib/translate/glossary";
import { NLLB_LOCALE } from "@/lib/translate/nllb-codes";

const HF_MODEL = "facebook/nllb-200-distilled-600M";
const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const MAX_RETRIES = 3;

const MYMEMORY_LANG: Record<Locale, string> = {
  ms: "ms",
  en: "en",
  zh: "zh-CN",
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseHfResponse(json: unknown): string | null {
  if (typeof json === "string" && json.trim()) return json.trim();
  if (!json || typeof json !== "object") return null;

  const record = json as Record<string, unknown>;
  if (typeof record.translation_text === "string") {
    return record.translation_text.trim();
  }

  if (Array.isArray(json) && json.length > 0) {
    const first = json[0] as Record<string, unknown>;
    if (typeof first?.translation_text === "string") {
      return first.translation_text.trim();
    }
    if (typeof first?.generated_text === "string") {
      return first.generated_text.trim();
    }
  }

  return null;
}

async function callNllb(
  text: string,
  sourceLocale: Locale,
  targetLocale: Locale,
): Promise<string> {
  const token = process.env.HUGGINGFACE_API_TOKEN?.trim();
  if (!token) {
    throw new Error("HUGGINGFACE_API_TOKEN is not configured");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          src_lang: NLLB_LOCALE[sourceLocale],
          tgt_lang: NLLB_LOCALE[targetLocale],
        },
      }),
    });

    if (response.status === 503) {
      await sleep(1500 * (attempt + 1));
      lastError = new Error("NLLB model is loading");
      continue;
    }

    if (!response.ok) {
      throw new Error(`NLLB request failed (${response.status})`);
    }

    const json = (await response.json()) as unknown;
    const translated = parseHfResponse(json);
    if (!translated) {
      throw new Error("Unexpected NLLB response");
    }

    return translated;
  }

  throw lastError ?? new Error("NLLB unavailable");
}

async function callMyMemory(
  text: string,
  sourceLocale: Locale,
  targetLocale: Locale,
): Promise<string> {
  const langpair = `${MYMEMORY_LANG[sourceLocale]}|${MYMEMORY_LANG[targetLocale]}`;
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", langpair);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`MyMemory request failed (${response.status})`);
  }

  const json = (await response.json()) as {
    responseData?: { translatedText?: string };
  };

  const translated = json.responseData?.translatedText?.trim();
  if (!translated) {
    throw new Error("MyMemory returned empty translation");
  }

  return translated;
}

export function shouldTranslateText(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  if (!/[a-zA-Z\u4e00-\u9fff]/.test(trimmed)) return false;
  return true;
}

export async function translateUgcText(
  text: string,
  sourceLocale: Locale,
  targetLocale: Locale,
): Promise<string> {
  if (sourceLocale === targetLocale) return text.trim();

  const trimmed = text.trim();
  if (!shouldTranslateText(trimmed)) return trimmed;

  const { protectedText, placeholders } = protectGlossaryTerms(trimmed);

  let translated: string;
  try {
    translated = await callNllb(protectedText, sourceLocale, targetLocale);
  } catch {
    translated = await callMyMemory(protectedText, sourceLocale, targetLocale);
  }

  return restoreGlossaryTerms(translated, placeholders).trim();
}
