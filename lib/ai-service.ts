import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { streamText, generateText, LanguageModel } from "ai";
import { prisma } from "./prisma";

export interface AIMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface ToolCall {
    toolCallId: string;
    toolName: string;
    args: any;
}

export interface ToolResult {
    toolCallId: string;
    toolName: string;
    result: any;
}

export interface AIResponse {
    content: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
    };
    toolCalls?: ToolCall[];
    toolResults?: ToolResult[];
    finishReason?: string;
}

// Available Google AI tools
const GOOGLE_TOOLS = {
    google_search: {
        id: "google_search",
        name: "Google Search",
        description: "Search the internet for current information",
        getTool: () => google.tools.googleSearch({}),
    },
    code_execution: {
        id: "code_execution",
        name: "Code Execution",
        description: "Execute Python code for calculations",
        getTool: () => google.tools.codeExecution({}),
    },
};

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

        // Use specified model or default to gemini-2.0-flash
        const selectedModel = modelId || "gemini-2.0-flash";

        // Create a custom provider instance with the API key
        const googleProvider = createGoogleGenerativeAI({ apiKey });
        this.model = googleProvider(selectedModel);
    }

    /**
     * Get enabled tools based on tool IDs
     */
    private getTools(enabledToolIds?: string[]) {
        if (!enabledToolIds || enabledToolIds.length === 0) {
            return undefined;
        }

        const tools: any = {};
        
        for (const toolId of enabledToolIds) {
            // Map CLI tool IDs to Google tool IDs
            let googleToolId = toolId;
            if (toolId === "web_search") googleToolId = "google_search";
            if (toolId === "calculator") googleToolId = "code_execution";
            if (toolId === "weather") googleToolId = "google_search"; // Use search for weather
            
            const toolConfig = GOOGLE_TOOLS[googleToolId as keyof typeof GOOGLE_TOOLS];
            if (toolConfig) {
                try {
                    tools[googleToolId] = toolConfig.getTool();
                    console.log(`[AI Service] Enabled tool: ${toolConfig.name}`);
                } catch (error) {
                    console.error(`[AI Service] Failed to enable tool ${toolConfig.name}:`, error);
                }
            }
        }

        return Object.keys(tools).length > 0 ? tools : undefined;
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
        onChunk?: (chunk: string) => void,
        enabledTools?: string[]
    ): Promise<AIResponse> {
        try {
            const tools = this.getTools(enabledTools);
            
            const streamConfig: any = {
                model: this.model,
                messages: messages,
                temperature: 0.7,
            };

            // Add tools if provided with maxSteps for multi-step tool calling
            if (tools) {
                streamConfig.tools = tools;
                streamConfig.maxSteps = 5; // Allow up to 5 tool call steps
                console.log(`[AI Service] Tools enabled: ${Object.keys(tools).join(", ")}`);
            }

            const result = streamText(streamConfig);

            let fullResponse = "";

            // Stream text chunks
            for await (const chunk of result.textStream) {
                fullResponse += chunk;
                if (onChunk) {
                    onChunk(chunk);
                }
            }

            // Await the full result to get usage info and tool calls
            const fullResult = await result;
            const usage = await fullResult.usage;

            // Collect tool calls and results from all steps
            const toolCalls: ToolCall[] = [];
            const toolResults: ToolResult[] = [];

            if (fullResult.steps && Array.isArray(fullResult.steps)) {
                for (const step of fullResult.steps) {
                    if (step.toolCalls && step.toolCalls.length > 0) {
                        for (const tc of step.toolCalls) {
                            toolCalls.push({
                                toolCallId: tc.toolCallId,
                                toolName: tc.toolName,
                                args: (tc as any).args,
                            });
                            console.log(`[AI Service] Tool called: ${tc.toolName}`, (tc as any).args);
                        }
                    }

                    if (step.toolResults && step.toolResults.length > 0) {
                        for (const tr of step.toolResults) {
                            toolResults.push({
                                toolCallId: tr.toolCallId,
                                toolName: tr.toolName,
                                result: (tr as any).result,
                            });
                            console.log(`[AI Service] Tool result from: ${tr.toolName}`);
                        }
                    }
                }
            }

            return {
                content: fullResponse,
                usage: {
                    inputTokens: usage.inputTokens || 0,
                    outputTokens: usage.outputTokens || 0,
                    totalTokens: usage.totalTokens || 0,
                },
                toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                toolResults: toolResults.length > 0 ? toolResults : undefined,
                finishReason: fullResult.finishReason as any,
            };
        } catch (error) {
            console.error("AI Service Error:", error);
            throw new Error("Failed to get AI response");
        }
    }

    /**
     * Get a non-streaming response
     */
    async sendMessage(messages: AIMessage[], enabledTools?: string[]): Promise<AIResponse> {
        try {
            const tools = this.getTools(enabledTools);
            
            const generateConfig: any = {
                model: this.model,
                messages: messages,
                temperature: 0.7,
            };

            if (tools) {
                generateConfig.tools = tools;
                generateConfig.maxSteps = 5;
                console.log(`[AI Service] Tools enabled: ${Object.keys(tools).join(", ")}`);
            }

            const result = await generateText(generateConfig);

            // Collect tool calls and results
            const toolCalls: ToolCall[] = [];
            const toolResults: ToolResult[] = [];

            if (result.steps && Array.isArray(result.steps)) {
                for (const step of result.steps) {
                    if (step.toolCalls && step.toolCalls.length > 0) {
                        for (const tc of step.toolCalls) {
                            toolCalls.push({
                                toolCallId: tc.toolCallId,
                                toolName: tc.toolName,
                                args: (tc as any).args,
                            });
                        }
                    }

                    if (step.toolResults && step.toolResults.length > 0) {
                        for (const tr of step.toolResults) {
                            toolResults.push({
                                toolCallId: tr.toolCallId,
                                toolName: tr.toolName,
                                result: (tr as any).result,
                            });
                        }
                    }
                }
            }

            return {
                content: result.text,
                usage: {
                    inputTokens: result.usage.inputTokens || 0,
                    outputTokens: result.usage.outputTokens || 0,
                    totalTokens: result.usage.totalTokens || 0,
                },
                toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                toolResults: toolResults.length > 0 ? toolResults : undefined,
                finishReason: result.finishReason as any,
            };
        } catch (error) {
            console.error("AI Service Error:", error);
            throw new Error("Failed to get AI response");
        }
    }
}
