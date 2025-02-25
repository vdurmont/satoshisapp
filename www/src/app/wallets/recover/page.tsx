"use client";

import { useState } from "react";
import { validateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
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
        <Button
          kind="primary"
          onClick={() => {
            if (!validateMnemonic(mnemonic)) {
              alert("Invalid mnemonic phrase.");
              return;
            }

            addMnemonic(mnemonic);
            router.push("/wallets");
          }}
        >
          Recover
        </Button>
        <Button kind="secondary" href="/wallets">
          Go back
        </Button>
      </div>
    </div>
  );
}
