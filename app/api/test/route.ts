import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const entries = await prisma.test.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(entries);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch entries' },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const entry = await prisma.test.create({
            data: {},
        });
        return NextResponse.json(entry);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create entry' },
            { status: 500 }
        );
    }
}
