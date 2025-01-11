'use client'
import React, {useEffect} from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import {useRouter} from "next/navigation";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {useCurrentSession} from "@/app/hooks/useCurrentSession";

// Note: Logout works with a direct link to NextAuth's unbranded /api/auth/signout
// however signOut does not appear to work consistently (e.g. doesn't clear session) and may cause redirect loops
// hence manual session learning
async function fetchCsrfToken() {
    const response = await fetch('/api/auth/csrf');
    const data = await response.json();
    return data.csrfToken;
}

async function manualSignOut(router: AppRouterInstance | string[]) {
    const csrfToken = await fetchCsrfToken();

    const formData = new URLSearchParams();
    formData.append('csrfToken', csrfToken);
    formData.append('json', 'true');

    const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });

    if (response.ok) {
        console.log('Signed out successfully');
        router.push('/login')
    } else {
        console.error('Failed to sign out');
    }
}
export default function Home() {
    const { session, status } = useCurrentSession();
    const router = useRouter();

    useEffect(() => {
        if((!session?.user || status === 'unauthenticated') && status !== 'loading') router.push('/login')
    }, [session, router, status])

    return (
        <main className="flex min-h-full flex-col p-6 items-center justify-center h-[50%]">
            <div>
                {session?.user ? (
                    <div className="flex flex-col gap-5">
                        <h2>Logged as {session?.user?.name}</h2>
                        <button onClick={() => manualSignOut(router)}>Sign out</button>
                    </div>
                ) : (
                    <ClipLoader color="#ffffff" size={150}/>
                )}
            </div>
        </main>
    );
}