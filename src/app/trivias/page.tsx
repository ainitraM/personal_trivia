'use client'
import React, { useState, useEffect } from 'react'
import {useCurrentSession} from "@/app/hooks/useCurrentSession";
import {createTrivia, getTrivia} from "@/app/db";
import { type Trivia } from "@/app/types"
import { CiSquarePlus } from "react-icons/ci";
import ClipLoader from "react-spinners/ClipLoader";

export default function Trivia() {
    const [trivia, setTrivia] = useState('')
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [isAddingTrivia, setIsAddingTrivia] = useState<boolean>(false)
    const { session } = useCurrentSession()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (session) {
            setIsAddingTrivia(true)
            setIsModalVisible(false)
            createTrivia(session.user.id, trivia).then(async () => {
                session.trivia = await getTrivia(session.user.id)
                setTrivia('')
                setIsAddingTrivia(false)
            })
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalVisible) {
                setIsModalVisible(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalVisible]);

    return (
        <div className="flex flex-col">
            <div className="p-8">
                <div className="flex flex-row gap-4 mb-6 items-center">
                <h2 className="text-4xl font-bold text-white p-2">List of Your Trivia</h2>
                    <CiSquarePlus className="size-10 hover:size-12" onClick={() => setIsModalVisible(true)} />
                </div>
                <ul className="space-y-2">
                    {session?.trivia.map((trivia: Trivia) => (
                        <li
                            key={trivia.id}
                            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-shadow"
                        >
                            <span className="text-gray-700">{trivia.trivia}</span>
                        </li>
                    ))}
                </ul>
                {isModalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4 text-black">Add New Trivia</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <textarea
                                        id="trivia"
                                        value={trivia}
                                        onChange={(e) => setTrivia(e.target.value)}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalVisible(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isAddingTrivia && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-150">
                        <ClipLoader color="#ffffff" size={150}/>
                    </div>
                )}
            </div>
        </div>
    );
}