"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <h2 className="text-xl sm:text-2xl text-center mb-2 max-w-xs sm:max-w-md">
        ₿itcoin forever. A wallet for the future.
      </h2>
      <div className="flex flex-col gap-4 mt-10">
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/wallets"
        >
          Your wallet(s)
        </Link>
        <Link
          className="rounded-full border border-solid border-black transition-colors flex items-center justify-center bg-white text-black gap-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/features"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
