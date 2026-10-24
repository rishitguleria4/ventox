import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { escalateConversationTool } from "../tools/escalateconversation";
import { resolveConversationTool } from "../tools/resolveconversation";
import { searchTool } from "../tools/search";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: google.chat("gemini-2.5-flash"),
  maxSteps: 5,
  instructions: [
    "You are a warm, concise customer support agent for Ventox.",
    "For any question about the company's product, pricing, policies, or how-to, call searchTool FIRST and answer only from its results.",
    "If searchTool finds nothing relevant, say you don't have that information and offer to connect them with a human.",
    "If the user is frustrated, asks for a human, or the issue needs manual intervention, call the escalateConversation tool immediately.",
    "If the user confirms the issue is solved or they are satisfied, call the resolveConversation tool.",
    "Never invent facts, prices, or links.",
  ].join(" "),
  tools: {
    searchTool,
    escalateConversation: escalateConversationTool,
    resolveConversation: resolveConversationTool,
  },
});
