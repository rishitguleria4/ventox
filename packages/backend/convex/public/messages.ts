import { listMessages, saveMessage, syncStreams } from "@convex-dev/agent";
import { vStreamArgs } from "@convex-dev/agent/validators";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { enhanceSupportDraftText } from "../system/ai/services/enhanceText";

const hasConfiguredAiProvider = () =>
  Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const buildFallbackSupportReply = (prompt: string) => {
  const normalizedPrompt = prompt.trim();

  return [
    "Thanks for reaching out. I saved your message successfully.",
    normalizedPrompt
      ? `You said: "${normalizedPrompt}".`
      : "Your message came through, but it was empty after trimming.",
    "The live AI provider is not configured in this environment yet, so this fallback reply is shown instead of a generated answer.",
  ].join(" ");
};

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },

  handler: async (ctx, args) => {
    const prompt = args.prompt.trim();

    if (!prompt) {
      throw new ConvexError({
        code: "EMPTY_MESSAGE",
        message: "Message cannot be empty",
      });
    }

    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      { contactSessionId: args.contactSessionId }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getbyThreadId,
      { threadId: args.threadId }
    );

    if (!conversation || conversation.contactSessionId !== contactSession._id) {
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

    if (conversation.status === "escalated") {
      await saveMessage(ctx, components.agent, {
        threadId: conversation.threadId,
        message: {
          role: "user",
          content: prompt,
        },
      });

      return {
        text: null,
        mode: "human",
      };
    }

    if (!hasConfiguredAiProvider()) {
      await saveMessage(ctx, components.agent, {
        threadId: conversation.threadId,
        message: {
          role: "user",
          content: prompt,
        },
      });

      const fallbackText = buildFallbackSupportReply(prompt);

      await saveMessage(ctx, components.agent, {
        threadId: conversation.threadId,
        agentName: "AI Support",
        message: {
          role: "assistant",
          content: fallbackText,
        },
      });

      return { text: fallbackText };
    }

    const { thread } = await supportAgent.continueThread(ctx, {
      threadId: conversation.threadId,
      userId: conversation.organizationId,
    });

    // Work around an upstream type mismatch between the installed agent package
    // and its AI SDK typings; the runtime accepts prompt/messages here.
    const result = await thread.generateText(
      {
        prompt,
      } as unknown as Parameters<typeof thread.generateText>[0]
    );

    return {
      text: result.text,
      mode: "ai",
    };
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },

  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      { contactSessionId: args.contactSessionId }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getbyThreadId,
      { threadId: args.threadId }
    );

    if (!conversation || conversation.contactSessionId !== contactSession._id) {
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

    return { ...paginated, streams };
  },
});

export const enhanceDraft = action({
  args: {
    draft: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },

  handler: async (ctx, args) => {
    const draft = args.draft.trim();

    if (!draft) {
      throw new ConvexError({
        code: "EMPTY_MESSAGE",
        message: "Message cannot be empty",
      });
    }

    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      { contactSessionId: args.contactSessionId },
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getbyThreadId,
      { threadId: args.threadId },
    );

    if (!conversation || conversation.contactSessionId !== contactSession._id) {
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

    if (!hasConfiguredAiProvider()) {
      throw new ConvexError({
        code: "AI_UNAVAILABLE",
        message: "AI enhancement is not available in this environment",
      });
    }

    return await enhanceSupportDraftText(draft);
  },
});
