import Link from 'next/link';

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-20 shrink-0 rounded-lg bg-blue-500 p-4 md:h-52 justify-center items-center">
                Nothing yet
            </div>
            <div className="mt-4 flex grow gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-[100%] md:px-20 items-center">
                    <Link
                        href="/login"
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        <span>Log in</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}