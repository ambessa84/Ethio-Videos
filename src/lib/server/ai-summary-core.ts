export type GenerateVideoAiSummaryOptions = {
  outputLanguage?: string;
};

export type AiSummaryResponse = {
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

export const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortSummary: { type: "string" },
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

export function buildAiSummaryMessages(
  video: Parameters<typeof buildPromptInput>[0],
  outputLanguage = "fr",
): AiSummaryMessage[] {
  return [
    {
      role: "system",
      content:
        "Tu es un assistant editorial pour un site de curation de videos YouTube ethiopiennes. Tu produis un resume prudent uniquement a partir des metadonnees disponibles. Tu ne dois pas inventer d'informations. Tu dois indiquer clairement quand les informations sont insuffisantes. Tu dois retourner uniquement un JSON valide.",
    },
    {
      role: "user",
      content: `Genere un resume IA dans la langue "${outputLanguage}".

Contraintes editoriales :
- N'utilise aucune transcription audio, caption ou information externe.
- Si la description YouTube est vide ou trop courte, dis-le dans le resume.
- Ne transforme pas des hypotheses en faits.
- Ne dis pas "la video explique" si les donnees ne permettent pas de le savoir.
- Utilise plutot "D'apres le titre et la description..." quand c'est pertinent.
- Mets needsHumanReview a true si le sujet touche a la politique, religion, conflit, sante, ethnicite, crime, violence, accusations, conseil financier, breaking news, ou si les informations sont insuffisantes.

JSON attendu :
{
  "shortSummary": "2 a 3 phrases maximum",
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

Input disponible :
${JSON.stringify(buildPromptInput(video), null, 2)}`,
    },
  ];
}
