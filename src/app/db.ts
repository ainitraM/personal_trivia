'use server'

import prisma from '../lib/prisma';
import { genSaltSync, hashSync } from 'bcrypt-ts';

export async function createUser(name: string, password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    // check is user with this name exists, if so, return message
    console.log(name)
    return prisma.user.create({
        data: {
            name: name,
            password: hash,
        },
    });
}