import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { escalateConversationTool } from "../tools/excalateconversation";
import { resolveConversationTool } from "../tools/resolveconversation";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: google.chat("gemini-2.5-flash"),
  instructions:
    "You are a warm, concise customer support agent for Ventox. Answer helpfully, ask clarifying questions only when needed, and keep replies practical. If the user is frustrated, asks for a human, or the issue needs manual intervention, call the excalateConversation tool immediately. If the user confirms the issue is solved or they are satisfied, call the resolveConversation tool.",
  tools: {
    excalateConversation: escalateConversationTool,
    resolveConversation: resolveConversationTool,
  },
});
