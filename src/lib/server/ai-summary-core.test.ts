import { describe, expect, it } from "vitest";
import {
  buildAiSummaryMessages,
  normalizeAiSummaryLanguage,
  normalizeAiSummary,
  parseJsonObject,
  resolveAiProvider,
} from "./ai-summary-core";

describe("parseJsonObject", () => {
  it("parses a plain JSON object response", () => {
    expect(parseJsonObject('{"shortSummary":"ok"}')).toEqual({
      shortSummary: "ok",
    });
  });

  it("extracts a JSON object surrounded by text", () => {
    expect(
      parseJsonObject('Here is the result: {"shortSummary":"ok"} done'),
    ).toEqual({
      shortSummary: "ok",
    });
  });

  it("throws when no valid JSON object is present", () => {
    expect(() => parseJsonObject("no json here")).toThrow(
      "AI response did not contain a valid JSON object.",
    );
  });
});

describe("normalizeAiSummary", () => {
  it("normalizes missing and invalid fields safely", () => {
    expect(
      normalizeAiSummary({
        shortSummary: "  Short  ",
        longSummary: null,
        keyPoints: ["one", "", 12, " two "],
        tags: "tag",
        confidence: "high",
      }),
    ).toEqual({
      shortSummary: "Short",
      longSummary: "",
      keyPoints: ["one", "two"],
      tags: [],
      seoTitle: "",
      seoDescription: "",
      detectedLanguage: "unknown",
      suggestedCategory: "Other",
      confidence: 0,
      needsHumanReview: true,
    });
  });

  it("clamps confidence between 0 and 1", () => {
    expect(normalizeAiSummary({ confidence: -1 }).confidence).toBe(0);
    expect(normalizeAiSummary({ confidence: 2 }).confidence).toBe(1);
    expect(normalizeAiSummary({ confidence: 0.42 }).confidence).toBe(0.42);
  });
});

describe("resolveAiProvider", () => {
  it("selects OpenAI only when explicitly configured", () => {
    expect(resolveAiProvider("openai")).toBe("openai");
    expect(resolveAiProvider(" OPENAI ")).toBe("openai");
  });

  it("falls back to Ollama for missing or unknown values", () => {
    expect(resolveAiProvider(undefined)).toBe("ollama");
    expect(resolveAiProvider("")).toBe("ollama");
    expect(resolveAiProvider("unknown")).toBe("ollama");
  });
});

describe("normalizeAiSummaryLanguage", () => {
  it("keeps supported site languages", () => {
    expect(normalizeAiSummaryLanguage("fr")).toBe("fr");
    expect(normalizeAiSummaryLanguage(" EN ")).toBe("en");
    expect(normalizeAiSummaryLanguage("am")).toBe("am");
  });

  it("falls back to French for missing or unsupported languages", () => {
    expect(normalizeAiSummaryLanguage(undefined)).toBe("fr");
    expect(normalizeAiSummaryLanguage("")).toBe("fr");
    expect(normalizeAiSummaryLanguage("de")).toBe("fr");
  });
});

describe("buildAiSummaryMessages", () => {
  const video = {
    title: "Song cover",
    description: "A music video",
    language: "am",
    publishedAt: new Date("2026-01-01T00:00:00.000Z"),
    channel: { title: "Channel" },
    category: { name: "Music" },
  };

  it("makes English output language explicit", () => {
    const messages = buildAiSummaryMessages(video, "en");
    const userMessage = messages[1].content;

    expect(userMessage).toContain('site language "en" (English)');
    expect(userMessage).toContain("all generated text fields must be English");
    expect(userMessage).toContain("Do not answer in French");
  });

  it("makes French output language explicit", () => {
    const messages = buildAiSummaryMessages(video, "fr");

    expect(messages[1].content).toContain('site language "fr" (French)');
    expect(messages[1].content).toContain(
      "Every generated text field MUST be written in French",
    );
  });
});
