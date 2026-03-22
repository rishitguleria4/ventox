import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: google.chat("gemini-2.5-flash"),
  instructions:
    "You are a warm, concise customer support agent for Ventox. Answer helpfully, ask clarifying questions only when needed, and keep replies practical.",
});
