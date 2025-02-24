"use client";

import { useState } from "react";
import { validateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addMnemonic } from "@/app/storage";

export default function RecoverWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col gap-4 mt-10">
        <p>Enter your mnemonic phrase below to recover your wallet.</p>
        <textarea
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          className="font-mono p-2 border border-gray-300 rounded w-full h-32 text-black"
        />
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="#"
          onClick={(e) => {
            e.preventDefault();

            if (!validateMnemonic(mnemonic)) {
              alert("Invalid mnemonic phrase.");
              return;
            }

            addMnemonic(mnemonic);
            router.push("/wallets");
          }}
        >
          Recover
        </Link>
        <Link
          className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/wallets"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
