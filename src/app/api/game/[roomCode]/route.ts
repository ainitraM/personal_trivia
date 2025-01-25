'use server';

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ roomCode: string }> },
) {
    const { roomCode } = await params; // Access params directly

    try {
        const room = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
            include: {
                players: true,
            },
        });

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json(room);
    } catch (error) {
        console.error('Error fetching game room:', error);
        return NextResponse.json({ error: 'Failed to fetch game room' }, { status: 500 });
    }
}
