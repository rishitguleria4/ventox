import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { StorageActionWriter
 } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
    image : google.chat("gemini-2.0-flash"),
    pdf : google.chat("gemini-2.0-flash"),
    html :google.chat ("gemini-2.0-flash"), 
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

export type ExtractTexTContentArgs ={
    storageId:Id<"_storage">;
    bytes?: ArrayBuffer;
    filename: string;
    mimetype: string;
};

export  async function extractTextContent(
    ctx : { storage : StorageActionWriter},
    args : ExtractTexTContentArgs,
):Promise<string>{
    const { storageId , filename , bytes , mimetype }= args;
    const url = await ctx.storage.getUrl(storageId);
    assert(url, "url is required");
    if ( SUPPORTED_IMAGE_TYPES.some((type)=>type === mimetype)){
        return await extractImageText(url);
    }
    if ( mimetype.toLowerCase().includes("pdf")){
        return extractPdfText(url, mimetype , filename);
    }
    if ( mimetype.toLowerCase().includes("text")){
        return extractTextFileContent( ctx , storageId , filename , bytes , mimetype);
    }
    throw new Error (`unsupported mime type : ${mimetype}`);
}

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
    if (mimeType.toLowerCase() !== "text/plain")
    {
        const result = await generateText({
            model : AI_MODELS.html,
            system : SYSTEM_PROMPTS.html,
            messages : [
                {
                    role : "user",
                    content : [
                        {type : "text" , text },
                        {
                            type : "text",
                            text : ` ${SYSTEM_PROMPTS.html}\n\n Transcribe the text exactly . do not add any explanation or preamble . `
                        }
                    ],
                },
            ],
        });
        return result.text;
    }
    return text;
} 

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