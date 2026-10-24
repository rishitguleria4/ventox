import { createTool, type ToolCtx } from "@convex-dev/agent";
import { jsonSchema } from "@ai-sdk/provider-utils";
import { internal } from "../../../_generated/api";
import rag from "../rag";

const SEARCH_SCHEMA = jsonSchema<{ query: string }>({
  type: "object",
  additionalProperties: false,
  properties: {
    query: {
      type: "string",
      description: "The user's question rewritten as a concise search query",
    },
  },
  required: ["query"],
});

export const searchTool = createTool({
  description:
    "Search this organization's knowledge base (uploaded files) for facts needed to answer the user. Always use this before answering product, pricing, policy, or how-to questions.",
  args: SEARCH_SCHEMA,
  handler: async (ctx: ToolCtx, args: { query: string }) => {
    if (!ctx.threadId) {
      return "Missing thread context.";
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getbyThreadId,
      { threadId: ctx.threadId },
    );

    if (!conversation) {
      return "Conversation not found.";
    }

    // Tenant isolation: search ONLY this org's namespace.
    const result = await rag.search(ctx, {
      namespace: conversation.organizationId,
      query: args.query,
      limit: 5,
    });

    return result.text?.trim()
      ? result.text
      : "No relevant information found in the knowledge base.";
  },
});

