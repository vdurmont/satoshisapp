"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { clearMnemonics, getMnemonics } from "@/app/storage";
import Button from "@/app/components/button";

type Wallet = {
  sparkWallet: SparkWallet;
  balance: bigint;
  pubkey: string;
};

export default function Wallets() {
  const [wallets, setWallets] = useState<Array<Wallet>>([]);
  const router = useRouter();

  useEffect(() => {
    const mnemonics = getMnemonics();
    for (const mnemonic of mnemonics) {
      const sparkWallet = new SparkWallet(Network.REGTEST);
      sparkWallet.createSparkWallet(mnemonic).then((pubkey) => {
        sparkWallet.getBalance().then((balance) => {
          setWallets((w) =>
            w
              .concat([{ sparkWallet, balance: balance as bigint, pubkey }])
              .reduce((acc, cur) => {
                if (!acc.find((w) => w.pubkey === cur.pubkey)) {
                  acc.push(cur);
                }
                return acc;
              }, [] as Wallet[])
          );
        });
      });
    }
  }, [setWallets]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col gap-4 mt-10">
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
        <Button kind="primary" href="/wallets/new">
          Create a wallet
        </Button>
        <Button kind="primary" href="/wallets/recover">
          Recover a wallet
        </Button>
        <Button
          kind="secondary"
          onClick={() => {
            clearMnemonics();
            location.reload();
          }}
        >
          Clear wallets
        </Button>
      </div>
    </div>
  );
}
