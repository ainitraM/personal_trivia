'use client'
import React, {useEffect, useState} from 'react'
import { avataaars } from '@dicebear/collection';
import { createAvatar  } from '@dicebear/core';
import {updateAvatar, updateNickname} from "@/app/db";
import {useCurrentSession} from "@/app/hooks/useCurrentSession";
import ClipLoader from "react-spinners/ClipLoader";

function generateRandomAvatarOptions() {
    return {
        seed: Math.random().toString(36).substring(2, 15),
    };
}

export default function Profile() {
    const { session } = useCurrentSession();
    const [ avatarOptions, setAvatarOptions ] = useState(generateRandomAvatarOptions())
    const [nickname, setNickname] = useState(session?.user.nickname || 'not set');

    const handleChange = (e) => {
        setNickname(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (session) {
            updateNickname(session.user.id || '', nickname)
            session.user.nickname = nickname;
            console.log(session)
        }
    };

    // if session null add loading screen

    useEffect(() => {
        if (session && session.user.avatar) setAvatarOptions({seed: session.user.avatar})
        if (session && session.user.nickname) setNickname(session.user.nickname)
    }, [session]);

    const changeAvatar = () => {
        setAvatarOptions(generateRandomAvatarOptions())
    }
    const avatar =
         createAvatar(avataaars, {
            size: 512,
             ...avatarOptions,
        }).toDataUri();

    const saveAvatar = () => {
        if (session) {
            updateAvatar(session.user.id || '', avatarOptions.seed);
            session.user.avatar = avatarOptions.seed;
            console.log(session)
        }
    }

    const resetAvatar = () => {
        if (session && session.user.avatar) {
            setAvatarOptions({seed: session.user.avatar})
        }
    }

    if (!session) return (
        <div className="flex h-screen justify-center items-center">
            <ClipLoader color="#ffffff" size={150}/>
        </div>
    )
    return (
        <div className="flex h-screen justify-center items-center gap-40">
            <div className="h-72 w-72 bg-white rounded-full z-0 object-fit overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="Avatar" className="relative top-3"/>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-6">
                    <form onSubmit={handleSubmit}>
                       <label>
                            Nickname:
                        <input
                            type="text"
                            value={nickname}
                            onChange={handleChange}
                            className="bg-transparent"
                        />
                    </label>
                    <button type="submit">Change</button>
                </form>
            </div>
            <div className="flex gap-6"><span>Avatar: {avatarOptions.seed}</span>
                <button onClick={changeAvatar}>Change</button>
                <button onClick={resetAvatar}>Reset</button>
                    <button onClick={saveAvatar}>Save</button>
                </div>
            </div>

        </div>

    );
}