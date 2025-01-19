"use client";
import React, { useEffect } from 'react';

import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import {useCurrentSession} from "@/app/hooks/useCurrentSession";

type SessionProviderProps = React.PropsWithChildren<{
    session?: Session | null;
    status?: string;
}>;

const sessionContext = React.createContext<{ session: Session | null; status: string } | null>(null);

export function Provider({ children }: SessionProviderProps) {
    // Workaround about issue with useSession described on https://github.com/nextauthjs/next-auth/discussions/5719
    const { session, status } = useCurrentSession();

    const router = useRouter();

    useEffect(() => {
        if((!session?.user || status === 'unauthenticated') && status !== 'loading') router.push('/login')
    }, [session, router, status])


    if (status !== "authenticated")
        return (
            <html>
                <body>
                    <div className="flex h-screen justify-center items-center">
                        <ClipLoader color="#ffffff" size={150}/>
                    </div>
                </body>
            </html>

        )
    else {
        return <sessionContext.Provider value={{session, status}}>{children}</sessionContext.Provider>;
    }
}

export function useSession() {
    return React.useContext(sessionContext);
}