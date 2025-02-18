'use client'

import React, { useState, useEffect } from 'react';

import { FormEvent } from 'react'
import { sign } from './sign';
import Link from 'next/link'
import {useRouter} from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import {useCurrentSession} from "@/app/hooks/useCurrentSession";

export default function Login() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { session, status } = useCurrentSession();

    useEffect(() => {
        if (session?.user) setIsAuthenticated(true)
    }, [session]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setLoading(true)
        const formData = new FormData(event.currentTarget)
        try {
            await sign(formData.get('name') as string, formData.get('password') as string)
        } catch (error) {
            // show toast about error
            console.error(error)
        }

        }

    useEffect(() => {
        if (isAuthenticated) router.push('/')
    }, [router, isAuthenticated]);

    if (status === 'loading' || session?.user || loading) {
        return (
        <main className="flex min-h-full flex-col p-6 items-center justify-center h-[50%]">
            <ClipLoader color="#ffffff" size={150}/>
        </main>
        )
    } else {
        return (
            <main className="flex min-h-full flex-col p-6 items-center justify-center h-[50%]">
                <div
                    className="flex shrink-0 rounded-lg bg-blue-500 p-4 justify-center items-center w-2/5 h-[40%] shadow-lg shadow-gray-600">
                    <div className="flex items-center justify-center flex-col w-[100%] gap-4">
                        <span className="font-bold text-3xl">Login</span>
                        <form onSubmit={handleSubmit}
                              className="flex items-center justify-center flex-col w-[100%] gap-4">
                            <input className="rounded-lg h-10 w-[60%] text-black pl-2 hover:bg-gray-200"
                                   placeholder="Username" type="text" name="name"/>
                            <input className="rounded-lg h-10 w-[60%] text-black pl-2 hover:bg-gray-200"
                                   placeholder="Password" type="password" name="password"/>
                            <button
                                className="flex items-center gap-5 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200 md:text-base"
                            >
                                <span>Log in</span>
                            </button>
                            <span className="font-sans text-sm">No account yet? <Link href="/register"
                                                                                      className="text-blue-100 hover:text-blue-800">Register</Link></span>
                        </form>
                    </div>
                </div>
            </main>
        );
    }
}