import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 /api/me - DEBUG INFO");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Log all headers
    console.log("\n📨 Request Headers:");
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = key.toLowerCase() === 'authorization' 
        ? value.substring(0, 30) + "..." 
        : value;
    });
    console.log(JSON.stringify(headers, null, 2));
    
    const authHeader = req.headers.get("authorization");
    console.log("\n🔑 Authorization Header:");
    console.log("  - Present:", !!authHeader);
    console.log("  - Type:", authHeader?.split(" ")[0] || "N/A");
    console.log("  - Token (first 30 chars):", authHeader?.substring(0, 30) + "..." || "N/A");

    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    console.log("\n📦 Session from Better Auth:");
    console.log(JSON.stringify(session, null, 2));

    if (!session) {
      console.log("\n❌ No active session found");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }
    
    console.log("\n✅ Session valid - returning user data");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return NextResponse.json(session);
  } catch (error) {
    console.error("\n❌ Session error:", error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}