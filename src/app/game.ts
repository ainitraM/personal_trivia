'use server';

import prisma from '../lib/prisma';

export async function createGameRoom(roomCode: string, hostId: string) {
    try {
        // Check if room already exists
        const existingRoom = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
        });

        if (existingRoom) {
            return 'Room already exists'
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
        return 'Failed to create game room'
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
            return 'Room not found'
        }

        // Check if the user is already in the room
        const existingUser = room.players.find((user) => user.id === userId);
        if (existingUser) {
            return 'User already in the room'
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
        return 'Failed to join game room'
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
            return 'Room not found'
        }

        // Check if the user is in the room
        const existingUser = room.players.find((user) => user.id === userId);
        if (!existingUser) {
            return 'User not in the room'
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
        return 'Failed to exit game room'
    }
}

export async function startNewGame(roomCode: string, trivia: string[]) {
    try {
        // Check if room already exists
        const room = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
            include: { players: true }, // Include players for validation
        });

        if (!room) {
            return 'Room doesn\'t exists'
        }

        // Start game
        return await prisma.gameRoom.update({
            where: { id: room.id },
            data: {
                gameStarted: true,
                triviaSet: trivia,
                round: 1
            },
        });

    } catch (error) {
        console.error('Error starting game:', error);
        return 'Failed to start game'
    }
}

export async function nextGameRound(roomCode: string) {
    try {
        // Check if room already exists
        const room = await prisma.gameRoom.findUnique({
            where: { code: roomCode },
            include: { players: true }, // Include players for validation
        });

        if (!room) {
            return 'Room doesn\'t exists'
        }

        // Start game
        return await prisma.gameRoom.update({
            where: { id: room.id },
            data: {
                round: room.round + 1
            },
        });

    } catch (error) {
        console.error('Error starting game:', error);
        return 'Failed to start game'
    }
}
