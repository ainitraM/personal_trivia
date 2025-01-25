'use server';

import prisma from '../lib/prisma';
import { NextResponse } from 'next/server';

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
       return await prisma.gameRoom.create({
            data: {
                code: roomCode,
                hostId: hostId,
            },
        });

    } catch (error) {
        console.error('Error creating game room:', error);
        return NextResponse.json({ error: 'Failed to create game room' }, { status: 500 });
    }
}

export async function joinGameRoom(roomCode: string, userId: string) {
    try {
        // Check if the room exists
        const room = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
            include: { players: true }, // Include players for validation
        });

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Check if the user is already in the room
        const existingUser = room.players.find((user) => user.id === userId);
        if (existingUser) {
            return NextResponse.json({ error: 'User already in the room' }, { status: 400 });
        }

        // Add the user to the room
        return await prisma.gameRoom.update({
            where: { id: room.id },
            data: {
                players: {
                    connect: { id: userId }, // Connect the existing user to the room
                },
            },
        });

    } catch (error) {
        console.error('Error joining game room:', error);
        return NextResponse.json({ error: 'Failed to join game room' }, { status: 500 });
    }
}

export async function exitGameRoom(roomCode: string, userId: string) {
    try {
        // Check if the room exists
        const room = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
            include: { players: true }, // Include players for validation
        });

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Check if the user is in the room
        const existingUser = room.players.find((user) => user.id === userId);
        if (!existingUser) {
            return NextResponse.json({ error: 'User not in the room' }, { status: 400 });
        }

        // Remove the user from the room
        return await prisma.gameRoom.update({
            where: { id: room.id },
            data: {
                players: {
                    disconnect: { id: userId }, // Disconnect the user from the room
                },
            },
        });

    } catch (error) {
        console.error('Error exiting game room:', error);
        return NextResponse.json({ error: 'Failed to exit game room' }, { status: 500 });
    }
}
