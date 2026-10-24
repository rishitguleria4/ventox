import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { rateLimiter } from "../lib/rateLimiter";

const SESSION_DURATION_IN_MS = 24 * 60 * 60 * 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      }),
    ),
  },

  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();

    if (!name || name.length > 100) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Invalid name",
      });
    }

    if (email.length > 254 || !EMAIL_REGEX.test(email)) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Invalid email",
      });
    }

    await rateLimiter.limit(ctx, "contactSessionCreate", {
      key: args.organizationId,
      throws: true,
    });

    const now = Date.now();
    const expiresAt = now + SESSION_DURATION_IN_MS;

    const contactSessionId = await ctx.db.insert("contactSessions", {
      name,
      email,
      organizationId: args.organizationId,
      expiresAt,
      metadata: args.metadata,
    });

    return contactSessionId;
  },
});

export const validate = mutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },

  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      return { valid: false, reason: "Contact session not found" };
    }

    if (contactSession.expiresAt <= Date.now()) {
      // Do NOT delete the contact session: conversations reference it via contactSessionId,
      // and deleting it would cause those conversations to disappear from the dashboard.
      return { valid: false, reason: "Contact session expired" };
    }

    return { valid: true, contactSession };
  },
});
