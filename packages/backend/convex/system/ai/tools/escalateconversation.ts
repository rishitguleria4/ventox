import { createTool, saveMessage, type ToolCtx } from "@convex-dev/agent";
import { jsonSchema } from "@ai-sdk/provider-utils";
import { ConvexError } from "convex/values";
import { components, internal } from "../../../_generated/api";

const NO_ARGS_SCHEMA = jsonSchema({
  type: "object",
  additionalProperties: false,
  properties: {},
  required: [],
});

const ESCALATION_NOTICE =
  "I am escalating this conversation to a human support teammate now. Your next messages will go directly to the dashboard support team.";

export const escalateConversationTool = createTool({
  description:
    "Escalate the current conversation to human support when the user is frustrated, asks for a person, or the issue requires manual help.",
  args: NO_ARGS_SCHEMA,
  handler: async (ctx: ToolCtx) => {
    if (!ctx.threadId) {
      throw new ConvexError({
        code: "INVALID_THREAD",
        message: "Thread ID is required to escalate a conversation.",
      });
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await saveMessage(ctx, components.agent, {
      threadId: ctx.threadId,
      agentName: "Support Updates",
      message: {
        role: "assistant",
        content: ESCALATION_NOTICE,
      },
    });

    return {
      status: "escalated" as const,
      notified: true,
    };
  },
});
