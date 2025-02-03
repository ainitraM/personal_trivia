'use client';

import React, {FormEvent, useEffect, useState} from 'react';
import useSWR, { mutate } from 'swr';
import {useCurrentSession} from "@/app/hooks/useCurrentSession";
import ClipLoader from "react-spinners/ClipLoader";
import {
    createGameRoom,
    exitGameRoom,
    joinGameRoom,
    nextGameRound,
    setIsGameLoadingState,
    startNewGame
} from "@/app/game";
import {GameTrivia} from "@/app/types";


const mock_trivia: GameTrivia[] = [
    {
        id: '1',
        question: 'What is 1+1?',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        answer: '2'
    },
    {
        id: '2',
        question: 'What is 2+2?',
        1: '1',
        2: '10',
        3: '4',
        4: '5',
        answer: '3'
    },
    {
        id: '3',
        question: 'What is 3+4?',
        1: '12',
        2: '1',
        3: '44',
        4: '55',
        answer: '5'
    }
]

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
    const [userId, setUserId] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [round, setRound] = useState(0);
    const [isRoomCodeInputVisible, setIsRoomCodeInputVisible] = useState<boolean>(false)
    const [isGameLoading, setIsGameLoading] = useState<boolean>(false)
    const [timer, setTimer] = useState(10)
    const [triviaSet, setTriviaSet] = useState<GameTrivia[]>()
    const [showNextRoundButton, setShowNextRoundButton] = useState<boolean>(false)
    const [userAnswer, setUserAnswer] = useState<string | undefined>()
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<number>(2) // 0 - incorrect, 1 - correct, 2 - game ongoing
    const [blinking, setBlinking] = useState(false)

    const { session } = useCurrentSession();
    const { data, error } = useSWR(
        roomCode ? `/api/game/${roomCode}` : null,
        fetcher,
        { refreshInterval: 500 }
    );

    useEffect(() => {
        if (session) {
            setUserId(session.user.id);
            setIsAnswerCorrect(2)
        }
    }, [session, data])

    useEffect(() => {
        if (data) {
            setIsGameLoading(data.gameLoading)
            if(!triviaSet && data?.triviaSet) {
                console.log(data)
                setTriviaSet(JSON.parse(data.triviaSet))
            }
            if (round < data.round) {
                console.log('Changing round', round)
                setIsAnswerCorrect(2)
                setUserAnswer(undefined)
                setTimer(10)
            }
            setRound(data.round)
        }
    }, [data, round]);

    const handleCreateRoom = async () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(code);
        setIsGameLoading(true)
        try {
            const response = await createGameRoom(code, userId)
            const joined = await joinGameRoom(code, userId)
            console.log(response)
            console.log(joined)
            await mutate(`/api/game/${roomCode}`);
            setIsGameLoading(false)
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const handleJoinRoom = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const enteredRoomCode = formData.get("roomCode") as string

        setRoomCode(enteredRoomCode)

        if (userId && enteredRoomCode.trim()) {
            setIsGameLoading(true)
            await joinGameRoom(enteredRoomCode, userId)
            await mutate(`/api/game/${enteredRoomCode}`)
            setIsGameLoading(false)
        }
    };

    const handleExitRoom = async () => {
        if (userId && roomCode.trim()) {
            await exitGameRoom(roomCode, userId)
            window.location.reload()
        }
    }

    const startGame = async () => {
        console.log('game starting')
        // const trivia: Trivia[] = []
        // for (const player of data.players) {
        //     const triviaSet = await getTrivia(player.id)
        //     triviaSet.forEach((individualTrivia) => {
        //         trivia.push(individualTrivia.trivia)
        //     })
        // }

        if (mock_trivia) {
            setIsGameLoading(true)
            await setIsGameLoadingState(roomCode, true)
            await mutate(`/api/game/${roomCode}`, undefined, { revalidate: true })
            await startNewGame(roomCode, mock_trivia)
            await mutate(`/api/game/${roomCode}`, undefined, { revalidate: true })

        } else {
            console.log('empty triviaSet!!')
        }
        setIsGameLoading(false)
    }

    const handleNextRound = async () => {
        setShowNextRoundButton(false)
        setIsGameLoading(true)

        try {
            await setIsGameLoadingState(roomCode, true)
            await mutate(`/api/game/${roomCode}`, undefined, { revalidate: true })
            await nextGameRound(roomCode)
            await mutate(`/api/game/${roomCode}`, undefined, { revalidate: true })
        } catch (error) {
            console.error('Error progressing to the next round:', error)
        } finally {
            setIsGameLoading(false)
        }
    };

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

    useEffect(() => {
        if(data?.gameStarted) {
            if (timer > 0) {
                const countdown = setInterval(() => {
                    setTimer((prev) => prev - 1);
                }, 1000);
                return () => clearInterval(countdown); // Cleanup interval on component unmount or when timer changes
            }

            if (timer === 0) {
                const currentRound = triviaSet?.[round - 1];

                if (currentRound && userAnswer === currentRound.answer) {
                    setIsAnswerCorrect(1); // Answer is correct
                } else {
                    setIsAnswerCorrect(0); // Answer is incorrect
                }

                if (!blinking) {  // Prevent multiple blink triggers
                    setBlinking(true);
                    setTimeout(() => {
                        setBlinking(false);
                    }, 2000);
                }

                setShowNextRoundButton(true); // Show button for the next round
            }
        }
    }, [timer]);


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
            {data && data.players && data.players.length > 0 && !data.gameStarted && (
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
            {data && data.players && data.players.length > 0 && data.gameStarted && round > 0 && (
                <>
                    <h1>Round: {round}</h1>
                    {showNextRoundButton && <button onClick={handleNextRound}>Next round</button>}
                    <div className="text-2xl font-bold">Time Remaining: {timer}s</div>
                    <div className="flex justify-center items-center h-screen gap-10 flex-col">
                        {triviaSet && triviaSet.length >= round && triviaSet[round - 1]
                            ?
                            (<>
                                <h2 className="text-xl font-bold text-center">
                                    Question: {triviaSet[round - 1].question}
                                </h2>
                                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                    {['1', '2', '3', '4'].map((num) => {
                                        let buttonClass = "p-4 text-white rounded-lg transition bg-blue-500";
                                        console.log(isAnswerCorrect)
                                        if (userAnswer === num) {
                                            buttonClass = blinking
                                                ? "p-4 text-white rounded-lg transition bg-green-500 animate-blink"
                                                : isAnswerCorrect === 1
                                                    ? "p-4 text-white rounded-lg transition bg-green-500"
                                                    : isAnswerCorrect === 0
                                                        ? "p-4 text-white rounded-lg transition bg-red-500"
                                                        : "p-4 text-white rounded-lg transition bg-green-700";
                                        }

                                        return (
                                            <button
                                                key={num}
                                                onClick={() => {
                                                    setUserAnswer(num);
                                                }}
                                                className={buttonClass}
                                                disabled={timer===0}
                                            >
                                                {triviaSet[round - 1][num.toString()]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>)

                            :
                            <h2>End of game</h2>
                        }
                    </div>
                </>
            )}
            {isRoomCodeInputVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-300 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <form onSubmit={handleJoinRoom}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="roomCode"
                                    placeholder="Enter Room Code"
                                    className="text-black w-full h-20 text-4xl bg-gray-300"
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
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Join
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {(isGameLoading) && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-150">
                    <ClipLoader color="#ffffff" size={150}/>
                </div>
            )}
        </>
    );
}
