import { v } from "convex/values";
import { action, mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { contentHashFromArrayBuffer, guessMimeTypeFromContents, guessMimeTypeFromExtension} from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";

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
        storageId:v.id("_storage"),
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
        if( entry.metadata?.uploadedby !== orgId)
        {
            throw new ConvexError({
                code : "UNAUTHORISED",
                message : "Unauthorized",
            });
        }
        if (entry.metadata?.storageId )
        {
            await ctx.storage.delete(entry.metadata.storageId as any);
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
        mimetype : v.string(),
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
            namespace : orgId ,//this is super important to maintain privacy of users through this nobidy can access others namespace , if didn,t implemented it will be gloabl which is dangerous
            text ,
            key : filename ,
            title :  filename ,
            metadata : {
                storageId,
                uploadedby : orgId , // IMP FOR DELETION AND VERIFICATION
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

        return {
            url : await ctx.storage.getUrl(storageId),
            entryId ,
        }
    }, 
})