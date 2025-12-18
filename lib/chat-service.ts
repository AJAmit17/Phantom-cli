import { prisma } from "./prisma";

export interface CreateConversationInput {
  userId: string;
  mode?: "chat" | "tool" | "agent";
  title?: string;
}

export interface AddMessageInput {
  conversationId: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}

export class ChatService {
  /**
   * Create a new conversation
   */
  async createConversation({
    userId,
    mode = "chat",
    title,
  }: CreateConversationInput) {
    return await prisma.conversation.create({
      data: {
        userId,
        mode,
        title: title || `New ${mode} conversation`,
      },
      include: {
        messages: true,
      },
    });
  }

  /**
   * Get or create a conversation for user
   */
  async getOrCreateConversation(
    userId: string,
    conversationId: string | null = null,
    mode: "chat" | "tool" | "agent" = "chat"
  ) {
    if (conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId,
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (conversation) return conversation;
    }

    // Create new conversation if not found or not provided
    return await this.createConversation({ userId, mode });
  }

  /**
   * Add a message to conversation
   */
  async addMessage({ conversationId, role, content }: AddMessageInput) {
    // Convert content to JSON string if it's an object
    const contentStr =
      typeof content === "string" ? content : JSON.stringify(content);

    return await prisma.message.create({
      data: {
        conversationId,
        role,
        content: contentStr,
      },
    });
  }

  /**
   * Get conversation messages
   */
  async getMessages(conversationId: string) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return messages.map((msg) => ({
      ...msg,
      content: this.parseContent(msg.content),
    }));
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string) {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Get a single conversation with messages
   */
  async getConversation(conversationId: string, userId: string) {
    return await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string, userId: string) {
    return await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userId,
      },
    });
  }

  /**
   * Update conversation title
   */
  async updateTitle(conversationId: string, title: string) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: { 
        title,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Helper to parse content (JSON or string)
   */
  private parseContent(content: string): string | object {
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }

  /**
   * Format messages for AI SDK
   */
  formatMessagesForAI(messages: any[]) {
    return messages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content:
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content),
    }));
  }
}

export const chatService = new ChatService();
