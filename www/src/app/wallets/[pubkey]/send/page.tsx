"use client";

import { useParams } from "next/navigation";
import { FaBitcoin, FaBolt, FaStar } from "react-icons/fa";
import Button from "@/app/components/button";

export default function WalletSend() {
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <Button kind="primary" href={`/wallets/${pubkey}/send-ln`}>
        <FaBolt />
        Send on Lightning
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}/send-spark`}>
        <FaStar />
        Send on Spark
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}/send-btc`}>
        <FaBitcoin />
        Send on Bitcoin
      </Button>
      <Button kind="secondary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </div>
  );
}
