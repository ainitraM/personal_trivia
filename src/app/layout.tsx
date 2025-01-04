import React from 'react'

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Personal Trivia",
  description: "Team game for Huskies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`bg-white text-gray-800 ${inter.className}`}>
            <body className="flex h-screen items-center justify-center">
                <main className="flex-grow h-screen overflow-hidden">
                    {children}
                </main>
            </body>
        </html>
    );
}