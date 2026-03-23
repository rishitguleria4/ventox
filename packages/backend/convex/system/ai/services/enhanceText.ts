import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const hasConfiguredAiProvider = () =>
  Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const normalizeWhitespace = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();

const ensureSentenceEnding = (value: string) => {
  if (!value) {
    return value;
  }

  const lastCharacter = value.charAt(value.length - 1);

  if (lastCharacter === "." || lastCharacter === "!" || lastCharacter === "?") {
    return value;
  }

  return value + ".";
};

const capitalizeFirstCharacter = (value: string) => {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const fallbackEnhanceText = (draft: string) =>
  ensureSentenceEnding(capitalizeFirstCharacter(normalizeWhitespace(draft)));

export type EnhanceTextResult = {
  text: string;
  mode: "ai" | "fallback";
};

export const enhanceSupportDraftText = async (
  draft: string,
): Promise<EnhanceTextResult> => {
  const normalizedDraft = normalizeWhitespace(draft);

  if (!normalizedDraft) {
    return {
      text: "",
      mode: "fallback",
    };
  }

  if (!hasConfiguredAiProvider()) {
    return {
      text: fallbackEnhanceText(normalizedDraft),
      mode: "fallback",
    };
  }

  try {
    const result = await generateText({
      model: google.chat("gemini-2.5-flash"),
      temperature: 0.2,
      prompt: [
        "Rewrite the following customer-support draft to be clearer, friendlier, and concise.",
        "Keep the original intent, avoid adding facts, and return plain text only.",
        "Draft:",
        normalizedDraft,
      ].join("\n"),
    });

    const enhancedText = normalizeWhitespace(result.text);

    if (!enhancedText) {
      return {
        text: fallbackEnhanceText(normalizedDraft),
        mode: "fallback",
      };
    }

    return {
      text: enhancedText,
      mode: "ai",
    };
  } catch {
    return {
      text: fallbackEnhanceText(normalizedDraft),
      mode: "fallback",
    };
  }
};