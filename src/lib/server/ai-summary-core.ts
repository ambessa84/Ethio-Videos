export type GenerateVideoAiSummaryOptions = {
  outputLanguage?: string;
};

export type AiSummaryResponse = {
  slug: string;
  shortSummary: string;
  longSummary: string;
  keyPoints: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  detectedLanguage: string;
  suggestedCategory: string;
  confidence: number;
  needsHumanReview: boolean;
};

export type AiSummaryMessage = {
  role: "system" | "user";
  content: string;
};

export type AiSummaryProvider = "openai" | "ollama";

export const fallbackOpenAiModel = "gpt-5.4-mini";
export const fallbackOllamaBaseUrl = "http://localhost:11434";
export const fallbackOllamaModel = "qwen2.5:3b";
export const fallbackAiSummaryLanguage = "fr";
export const supportedAiSummaryLanguages = ["fr", "en", "am"] as const;

export const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortSummary: { type: "string" },
    slug: { type: "string" },
    longSummary: { type: "string" },
    keyPoints: {
      type: "array",
      items: { type: "string" },
    },
    tags: {
      type: "array",
      items: { type: "string" },
    },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    detectedLanguage: {
      type: "string",
      enum: ["am", "om", "ti", "en", "fr", "unknown"],
    },
    suggestedCategory: {
      type: "string",
      enum: [
        "News",
        "Music",
        "Drama",
        "Comedy",
        "Religion",
        "Diaspora",
        "Business",
        "Culture",
        "Sport",
        "Other",
      ],
    },
    confidence: { type: "number" },
    needsHumanReview: { type: "boolean" },
  },
  required: [
    "shortSummary",
    "slug",
    "longSummary",
    "keyPoints",
    "tags",
    "seoTitle",
    "seoDescription",
    "detectedLanguage",
    "suggestedCategory",
    "confidence",
    "needsHumanReview",
  ],
} as const;

export function resolveAiProvider(
  value: string | undefined,
): AiSummaryProvider {
  return value?.trim().toLowerCase() === "openai" ? "openai" : "ollama";
}

export function normalizeAiSummaryLanguage(value: string | undefined): string {
  const language = value?.trim().toLowerCase();

  return supportedAiSummaryLanguages.includes(
    language as (typeof supportedAiSummaryLanguages)[number],
  )
    ? (language as string)
    : fallbackAiSummaryLanguage;
}

export function getOutputText(response: unknown) {
  if (
    typeof response === "object" &&
    response !== null &&
    "output_text" in response &&
    typeof response.output_text === "string"
  ) {
    return response.output_text;
  }

  return "";
}

export function parseJsonObject(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI response did not contain a valid JSON object.");
    }

    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      throw new Error("AI response JSON could not be parsed.");
    }
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asConfidence(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;

  return Math.max(0, Math.min(1, value));
}

export function normalizeAiSummary(value: unknown): AiSummaryResponse {
  if (typeof value !== "object" || value === null) {
    throw new Error("AI response JSON must be an object.");
  }

  const record = value as Record<string, unknown>;

  return {
    shortSummary: asString(record.shortSummary),
    slug: asString(record.slug),
    longSummary: asString(record.longSummary),
    keyPoints: asStringArray(record.keyPoints),
    tags: asStringArray(record.tags),
    seoTitle: asString(record.seoTitle),
    seoDescription: asString(record.seoDescription),
    detectedLanguage: asString(record.detectedLanguage) || "unknown",
    suggestedCategory: asString(record.suggestedCategory) || "Other",
    confidence: asConfidence(record.confidence),
    needsHumanReview:
      typeof record.needsHumanReview === "boolean"
        ? record.needsHumanReview
        : true,
  };
}

export function buildPromptInput(video: {
  title: string;
  description: string | null;
  language: string | null;
  publishedAt: Date | null;
  channel: { title: string } | null;
  category: { name: string } | null;
}) {
  return {
    title: video.title,
    description: video.description,
    channelTitle: video.channel?.title ?? null,
    category: video.category?.name ?? null,
    currentLanguage: video.language,
    publishedDate: video.publishedAt?.toISOString() ?? null,
  };
}

function getOutputLanguageName(language: string) {
  switch (normalizeAiSummaryLanguage(language)) {
    case "en":
      return "English";
    case "am":
      return "Amharic";
    case "fr":
    default:
      return "French";
  }
}

export function buildAiSummaryMessages(
  video: Parameters<typeof buildPromptInput>[0],
  outputLanguage = "fr",
): AiSummaryMessage[] {
  const normalizedOutputLanguage = normalizeAiSummaryLanguage(outputLanguage);
  const outputLanguageName = getOutputLanguageName(normalizedOutputLanguage);

  return [
    {
      role: "system",
      content:
        "You are an editorial assistant for an Ethiopian YouTube video curation website. You write cautious metadata using only the provided YouTube metadata. Do not invent information. Clearly state when the available metadata is insufficient. Return only valid JSON.",
    },
    {
      role: "user",
      content: `Generate AI metadata for site language "${normalizedOutputLanguage}" (${outputLanguageName}).

Language rules:
- Every generated text field MUST be written in ${outputLanguageName}: shortSummary, longSummary, keyPoints, tags, seoTitle, and seoDescription.
- Do not answer in French unless the requested site language is "fr".
- If the requested site language is "en", all generated text fields must be English.
- If the requested site language is "am", all generated text fields must be Amharic when possible.
- The detectedLanguage field describes the original video metadata language, not the output language.
- The slug field must be short, stable, SEO-friendly, and written for ${outputLanguageName} when possible.
- The slug field must contain only words separated by hyphens. Do not include URL paths, domains, quotes, or punctuation.

Editorial constraints:
- Do not use audio transcripts, captions, or external information.
- If the YouTube description is empty or too short, say that in the requested site language.
- Do not turn assumptions into facts.
- Do not say "the video explains" if the metadata does not support it.
- When useful, phrase uncertainty as "Based on the title and description..." in the requested site language.
- In French output, translate musical "cover" as "reprise", not "cover".
- Set needsHumanReview to true for politics, religion, conflict, health, ethnicity, crime, violence, accusations, financial advice, breaking news, or insufficient information.

Expected JSON:
{
  "shortSummary": "2 a 3 phrases maximum",
  "slug": "localized-url-friendly-seo-slug",
  "longSummary": "1 a 2 paragraphes maximum",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "tags": ["tag1", "tag2", "tag3"],
  "seoTitle": "titre SEO",
  "seoDescription": "description SEO courte",
  "detectedLanguage": "am | om | ti | en | fr | unknown",
  "suggestedCategory": "News | Music | Drama | Comedy | Religion | Diaspora | Business | Culture | Sport | Other",
  "confidence": 0.0,
  "needsHumanReview": true
}

Available input:
${JSON.stringify(buildPromptInput(video), null, 2)}`,
    },
  ];
}
