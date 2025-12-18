import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, generateText, LanguageModel } from "ai";
import { prisma } from "./prisma";

export interface AIMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface AIResponse {
    content: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
    };
}

export class AIService {
    private model: LanguageModel;
    private userApiKey?: string;
    private userId?: string;

    constructor(userId?: string, userApiKey?: string, modelId?: string) {
        this.userId = userId;
        this.userApiKey = userApiKey;
        
        // Use user's API key if provided, otherwise fall back to system key
        const apiKey = userApiKey || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            throw new Error("No API key available. Please provide your own API key or contact support.");
        }

        // Use specified model or default to gemini-1.5-flash
        const selectedModel = modelId || "gemini-1.5-flash";

        // Create a custom provider instance with the API key
        const google = createGoogleGenerativeAI({ apiKey });
        this.model = google(selectedModel);
    }

    /**
     * Create an AIService instance with user's API key from database
     */
    static async forUser(userId: string): Promise<AIService> {
        const userApiKey = await prisma.apiKey.findFirst({
            where: {
                userId,
                provider: "google",
                isActive: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return new AIService(userId, userApiKey?.key, userApiKey?.modelId);
    }

    /**
     * Send a message and get streaming response
     */
    async sendMessageStream(
        messages: AIMessage[],
        onChunk?: (chunk: string) => void
    ): Promise<AIResponse> {
        try {
            const result = streamText({
                model: this.model,
                messages: messages,
                temperature: 0.7,
            });

            let fullResponse = "";

            // Stream text chunks
            for await (const chunk of result.textStream) {
                fullResponse += chunk;
                if (onChunk) {
                    onChunk(chunk);
                }
            }

            // Await the full result to get usage info
            const fullResult = await result;
            const usage = await fullResult.usage;

            return {
                content: fullResponse,
                usage: {
                    inputTokens: usage.inputTokens || 0,
                    outputTokens: usage.outputTokens || 0,
                    totalTokens: usage.totalTokens || 0,
                },
            };
        } catch (error) {
            console.error("AI Service Error:", error);
            throw new Error("Failed to get AI response");
        }
    }

    /**
     * Get a non-streaming response
     */
    async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
        try {
            const result = await generateText({
                model: this.model,
                messages: messages,
                temperature: 0.7,
            });

            return {
                content: result.text,
                usage: {
                    inputTokens: result.usage.inputTokens || 0,
                    outputTokens: result.usage.outputTokens || 0,
                    totalTokens: result.usage.totalTokens || 0,
                },
            };
        } catch (error) {
            console.error("AI Service Error:", error);
            throw new Error("Failed to get AI response");
        }
    }
}
