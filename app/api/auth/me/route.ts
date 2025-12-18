import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // First try to get session from headers (cookies)
    let session = await auth.api.getSession({
      headers: await headers(),
    });

    // If no session from cookies, try Bearer token
    if (!session) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        
        // Try to get session using the token
        session = await auth.api.getSession({
          headers: new Headers({
            cookie: `better-auth.session_token=${token}`,
          }),
        });
      }
    }

    if (!session) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
