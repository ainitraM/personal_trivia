"use client";
import React, {useEffect, useState} from 'react';

import { Session } from "next-auth";
import { usePathname } from "next/navigation";

type SessionProviderProps = React.PropsWithChildren<{
    session?: Session | null;
}>;

const sessionContext = React.createContext<{ session: Session | null; loading: boolean } | null>(null);

export function Provider({ session: initialSession = null, children }: SessionProviderProps) {
    // Workaround about issue with useSession described on https://github.com/nextauthjs/next-auth/discussions/5719
    const [session, setSession] = React.useState<Session | null>(initialSession);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const fetchSession = async () => {
            if (!initialSession && loading) {
                const fetchedSession = await fetch("/api/auth/session").then((res) => res.json());
                setSession(fetchedSession);
                setLoading(false);
            }
        };

        fetchSession();
    }, [session, pathname]);

    return <sessionContext.Provider value={{ session, loading }}>{children}</sessionContext.Provider>;
}

export function useSession() {
    return React.useContext(sessionContext);
}