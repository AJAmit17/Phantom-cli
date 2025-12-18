import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    
    let session;
    
    if (authHeader?.startsWith("Bearer ")) {
      // Extract token from Bearer header
      const token = authHeader.substring(7);
      
      // Create headers object with the token
      const headers = new Headers();
      headers.set("authorization", `Bearer ${token}`);
      
      // Get session using Better Auth API
      session = await auth.api.getSession({
        headers: headers,
      });
    } else {
      // Try to get session from cookies if no Bearer token
      session = await auth.api.getSession({
        headers: req.headers,
      });
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
