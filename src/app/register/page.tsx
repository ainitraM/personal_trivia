'use client'

import React, {FormEvent, useState} from "react";
import { useRouter } from "next/navigation";
import { createUser } from '../db';
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        const name = formData.get('name') as string;
        const password = formData.get('password') as string;
        try {
            await createUser(name, password);
            router.push('/login')
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-full flex-col p-6 items-center justify-center h-[50%]">
                <ClipLoader color="#ffffff" size={150}/>
            </main>
        )
    } else
        return (

        <main className="flex min-h-full flex-col p-6 items-center justify-center h-[50%]">
            <div
                className="flex shrink-0 rounded-lg bg-blue-500 p-4 justify-center items-center w-2/5 h-[40%] shadow-lg shadow-gray-600">
                <div className="flex items-center justify-center flex-col w-[100%] gap-4">
                    <span className="font-bold text-3xl">Register</span>
                    <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col w-[100%] gap-4">
                        <input className="rounded-lg h-10 w-[60%] text-black pl-2 hover:bg-gray-200"
                               placeholder="Username" type="text" name="name"/>
                        <input className="rounded-lg h-10 w-[60%] text-black pl-2 hover:bg-gray-200"
                               placeholder="Password" type="password" name="password"/>
                        <button
                            className="flex items-center gap-5 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200 md:text-base"
                        >
                            <span>Register</span>
                        </button>
                        <span className="font-sans text-sm">Already an user? <Link href="/login" className="text-blue-100 hover:text-blue-800">Login</Link></span>
                    </form>
                </div>
            </div>
        </main>
    )
}