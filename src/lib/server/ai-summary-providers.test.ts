import { describe, expect, it, vi } from "vitest";
import {
  generateAiSummaryText,
  generateOllamaSummaryText,
} from "./ai-summary-providers";
import type { AiSummaryMessage } from "./ai-summary-core";

const messages: AiSummaryMessage[] = [
  { role: "system", content: "system prompt" },
  { role: "user", content: "user prompt" },
];

function createResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(
    typeof body === "string" ? body : JSON.stringify(body),
    init,
  );
}

describe("generateOllamaSummaryText", () => {
  it("posts the expected chat payload to Ollama", async () => {
    const fetchMock = vi.fn(async () =>
      createResponse({
        message: {
          content: '{"shortSummary":"ok"}',
        },
      }),
    );

    await expect(
      generateOllamaSummaryText(
        messages,
        {
          OLLAMA_BASE_URL: "http://localhost:11434/",
          OLLAMA_MODEL: "qwen2.5:3b",
        },
        fetchMock,
      ),
    ).resolves.toBe('{"shortSummary":"ok"}');

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen2.5:3b",
        stream: false,
        format: "json",
        messages,
      }),
    });
  });

  it("returns message.content from Ollama", async () => {
    const fetchMock = vi.fn(async () =>
      createResponse({
        message: {
          content: '{"longSummary":"done"}',
        },
      }),
    );

    await expect(
      generateOllamaSummaryText(messages, {}, fetchMock),
    ).resolves.toBe('{"longSummary":"done"}');
  });

  it("throws a clear error when Ollama is unavailable", async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });

    await expect(
      generateOllamaSummaryText(
        messages,
        { OLLAMA_BASE_URL: "http://localhost:11434" },
        fetchMock,
      ),
    ).rejects.toThrow("Ollama is not available at http://localhost:11434");
  });

  it("throws a model pull hint when Ollama reports a missing model", async () => {
    const fetchMock = vi.fn(async () =>
      createResponse("model not found, try pulling it first", { status: 404 }),
    );

    await expect(
      generateOllamaSummaryText(
        messages,
        { OLLAMA_MODEL: "qwen2.5:3b" },
        fetchMock,
      ),
    ).rejects.toThrow(
      'Ollama model "qwen2.5:3b" is not available. Run: ollama pull qwen2.5:3b',
    );
  });

  it("throws a clear error for non-2xx responses", async () => {
    const fetchMock = vi.fn(async () =>
      createResponse("internal error", { status: 500 }),
    );

    await expect(
      generateOllamaSummaryText(messages, {}, fetchMock),
    ).rejects.toThrow("Ollama request failed with status 500: internal error");
  });
});

describe("generateAiSummaryText", () => {
  it("uses Ollama when the provider is missing", async () => {
    const fetchMock = vi.fn(async () =>
      createResponse({
        message: {
          content: '{"shortSummary":"local"}',
        },
      }),
    );

    await expect(generateAiSummaryText(messages, {}, fetchMock)).resolves.toBe(
      '{"shortSummary":"local"}',
    );
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
