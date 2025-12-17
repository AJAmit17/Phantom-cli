import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        Application: "Phantom-CLI",
        status: "ok"
    });
}