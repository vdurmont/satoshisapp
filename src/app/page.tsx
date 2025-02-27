"use client";

import Button from "@/app/components/button";

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
        <Button kind="primary" href="/wallets">
          Your wallet(s)
        </Button>
        <Button kind="secondary" href="/features">
          Learn more
        </Button>
      </div>
    </div>
  );
}
