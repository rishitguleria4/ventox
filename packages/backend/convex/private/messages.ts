import { listMessages, saveMessage, syncStreams } from "@convex-dev/agent";
import { vStreamArgs } from "@convex-dev/agent/validators";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "../_generated/server";
import { api, components } from "../_generated/api";
import { enhanceSupportDraftText } from "../system/ai/services/enhanceText";



const getHumanSupportName = (identity: Record<string, unknown>) => {
  const candidates = [
    identity.name,
    identity.preferred_username,
    identity.email,
    identity.tokenIdentifier,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "Human Support";
};

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string | undefined;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (!conversation || conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    const paginated = await listMessages(ctx, components.agent, {
      threadId: conversation.threadId,
      paginationOpts: args.paginationOpts,
      excludeToolMessages: true,
    });

    const streams = await syncStreams(ctx, components.agent, {
      threadId: conversation.threadId,
      streamArgs: args.streamArgs,
    });

    return {
      ...paginated,
      streams,
    };
  },
});

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    prompt: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string | undefined;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const prompt = args.prompt.trim();

    if (!prompt) {
      throw new ConvexError({
        code: "EMPTY_MESSAGE",
        message: "Message cannot be empty",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "CONVERSATION_RESOLVED",
        message: "Conversation already resolved",
      });
    }

    const handlerName = getHumanSupportName(identity as Record<string, unknown>);

    if (conversation.status !== "escalated") {
      await ctx.db.patch(args.conversationId, {
        status: "escalated",
      });
    }

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      userId: orgId,
      agentName: handlerName,
      message: {
        role: "assistant",
        content: prompt,
      },
    });

    return {
      agentName: handlerName,
      status: "escalated" as const,
    };
  },
});

export const enhanceDraft = action({
  args: {
    conversationId: v.id("conversations"),
    draft: v.string(),
  },

  handler: async (ctx, args) => {
    const currentConversation = await ctx.runQuery(
      api.private.conversations.getOne,
      {
        conversationId: args.conversationId,
      },
    );

    if (!currentConversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    const draft = args.draft.trim();

    if (!draft) {
      throw new ConvexError({
        code: "EMPTY_MESSAGE",
        message: "Message cannot be empty",
      });
    }

    return await enhanceSupportDraftText(draft);
  },
});
