import { env } from '$env/dynamic/private';
import OpenAI from 'openai';
import { prisma } from '$lib/server/prisma';

type GenerateVideoAiSummaryOptions = {
  outputLanguage?: string;
};

type AiSummaryResponse = {
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

const fallbackModel = 'gpt-5.4-mini';

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    shortSummary: { type: 'string' },
    longSummary: { type: 'string' },
    keyPoints: {
      type: 'array',
      items: { type: 'string' }
    },
    tags: {
      type: 'array',
      items: { type: 'string' }
    },
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' },
    detectedLanguage: {
      type: 'string',
      enum: ['am', 'om', 'ti', 'en', 'fr', 'unknown']
    },
    suggestedCategory: {
      type: 'string',
      enum: [
        'News',
        'Music',
        'Drama',
        'Comedy',
        'Religion',
        'Diaspora',
        'Business',
        'Culture',
        'Sport',
        'Other'
      ]
    },
    confidence: { type: 'number' },
    needsHumanReview: { type: 'boolean' }
  },
  required: [
    'shortSummary',
    'longSummary',
    'keyPoints',
    'tags',
    'seoTitle',
    'seoDescription',
    'detectedLanguage',
    'suggestedCategory',
    'confidence',
    'needsHumanReview'
  ]
} as const;

function getOutputText(response: unknown) {
  if (
    typeof response === 'object' &&
    response !== null &&
    'output_text' in response &&
    typeof response.output_text === 'string'
  ) {
    return response.output_text;
  }

  return '';
}

function parseJsonObject(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw new Error('OpenAI response did not contain a valid JSON object.');
    }

    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      throw new Error('OpenAI response JSON could not be parsed.');
    }
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function asConfidence(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;

  return Math.max(0, Math.min(1, value));
}

function normalizeAiSummary(value: unknown): AiSummaryResponse {
  if (typeof value !== 'object' || value === null) {
    throw new Error('OpenAI response JSON must be an object.');
  }

  const record = value as Record<string, unknown>;

  return {
    shortSummary: asString(record.shortSummary),
    longSummary: asString(record.longSummary),
    keyPoints: asStringArray(record.keyPoints),
    tags: asStringArray(record.tags),
    seoTitle: asString(record.seoTitle),
    seoDescription: asString(record.seoDescription),
    detectedLanguage: asString(record.detectedLanguage) || 'unknown',
    suggestedCategory: asString(record.suggestedCategory) || 'Other',
    confidence: asConfidence(record.confidence),
    needsHumanReview:
      typeof record.needsHumanReview === 'boolean'
        ? record.needsHumanReview
        : true
  };
}

function buildPromptInput(video: {
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
    publishedDate: video.publishedAt?.toISOString() ?? null
  };
}

export async function generateVideoAiSummary(
  videoId: string,
  options: GenerateVideoAiSummaryOptions = {}
) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      channel: true,
      category: true
    }
  });

  if (!video) {
    throw new Error('Video not found');
  }

  await prisma.video.update({
    where: { id: video.id },
    data: {
      aiStatus: 'GENERATING',
      aiError: null
    }
  });

  try {
    const apiKey = env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }

    const outputLanguage = options.outputLanguage?.trim() || 'fr';
    const openai = new OpenAI({ apiKey });
    const model = env.OPENAI_MODEL?.trim() || fallbackModel;

    const response = await openai.responses.create({
      model,
      input: [
        {
          role: 'system',
          content:
            "Tu es un assistant editorial pour un site de curation de videos YouTube ethiopiennes. Tu produis un resume prudent uniquement a partir des metadonnees disponibles. Tu ne dois pas inventer d'informations. Tu dois indiquer clairement quand les informations sont insuffisantes. Tu dois retourner uniquement un JSON valide."
        },
        {
          role: 'user',
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
${JSON.stringify(buildPromptInput(video), null, 2)}`
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'video_ai_summary',
          strict: true,
          schema: responseSchema
        }
      }
    });

    const parsed = normalizeAiSummary(parseJsonObject(getOutputText(response)));

    return await prisma.video.update({
      where: { id: video.id },
      data: {
        aiShortSummary: parsed.shortSummary || null,
        aiLongSummary: parsed.longSummary || null,
        aiKeyPoints: JSON.stringify(parsed.keyPoints),
        aiTags: JSON.stringify(parsed.tags),
        aiSeoTitle: parsed.seoTitle || null,
        aiSeoDescription: parsed.seoDescription || null,
        aiLanguage: parsed.detectedLanguage,
        aiCategorySuggestion: parsed.suggestedCategory,
        aiConfidence: parsed.confidence,
        aiNeedsHumanReview: parsed.needsHumanReview,
        aiGeneratedAt: new Date(),
        aiStatus: 'GENERATED',
        aiError: null
      }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to generate AI summary.';

    await prisma.video.update({
      where: { id: video.id },
      data: {
        aiStatus: 'FAILED',
        aiError: message
      }
    });

    throw new Error(message);
  }
}
