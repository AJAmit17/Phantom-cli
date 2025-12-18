import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { chatService } from "@/lib/chat-service";
import { AIService } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Get or create conversation
    const conversation = await chatService.getOrCreateConversation(
      userId,
      conversationId,
      "chat"
    );

    // Save user message
    const userMessage = await chatService.addMessage({
      conversationId: conversation.id,
      role: "user",
      content: message,
    });

    // Get conversation history for AI context
    const messages = await chatService.getMessages(conversation.id);
    const aiMessages = chatService.formatMessagesForAI(messages);

    // Get AI response with user's API key if available
    const aiService = await AIService.forUser(userId);
    const aiResponse = await aiService.sendMessage(aiMessages);

    // Save assistant message
    const assistantMessage = await chatService.addMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: aiResponse.content,
    });

    // Update conversation title if it's the first message
    if (messages.length === 1) {
      const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");
      await chatService.updateTitle(conversation.id, title);
    }

    return NextResponse.json({
      conversationId: conversation.id,
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      // Get specific conversation with messages
      const conversation = await chatService.getConversation(
        conversationId,
        session.user.id
      );

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(conversation);
    } else {
      // Get all conversations for user
      const conversations = await chatService.getUserConversations(session.user.id);
      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error("Chat GET API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    await chatService.deleteConversation(conversationId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat DELETE API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
