import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { StorageActionWriter
 } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
    image : google("gemini-2.0-flash"),
    pdf : google("gemini-2.0-flash"),
    html :google("gemini-2.0-flash"), 
} as const ;

const SUPPORTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

const SYSTEM_PROMPTS = {
    image : "you turn images into text . if it is a photo of a document , transcribe it . if it is not describe it ",
    pdf : "extract text from a pdf ",
    html : "extract text from html ",
};

export type ExtractTextContentArgs ={
    storageId:Id<"_storage">;
    bytes?: ArrayBuffer;
    filename: string;
    mimetype: string;
};

/**
 * Extracts text content from a stored file based on its MIME type.
 * Supports images, PDFs, and plain/HTML text.
 * @param ctx - The Convex context containing the storage writer.
 * @param args - Arguments containing the storage ID, filename, and MIME type.
 * @returns A promise that resolves to the extracted text.
 */
export  async function extractTextContent(
    ctx : { storage : StorageActionWriter},
    args : ExtractTextContentArgs,
):Promise<string>{
    const { storageId , filename , bytes , mimetype }= args;
    const url = await ctx.storage.getUrl(storageId);
    assert(url, "url is required");
    
    const mt = mimetype.toLowerCase();
    if ( SUPPORTED_IMAGE_TYPES.some((type)=>type === mt)){
        return await extractImageText(url);
    }
    if ( mt === "application/pdf"){
        return extractPdfText(url, mimetype , filename);
    }
    if ( mt.startsWith("text/")){
        return extractTextFileContent( ctx , storageId , filename , bytes , mimetype);
    }
    throw new Error (`unsupported mime type : ${mimetype}`);
}

/**
 * Extracts and transcribes text from text-based files like plain text or HTML.
 * Uses an AI model to transcribe non-plain text exactly.
 * @param ctx - The Convex context containing the storage writer.
 * @param storageId - The Convex storage ID of the file.
 * @param filename - The name of the file.
 * @param bytes - Optional array buffer of the file contents.
 * @param mimeType - The MIME type of the file.
 * @returns A promise that resolves to the extracted text.
 */
async function extractTextFileContent(
    ctx : { storage : StorageActionWriter},
    storageId:Id<"_storage">,
    filename: string,
    bytes: ArrayBuffer| undefined,
    mimeType : string,
) : Promise<string>{
    const arrayBuffer = bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());
    if ( !arrayBuffer){
        throw new Error("failed to get the file content ");
    }

    const text = new TextDecoder().decode(arrayBuffer);
    if (mimeType.toLowerCase() === "text/html")
    {
        const result = await generateText({
            model : AI_MODELS.html,
            system : SYSTEM_PROMPTS.html,
            messages : [
                {
                    role : "user",
                    content : [
                        {type : "text" , text },
                    ],
                },
            ],
        });
        return result.text;
    }
    return text;
}

/**
 * Extracts text from a PDF file using a generative AI model.
 * @param url - The URL to the stored PDF file.
 * @param mimetype - The MIME type of the file (usually application/pdf).
 * @param filename - The name of the PDF file.
 * @returns A promise that resolves to the transcribed text.
 */
async function extractPdfText(url :string , mimetype : string , filename : string) : Promise<string> {
    const result = await generateText({
        model : AI_MODELS.pdf,
        system : SYSTEM_PROMPTS.pdf,
        messages : [
            {
                role : "user",
                content : [
                    {type : "file" , data : new URL(url), filename:filename, mediaType:mimetype },
                    {
                        type : "text",
                        text : ` ${SYSTEM_PROMPTS.pdf}\n\n Transcribe the text exactly . do not add any explanation or preamble . `
                    }
                ],
            },
        ],
    });
    return result.text;
}

/**
 * Extracts text from an image file using a generative AI model.
 * @param url - The URL to the stored image.
 * @returns A promise that resolves to the transcribed text or image description.
 */
async function extractImageText(url : string) : Promise<string>{
    const result =  await  generateText({
        model : AI_MODELS.image,
        system : SYSTEM_PROMPTS.image,
        messages : [
            {
                role: "user",
                content: [
                    {type:"image", image:new URL(url)},
                ],
            },
        ],
    });

    return result.text;
}