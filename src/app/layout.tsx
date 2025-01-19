import React from 'react'

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { Provider } from "./provider";
import "./globals.css";
import {Navbar} from "@/app/components/Navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Personal Trivia",
  description: "Team game for Huskies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <Provider>
            <html lang="en-PL" className={`bg-white text-gray-800 ${inter.className}`}>
                <body className="flex h-screen">
                    <Navbar />
                    <main className="flex-grow h-screen overflow-hidden">{children}</main>
                </body>
            </html>
        </Provider>

    );
}