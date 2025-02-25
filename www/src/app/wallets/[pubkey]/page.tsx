"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Button from "@/app/components/button";

type Wallet = {
  sparkWallet: SparkWallet;
  balance: bigint;
  pubkey: string;
};

export default function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const params = useParams();
  const pubkey = params.pubkey as string;

  useEffect(() => {
    if (!pubkey) {
      return;
    }
    const sparkWallet = new SparkWallet(Network.REGTEST);
    sparkWallet.createSparkWalletFromSeed(pubkey).then(() => {
      sparkWallet.getBalance().then((balance) => {
        setWallet({ sparkWallet, balance: balance as bigint, pubkey });
      });
    });
  }, [pubkey, setWallet]);

  if (!wallet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col gap-4 mt-10">
        <p className="break-words max-w-[250px]">
          <b>Pubkey:</b> {wallet.pubkey}
        </p>
        <p>
          <b>Balance:</b> {String(wallet.balance)} sats
        </p>
      </div>
      <Button kind="primary" href={`/wallets/${pubkey}/send`}>
        <FaArrowUp />
        Send
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}/receive`}>
        <FaArrowDown />
        Receive
      </Button>
      <Button kind="secondary" href="/wallets">
        Go back to wallets
      </Button>
    </div>
  );
}
