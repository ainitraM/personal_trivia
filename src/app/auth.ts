import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import {getTrivia, getUser} from './db';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                name: { label: "Name", type: "text", placeholder: "name" },
                password: { label: "Password", type: "password" }
            },
            id: "credentials",
            name: "Credentials",
            async authorize(credentials) {
                if (!credentials?.name || !credentials?.password) return null
                const typedCredentials = credentials as { name: string, password: string }
                const user = await getUser(typedCredentials.name);
                if (!user) return null;
                try {
                    const passwordsMatch = await compare(typedCredentials.password, user.password)
                    if (!passwordsMatch) {
                        return null; // Return null if the password does not match
                    }
                    if (passwordsMatch) return user;
                } catch (error) {
                    console.error('Problem with authentication')
                    throw error;
                }
                return null
            }
        }),
    ],
    pages: {
        signIn: "/",
        signOut: "/login",
        error: "/login",
    },
    callbacks: {
        async session({ session }) {
            const user = await getUser(session?.user?.name);
            if (user) {
                const trivia = await getTrivia(user?.id)
                session.user.nickname = user.nickname ?? undefined;
                session.user.id = user.id ?? '';
                session.user.avatar = user.avatar ?? undefined;
                session.trivia = trivia ?? [];
            }
            return session
        },
    },
});