import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";
import { action } from "../_generated/server";

let clerkClient: ReturnType<typeof createClerkClient> | null = null;

const getClerkClient = () => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY environment variable is required");
  }
  return (clerkClient ??= createClerkClient({ secretKey }));
};

export const validate = action({
  args: {
    organizationId: v.string(),
  },

  handler: async (_, args) => {
    try {
      const organization = await getClerkClient().organizations.getOrganization({
        organizationId: args.organizationId,
      });

      if (!organization) {
        return { valid: false, reason: "Organization is not valid" };
      }

      return { valid: true };
    } catch {
      return { valid: false, reason: "Organization is not valid" };
    }
  },
});
