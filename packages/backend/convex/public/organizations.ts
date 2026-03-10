import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";
import { action } from "../_generated/server";


const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) {
    throw new Error("CLERK_SECRET_KEY environment variable is required");
}

const clerkClient = createClerkClient({
    secretKey: clerkSecretKey,
});

export const validate = action ({
    args:{
        organizationId : v.string(),
    },

    handler : async(_ , args) => {
            try {
                const organization = await clerkClient.organizations.getOrganization({
                    organizationId : args.organizationId,
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
