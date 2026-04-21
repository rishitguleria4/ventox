import { google } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

/**
 * The initialized Retrieval-Augmented Generation (RAG) instance.
 * Configured to use the gemini-embedding-001 model with a dimension of 3072.
 */
const rag = new RAG(components.rag, {
    textEmbeddingModel: google.embedding("gemini-embedding-001"),
    embeddingDimension: 3072,
});
export default rag;
