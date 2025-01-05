import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { getUser } from './db';

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
                const user = await getUser(credentials.name);
                if (!user) return null;
                const passwordsMatch = await compare(credentials.password, user.password!);
                if (passwordsMatch) return user;
            }
        }),
    ],
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/home');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // better null handling
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/home', nextUrl));
            }

            return true;
        },
    },
});