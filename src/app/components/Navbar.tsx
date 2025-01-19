'use client';
import React, { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { VscAccount } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { IoGameController } from 'react-icons/io5';
import { GiPlagueDoctorProfile } from 'react-icons/gi';
import { IoIosHelpCircle } from 'react-icons/io';
import { useRouter, usePathname  } from 'next/navigation';
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

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
        router.push('/login');
    } else {
        console.error('Failed to sign out');
    }
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/register') {
        return null; // Don't render the navbar if the user isn't authenticated or on login and register pages
    }

    return (
        <div
            className={`bg-blue-500 h-screen p-5 pt-8 ${
                isOpen ? 'w-60' : 'w-24'
            } relative duration-500`}
        >
            <BsArrowLeftShort
                className={`z-40 bg-white text-black text-3xl rounded-full absolute -right-3 top-9 cursor-pointer border-dark-purple border ${
                    !isOpen && 'rotate-180'
                }`}
                onClick={() => {
                    setIsOpen((prevState) => !prevState);
                }}
            />
            <ul className="flex flex-col">
                <li key="1" className="flex-items-center gap-x-4 cursor-pointer p-2 flex" onClick={() => router.push('/profile')}>
                    <span className="block float-left">
                        <VscAccount className="text-4xl"/>
                    </span>
                    <span
                        className={`${
                            !isOpen && 'opacity-0'
                        } text-base font-medium duration-400 transition-opacity content-center`}
                    >
                        Profile
                    </span>
                </li>
                <li key="2" className="flex-items-center gap-x-4 cursor-pointer p-2 flex">
                    <span className="block float-left">
                        <IoGameController className="text-4xl" />
                    </span>
                    <span
                        className={`${
                            !isOpen && 'opacity-0'
                        } text-base font-medium duration-400 transition-opacity content-center`}
                    >
                        Play
                    </span>
                </li>
                <li key="3" className="flex-items-center gap-x-4 cursor-pointer p-2 flex">
                    <span className="block float-left">
                        <GiPlagueDoctorProfile className="text-4xl" />
                    </span>
                    <span
                        className={`${
                            !isOpen && 'opacity-0'
                        } text-base font-medium duration-400 transition-opacity content-center`}
                    >
                        Trivias
                    </span>
                </li>
                <li key="4" className="flex-items-center gap-x-4 cursor-pointer p-2 flex">
                    <span className="block float-left">
                        <IoIosHelpCircle className="text-4xl" />
                    </span>
                    <span
                        className={`${
                            !isOpen && 'opacity-0'
                        } text-base font-medium duration-400 transition-opacity content-center`}
                    >
                        Help
                    </span>
                </li>
            </ul>
            <ul className="absolute bottom-8">
                <li className="flex items-center gap-x-4 cursor-pointer p-2" onClick={() => manualSignOut(router)} >
                    <FiLogOut className="text-4xl"/>
                    <span
                        className={`${
                            !isOpen && 'opacity-0'
                        } text-base font-medium duration-400 transition-opacity content-center`}
                    >
                        Logout
                    </span>
                </li>
            </ul>
        </div>
    );
}
