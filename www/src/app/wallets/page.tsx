"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Wallet = {
  sparkWallet: SparkWallet;
  balance: BigInt;
  pubkey: string;
};

export default function Wallets() {
  const [wallets, setWallets] = useState<Array<Wallet>>([]);
  const router = useRouter();

  useEffect(() => {
    const rawMnemonics = localStorage.getItem("SATOSHIS_APP_MNEMONICS");
    const mnemonics = rawMnemonics ? JSON.parse(rawMnemonics) : [];
    for (const mnemonic of mnemonics) {
      const wallet = new SparkWallet(Network.REGTEST);
      wallet.createSparkWallet(mnemonic).then(() => {
        wallet.getBalance().then((balance) => {
          wallet.getMasterPubKey().then((masterPubKey) => {
            const pubkey = Buffer.from(masterPubKey).toString("hex");
            setWallets(
              wallets.concat([{ sparkWallet: wallet, balance, pubkey }])
            );
          });
        });
      });
    }
  }, [setWallets]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        {wallets.map((wallet, index) => (
          <div
            key={index}
            className="flex flex-row gap-2 cursor-pointer"
            onClick={() => {
              router.push(`/wallets/${wallet.pubkey}`);
            }}
          >
            <div className="flex flex-col">
              <p>{wallet.pubkey.substring(0, 20)}...</p>
              <p>Balance: {String(wallet.balance)} sats</p>
            </div>
            <div className="flex flex-col items-center justify-center ml-4">
              <FaArrowRight />
            </div>
          </div>
        ))}
        <a
          className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/wallets/new"
        >
          Create a wallet
        </a>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/wallets/recover"
        >
          Recover a wallet
        </a>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("SATOSHIS_APP_MNEMONICS");
            location.reload();
          }}
        >
          Clear wallets
        </a>
      </div>
    </div>
  );
}
