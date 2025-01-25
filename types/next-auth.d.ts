// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"
import { type Trivia } from "@/app/types"

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            avatar?: string;
            nickname?: string;
        }
        trivia: Array<Trivia>
    }
}