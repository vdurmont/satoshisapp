"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";

type Wallet = {
  sparkWallet: SparkWallet;
  balance: BigInt;
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
        setWallet({ sparkWallet, balance, pubkey });
      });
    });
  }, [setWallet]);

  if (!wallet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <p className="break-words max-w-[250px]">Pubkey: {wallet.pubkey}</p>
        <p>Balance: {String(wallet.balance)} sats</p>
      </div>
      <a
        className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`/wallets/${pubkey}/deposit`}
      >
        <FaArrowDown />
        Deposit from Bitcoin
      </a>
    </div>
  );
}
