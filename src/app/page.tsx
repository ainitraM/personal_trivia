'use client';

import React, {useEffect, useState} from 'react';
import useSWR, { mutate } from 'swr';
import {useCurrentSession} from "@/app/hooks/useCurrentSession";
import ClipLoader from "react-spinners/ClipLoader";
import {createGameRoom, exitGameRoom, joinGameRoom, nextGameRound, startNewGame} from "@/app/game";
import {getTrivia} from "@/app/db";

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
    const [userId, setUserId] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [isRoomCodeInputVisible, setIsRoomCodeInputVisible] = useState<boolean>(false)
    const [isGameLoading, setIsGameLoading] = useState<boolean>(false)

    const [round, setRound] = useState(0);

    const { session } = useCurrentSession();
    const { data, error } = useSWR(
        roomCode ? `/api/game/${roomCode}` : null,
        fetcher,
        { refreshInterval: 1000 }
    );

    useEffect(() => {
        if (session) {
            setUserId(session.user.id);
        }
        console.log(data)
    }, [session, data])

    useEffect(() => {
        if (data) setRound(data.round)
    }, [data]);

    const handleCreateRoom = async () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(code);
        setIsGameLoading(true)
        try {
            const response = await createGameRoom(code, userId)
            const joined = await joinGameRoom(code, userId)
            console.log(response)
            console.log(joined)
            setIsGameLoading(false)
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const handleJoinRoom = async () => {
        // error message about invalid roomCode
        if (userId && roomCode.trim()) {
            await joinGameRoom(roomCode, userId)
            console.log('data', data)
            console.error('data', data)
            mutate(`/api/game/${roomCode}`);
        }
    };

    const handleExitRoom = async () => {
        if (userId && roomCode.trim()) {
            await exitGameRoom(roomCode, userId)
            window.location.reload()
        }
    }

    const startGame = async () => {
        const trivia: string[] = []
        for (const player of data.players) {
            const triviaSet = await getTrivia(player.id)
            triviaSet.forEach((individualTrivia) => {
                trivia.push(individualTrivia.trivia)
            })
        }
        console.log(trivia)
        await startNewGame(roomCode, trivia)
    }

    const handleNextRound = async () => {
        await nextGameRound(roomCode)
        mutate(`/api/game/${roomCode}`);
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isRoomCodeInputVisible) {
                setIsRoomCodeInputVisible(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRoomCodeInputVisible]);


    if (error) return <div>Error loading game state</div>;

    if (!session) return (
        <div className="flex h-screen justify-center items-center">
            <ClipLoader color="#ffffff" size={150}/>
        </div>
    )



    return (
        <>
            {!data && (
                <div className="flex justify-center items-center h-screen gap-10">
                    <button className="w-60 h-40 bg-blue-500 rounded content-center text-center hover:scale-105 text-xl" onClick={handleCreateRoom}>
                        Create Room
                    </button>
                    <button className="w-60 h-40 bg-blue-500 rounded content-center text-center hover:scale-105 text-xl" onClick={() => setIsRoomCodeInputVisible(true)}>
                       Join Room
                    </button>
                </div>
            )}
            {data && data.players && data.players.length > 0 && (
                <div className="flex justify-center items-center h-screen gap-10">
                    <button className="w-60 h-40 bg-blue-500 rounded content-center text-center hover:scale-105 text-xl" onClick={()=> handleExitRoom()}>Exit room</button>
                    <button className="w-60 h-40 bg-blue-500 rounded content-center text-center hover:scale-105 text-xl" onClick={startGame}>Start game</button>
                <h2>Room Code: {roomCode}</h2>
                    <ul>
                    {data.players?.map((player: { id: string; name: string; roomId: string }, idx: number) => (
                            <li key={player.id || idx}>{player.name}</li>
                        ))}
                    </ul>

                </div>
            )}
            {isRoomCodeInputVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-300 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Enter Room Code"
                                value={roomCode}
                                className="text-black w-full h-20 text-4xl bg-gray-300"
                                onChange={(e) => setRoomCode(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsRoomCodeInputVisible(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                                type="button"
                                onClick={() => handleJoinRoom()}>
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isGameLoading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-150">
                    <ClipLoader color="#ffffff" size={150}/>
                </div>
            )}
            {data && data.gameStarted && (
                <div>
                    <div>Round: {round}</div>
                    <button onClick={()=>{handleNextRound()}}>Next round</button>
                </div>
            )}
        </>
    );
}
