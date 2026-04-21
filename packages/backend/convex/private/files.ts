import { v } from "convex/values";
import { action, mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { contentHashFromArrayBuffer, guessMimeTypeFromContents, guessMimeTypeFromExtension} from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";

/**
 * Guesses the MIME type of a file based on its extension or contents.
 * Falls back to 'application/octet-stream' if unknown.
 * @param filename - The name of the file.
 * @param bytes - The file contents as an ArrayBuffer.
 * @returns The guessed MIME type.
 */
function guessMimeType(filename : string  ,bytes : ArrayBuffer): string {
    return (
        guessMimeTypeFromExtension(filename) ||
        guessMimeTypeFromContents(bytes)||
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
    args:{
        entryId:v.id("rag_entries"),
    },
    handler:async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Identity not found",
            });
        }
        const orgId = identity.orgId as string | undefined;
        if(!orgId){
            throw new ConvexError({
                code:"UNAUTHORIZED",
                message:"Organization not found",
            });
        }
        const namespace = await rag.getNamespace ( ctx , {
            namespace : orgId ,
        });

        if ( !namespace){
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Namespace not found",
            });
        }
        const entryId = args.entryId as any;
        const entry = await rag.getEntry(ctx, { entryId });

        if ( !entry){
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Entry not found",
            });
        }

        // Proper checking: Ensure the entry actually belongs to this org
        if( entry.metadata?.uploadedBy !== orgId)
        {
            throw new ConvexError({
                code : "UNAUTHORIZED",
                message : "Unauthorized",
            });
        }
        if (entry.metadata?.storageId )
        {
            await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
        }
        await rag.deleteAsync(ctx,{
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
export const  addFile = action ({
    args:{
        filename : v.string(),
        mimetype : v.optional(v.string()),
        bytes : v.bytes(),
        category:v.optional(v.string()),
    },
    handler : async (ctx,args) => {
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
        const {filename,category,bytes} = args;
        const mimetype = args.mimetype || guessMimeType( filename , bytes);
        const blob = new Blob([bytes], {type:mimetype});

        const storageId = await ctx.storage.store(blob);
        const text = await extractTextContent(ctx , {
            storageId,
            bytes ,
            mimetype,
            filename ,
        });

        const {entryId , created} = await rag.add(ctx , {
            // Scope the entry to the current organization to preserve tenant privacy.
            // Without this namespace, files could be added to a global space and become accessible across organizations.
            namespace : orgId,
            text ,
            key : filename ,
            title :  filename ,
            metadata : {
                storageId,
                uploadedBy : orgId , // IMP FOR DELETION AND VERIFICATION
                filename ,
                category : category || "null",
            },
            contentHash : await contentHashFromArrayBuffer(bytes)//to avoid reuploading 
        });
        if ( !created){
            // means file with same 
            console.log ("entry alread exist , skipping upload metadata");
            await ctx.storage.delete(storageId);
        }

        const url = created ? await ctx.storage.getUrl(storageId) : null;
        return {
            url,
            entryId,
            created,
        }
    }, 
})