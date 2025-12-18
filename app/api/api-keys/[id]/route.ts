import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// PATCH /api/api-keys/[id] - Update an API key
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, isActive, key, modelId } = body;

    // Verify the API key belongs to the user
    const existingKey = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingKey || existingKey.userId !== session.user.id) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (key !== undefined) updateData.key = key; // TODO: Encrypt in production
    if (modelId !== undefined) updateData.modelId = modelId;

    const apiKey = await prisma.apiKey.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        provider: true,
        modelId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys/[id] - Delete an API key
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the API key belongs to the user
    const existingKey = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingKey || existingKey.userId !== session.user.id) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
