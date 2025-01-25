'use server'

import prisma from '../lib/prisma';
import { genSaltSync, hashSync } from 'bcrypt-ts';

export async function createUser(name: string, password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    // check is user with this name exists, if so, return message

    return prisma.user.create({
        data: {
            name: name,
            password: hash,
        },
    });
}

export async function createTrivia(authorId: string, trivia: string) {
    return prisma.trivia.create({
        data: {
            authorId: authorId,
            trivia: trivia,
        }
    })
}

export async function getTrivia(id: string) {
    return prisma.trivia.findMany({
        where: { authorId: id },
    });
}

export async function getUser(name: string) {
    return prisma.user.findFirst({
        where: { name: name },
    });
}

export async function updateAvatar(id: string, avatar: string) {
    return prisma.user.update({
        where: { id: id },
        data: {
            avatar: avatar,
        }
    });
}

export async function updateNickname(id: string, nickname: string) {
    return prisma.user.update({
        where: { id: id },
        data: {
            nickname: nickname,
        }
    });
}