import { env } from "$env/dynamic/private";
import OpenAI from "openai";
import {
  fallbackOllamaBaseUrl,
  fallbackOllamaModel,
  fallbackOpenAiModel,
  resolveAiProvider,
  responseSchema,
  type AiSummaryMessage,
} from "$lib/server/ai-summary-core";

type AiSummaryEnv = {
  AI_PROVIDER?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  OLLAMA_BASE_URL?: string;
  OLLAMA_MODEL?: string;
};

type FetchLike = typeof fetch;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getEnvValue(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export async function generateAiSummaryText(
  messages: AiSummaryMessage[],
  runtimeEnv: AiSummaryEnv = env,
  fetchImpl: FetchLike = fetch,
) {
  const provider = resolveAiProvider(runtimeEnv.AI_PROVIDER);

  if (provider === "openai") {
    return generateOpenAiSummaryText(messages, runtimeEnv);
  }

  return generateOllamaSummaryText(messages, runtimeEnv, fetchImpl);
}

export async function generateOpenAiSummaryText(
  messages: AiSummaryMessage[],
  runtimeEnv: AiSummaryEnv = env,
) {
  const apiKey = runtimeEnv.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const openai = new OpenAI({ apiKey });
  const model = getEnvValue(runtimeEnv.OPENAI_MODEL, fallbackOpenAiModel);

  const response = await openai.responses.create({
    model,
    input: messages,
    text: {
      format: {
        type: "json_schema",
        name: "video_ai_summary",
        strict: true,
        schema: responseSchema,
      },
    },
  });

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

export async function generateOllamaSummaryText(
  messages: AiSummaryMessage[],
  runtimeEnv: AiSummaryEnv = env,
  fetchImpl: FetchLike = fetch,
) {
  const baseUrl = trimTrailingSlash(
    getEnvValue(runtimeEnv.OLLAMA_BASE_URL, fallbackOllamaBaseUrl),
  );
  const model = getEnvValue(runtimeEnv.OLLAMA_MODEL, fallbackOllamaModel);

  let response: Response;

  try {
    response = await fetchImpl(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: false,
        format: "json",
        messages,
      }),
    });
  } catch {
    throw new Error(`Ollama is not available at ${baseUrl}`);
  }

  const responseText = await response.text();

  if (!response.ok) {
    if (
      response.status === 404 ||
      responseText.toLowerCase().includes("not found") ||
      responseText.toLowerCase().includes("pull")
    ) {
      throw new Error(
        `Ollama model "${model}" is not available. Run: ollama pull ${model}`,
      );
    }

    throw new Error(
      `Ollama request failed with status ${response.status}: ${responseText}`,
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(responseText);
  } catch {
    throw new Error("Ollama response JSON could not be parsed.");
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "object" &&
    payload.message !== null &&
    "content" in payload.message &&
    typeof payload.message.content === "string"
  ) {
    return payload.message.content;
  }

  throw new Error("Ollama response did not contain message.content.");
}
