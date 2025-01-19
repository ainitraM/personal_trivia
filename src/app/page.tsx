'use client'
import React, {useEffect, useState} from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import {useRouter} from "next/navigation";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {useCurrentSession} from "@/app/hooks/useCurrentSession";
import { BsArrowLeftShort } from 'react-icons/bs'
import { VscAccount  } from "react-icons/vsc";
import { FiLogOut } from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { IoIosHelpCircle } from "react-icons/io";


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
        router.push('/login')
    } else {
        console.error('Failed to sign out');
    }
}
export default function Home() {
    const { session, status } = useCurrentSession();
    const [ isOpen, setIsOpen ] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if((!session?.user || status === 'unauthenticated') && status !== 'loading') router.push('/login')
    }, [session, router, status])

    if (status !== "authenticated")
        return (
        <div className="flex h-screen justify-center items-center">
            <ClipLoader color="#ffffff" size={150}/>
        </div>
        )

    return (
        <div className="flex">
            <div className={`bg-blue-500 h-screen p-5 pt-8 ${isOpen ? "w-60" : "w-24"} relative duration-500`}>
                <BsArrowLeftShort
                    className={`z-40 bg-white text-black text-3xl rounded-full absolute -right-3 top-9 cursor-pointer border-dark-purple border ${!isOpen && "rotate-180"}`}
                    onClick={() => {
                        setIsOpen((prevState) => !prevState)
                    }}/>

                <ul className="flex flex-col">
                    <li key="1" className="flex-items-center gap-x-4 cursor-pointer p-2 flex">
                        <span className="block float-left">
                            <VscAccount className="text-4xl"/>
                        </span>
                        <span
                            className={`${
                                !isOpen && "opacity-0"
                            } text-base font-medium duration-500 transition-opacity content-center`}
                        >Profile</span>
                    </li>
                    <li key="2" className="flex-items-center gap-x-4 cursor-pointer p-2 flex">
                        <span className="block float-left">
                            <IoGameController className="text-4xl"/>
                        </span>
                        <span
                            className={`${
                                !isOpen && "opacity-0"
                            } text-base font-medium duration-500 transition-opacity content-center`}
                        >Gameplay</span>
                    </li>
                    <li key="3" className="flex-items-center gap-x-4 cursor-pointer p-2 flex">
                        <span className="block float-left">
                            <GiPlagueDoctorProfile className="text-4xl"/>
                        </span>
                        <span
                            className={`${
                                !isOpen && "opacity-0"
                            } text-base font-medium duration-500 transition-opacity content-center`}
                        >Trivias</span>
                    </li>
                    <li key="4" className="flex-items-center gap-x-4 cursor-pointer p-2 flex">
                        <span className="block float-left">
                            <IoIosHelpCircle className="text-4xl"/>
                        </span>
                        <span
                            className={`${
                                !isOpen && "opacity-0"
                            } text-base font-medium duration-500 transition-opacity content-center`}
                        >Help</span>
                    </li>
                </ul>
                <ul className="absolute bottom-8">
                    <li className="flex items-center gap-x-4 cursor-pointer p-2">
                        <FiLogOut className="text-4xl" onClick={() => manualSignOut(router)}/>
                        <span
                            className={`${
                                !isOpen && "opacity-0"
                            } text-base font-medium duration-500 transition-opacity content-center`}
                        >
                            Logout
                        </span>
                    </li>
                </ul>
            </div>
            <div> Home Page</div>
        </div>

    );
}