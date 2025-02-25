"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";

export default function WalletReceiveSpark() {
  const [copyText, setCopyText] = useState("Copy address to clipboard");
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col gap-4 mt-10">
        <p>Use this Spark address to receive funds in your wallet.</p>
        <p className="break-words max-w-[250px]">{pubkey}</p>
      </div>
      <Button
        kind="secondary"
        onClick={() => {
          navigator.clipboard.writeText(pubkey).then(() => {
            setCopyText("Copied!");
            setTimeout(() => {
              setCopyText("Copy address to clipboard");
            }, 2000);
          });
        }}
      >
        {copyText}
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </div>
  );
}
