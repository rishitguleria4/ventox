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

const RESOLUTION_NOTICE =
  "Glad we could resolve this for you. I am marking this conversation as resolved. If anything else comes up, feel free to message us again.";

export const resolveConversationTool = createTool({
  description:
    "Mark the current conversation as resolved when the user confirms satisfaction or indicates the issue is solved.",
  args: NO_ARGS_SCHEMA,
  handler: async (ctx: ToolCtx) => {
    if (!ctx.threadId) {
      throw new ConvexError({
        code: "INVALID_THREAD",
        message: "Thread ID is required to resolve a conversation.",
      });
    }

    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    });

    await saveMessage(ctx, components.agent, {
      threadId: ctx.threadId,
      agentName: "Support Updates",
      message: {
        role: "assistant",
        content: RESOLUTION_NOTICE,
      },
    });

    return {
      status: "resolved" as const,
      notified: true,
    };
  },
});
