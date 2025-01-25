'use server'

import prisma from '../lib/prisma';
import {NextResponse} from "next/server";

export async function createGameRoom(roomCode: string, hostId: string) {
    try {
        // Check if room already exists
        const existingRoom = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
        });

        if (existingRoom) {
            return NextResponse.json({ error: 'Room already exists' }, { status: 400 });
        }

        // Create a new game room
        const room = await prisma.gameRoom.create({
            data: {
                code: roomCode,
                hostId: hostId,
            },
        });

        if (room) {
            return room
        }

        return NextResponse.json({ error: 'Failed to create game room' }, { status: 500 });
    } catch (error) {
        console.error('Error creating game room:', error);
        return NextResponse.json({ error: 'Failed to create game room' }, { status: 500 });
    }
}

export async function joinGameRoom(roomCode: string, playerName: string) {
    try {
        // Check if the room exists
        const room = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
            include: { players: true }, // Include players for validation
        });

        console.log(room)

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Check if player already exists in the room
        const existingPlayer = room.players.find((player) => player.name === playerName);
        if (existingPlayer) {
            return NextResponse.json({ error: 'Player already in the room' }, { status: 400 });
        }

        // Add the player to the room
        return await prisma.player.create({
            data: {
                name: playerName,
                room: { connect: { id: room.id } },
            },
        });
    } catch (error) {
        console.error('Error joining game room:', error);
        return NextResponse.json({ error: 'Failed to join game room' }, { status: 500 });
    }
}