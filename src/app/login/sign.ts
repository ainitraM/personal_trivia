'use server'

import { signIn } from "@/app/auth";

export const sign = async (name: string, password: string) => {
    return await signIn('credentials', {
        redirectTo: '/',
        name: name,
        password: password,
    });
}