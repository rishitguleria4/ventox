import { v } from "convex/values";
import { action, mutation, query, QueryCtx } from "../_generated/server";
import { ConvexError } from "convex/values";
import { contentHashFromArrayBuffer, guessMimeTypeFromContents, guessMimeTypeFromExtension, Entry, EntryId } from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

/**
 * Guesses the MIME type of a file based on its extension or contents.
 * Falls back to 'application/octet-stream' if unknown.
 * @param filename - The name of the file.
 * @param bytes - The file contents as an ArrayBuffer.
 * @returns The guessed MIME type.
 */
function guessMimeType(filename: string, bytes: ArrayBuffer): string {
    return (
        guessMimeTypeFromExtension(filename) ||
        guessMimeTypeFromContents(bytes) ||
        "application/octet-stream"
    )
};

/**
 * Mutation to delete a file from both RAG storage and Convex storage.
 * Ensures that the user deleting the file is the organization that uploaded it.
 * @param entryId - The RAG entry ID to delete.
 * @param storageId - The Convex storage ID to delete.
 */
export const deleteFile = mutation({
    args: {
        entryId: v.string(),
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
        const namespace = await rag.getNamespace(ctx, {
            namespace: orgId,
        });

        if (!namespace) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Namespace not found",
            });
        }
        const entryId = args.entryId as any;
        const entry = await rag.getEntry(ctx, { entryId });

        if (!entry) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Entry not found",
            });
        }

        // Proper checking: Ensure the entry actually belongs to this org
        if (entry.metadata?.uploadedBy !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            });
        }
        if (entry.metadata?.storageId) {
            await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
        }
        await rag.deleteAsync(ctx, {
            entryId,
        });
    }
})

/**
 * Action to add a file to Convex storage and index it in the RAG system.
 * Extracts text from the file before indexing.
 * Ensures the file is stored under the user's organization namespace for privacy.
 * @param filename - The name of the file.
 * @param mimetype - The MIME type of the file.
 * @param bytes - The file contents as an ArrayBuffer.
 * @param category - Optional category for the file.
 * @returns An object containing the public URL and the new RAG entry ID.
 */
export const addFile = action({
    args: {
        filename: v.string(),
        mimetype: v.optional(v.string()),
        bytes: v.bytes(),
        category: v.optional(v.string()),
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
        const { filename, category, bytes } = args;
        const mimetype = args.mimetype || guessMimeType(filename, bytes);
        const blob = new Blob([bytes], { type: mimetype });

        const storageId = await ctx.storage.store(blob);
        const text = await extractTextContent(ctx, {
            storageId,
            bytes,
            mimetype,
            filename,
        });

        const { entryId, created } = await rag.add(ctx, {
            // Scope the entry to the current organization to preserve tenant privacy.
            // Without this namespace, files could be added to a global space and become accessible across organizations.
            namespace: orgId,
            text,
            key: filename,
            title: filename,
            metadata: {
                storageId,
                uploadedBy: orgId, // IMP FOR DELETION AND VERIFICATION
                filename,
                category: category || "null",
            } as EntryMetaData,
            contentHash: await contentHashFromArrayBuffer(bytes)//to avoid reuploading 
        });
        if (!created) {
            // means file with same 
            console.log("entry alread exist , skipping upload metadata");
            await ctx.storage.delete(storageId);
        }

        const url = created ? await ctx.storage.getUrl(storageId) : null;
        return {
            url,
            entryId,
            created,
        }
    },
});

export const list = query({
    args: {
        category: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
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
        const { paginationOpts } = args;
        const namespace = await rag.getNamespace(ctx, {
            namespace: orgId,
        });

        if (!namespace) {
            return { page: [], isDone: true, continueCursor: "" };
        }

        const results = await rag.list(ctx, {
            namespaceId: namespace.namespaceId,
            paginationOpts: args.paginationOpts,
            //query:args.category ? "metadata.category = " + args.category : undefined,
        });
        const files = await Promise.all(
            results.page.map((entry) =>
                convertEntryToPublicFile(ctx, entry)
            )
        );

        return {
            ...results,
            page: files,
        };
    }
})

export type PublicFile = {
    id: EntryId;
    name: string;
    category?: string;
    type: string;
    size: string;
    status: "ready" | "processing" | "error";
    url: string | null;
}

type EntryMetaData = {
    uploadedBy: string;
    storageId: Id<"_storage">;
    category?: string;
    filename: string;
}
//
async function convertEntryToPublicFile(
    ctx: Pick<QueryCtx, "storage" | "db">,
    entry: Entry,
): Promise<PublicFile> {
    const metadata = entry.metadata as EntryMetaData;
    const storageId = metadata.storageId;

    let fileSize = "unknown";

    if (storageId) {
        try {
            const storageMetadata = await ctx.db.system.get(storageId);
            if (storageMetadata) {
                fileSize = formatFileSize(storageMetadata.size)
            }
        }
        catch (error) {
            console.error("Error fetching file metadata:", error);
        }
    }
    const filename = entry.key || "unknown";
    const extension = filename.split(".").pop()?.toLowerCase() || "txt";

    let status: "ready" | "processing" | "error" = "error";
    if (entry.status === "ready") {
        status = "ready"
    }
    else if (entry.status === "pending") {
        status = "processing"
    }

    const url = storageId ? await ctx.storage.getUrl(storageId) : null;

    return {
        id: entry.entryId,
        name: filename,
        type: extension,
        size: fileSize,
        status,
        url,
        category: metadata?.category || undefined,
    };
};

function formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes}B`;
    }
    const sizeInKB = sizeInBytes / 1024;
    if (sizeInKB < 1024) {
        return `${sizeInKB.toFixed(1)}KB`;
    }
    const sizeInMB = sizeInKB / 1024;
    return `${sizeInMB.toFixed(1)}MB`;
}