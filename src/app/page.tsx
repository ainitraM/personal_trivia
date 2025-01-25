'use client';

import React, {useEffect, useState} from 'react';
import useSWR, { mutate } from 'swr';
import {useCurrentSession} from "@/app/hooks/useCurrentSession";
import ClipLoader from "react-spinners/ClipLoader";
import {createGameRoom, joinGameRoom} from "@/app/game";

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
    const [playerName, setPlayerName] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [roomCode, setRoomCode] = useState('');
    // const [userAnswer, setUserAnswer] = useState('');

    const { session } = useCurrentSession();
    const { data, error } = useSWR(
        roomCode ? `/api/game/${roomCode}` : null,
        fetcher,
        { refreshInterval: 2000 }
    );

    useEffect(() => {
        if (session) {
            setPlayerName(session.user.nickname || 'Random');
            setPlayerId(session.user.id);
        }
        console.log(data)
    }, [session, data])



    const handleCreateRoom = async () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(code);

        try {
            const response = await createGameRoom(code, playerId)
            const joined = await joinGameRoom(code, playerName)
            console.log(response)
            console.log(joined)
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const handleJoinRoom = async () => {
        if (playerName.trim() && roomCode.trim()) {
            await joinGameRoom(roomCode, playerName)
            console.log('data', data)
            console.error('data', data)
            mutate(`/api/game/${roomCode}`);
        }
    };

    // const handleStartGame = async () => {
    //     await fetch(`/api/game/${roomCode}`, {
    //         method: 'PUT',
    //     });
    //     mutate(`/api/game/${roomCode}`);
    // };

    // const handleSubmitAnswer = async () => {
    //     if (userAnswer) {
    //         await fetch(`/api/game/${roomCode}`, {
    //             method: 'PATCH',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ player: playerName, answer: userAnswer }),
    //         });
    //         setUserAnswer('');
    //         mutate(`/api/game/${roomCode}`);
    //     }
    // };

    if (error) return <div>Error loading game state</div>;

    if (!session) return (
        <div className="flex h-screen justify-center items-center">
            <ClipLoader color="#ffffff" size={150}/>
        </div>
    )

    return (
        <div>
            <h1>Trivia Game</h1>

                <div>
                    <button onClick={handleCreateRoom}>Create Room</button>
                    <input
                        type="text"
                        placeholder="Enter Room Code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                    />
                    <button onClick={handleJoinRoom}>Join Room</button>
                </div>

            {data && data.players && data.players.length > 0 && (
                <div>
                    <h2>Room Code: {roomCode}</h2>
                    <ul>
                        {data.players?.map((player: { id: string; name: string; roomId: string }, idx: number) => (
                            <li key={player.id || idx}>{player.name}</li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
}
