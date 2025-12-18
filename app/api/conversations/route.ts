import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { chatService } from "@/lib/chat-service";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const conversations = await chatService.getUserConversations(session.user.id);

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error("Conversations API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch conversations" },
            { status: 500 }
        );
    }
}
