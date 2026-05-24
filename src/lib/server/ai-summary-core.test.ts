import { describe, expect, it } from "vitest";
import {
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
