"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { Address } from "@buildonspark/spark-js-sdk/proto/spark";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";

export default function WalletDeposit() {
  const [address, setAddress] = useState<Address | null>(null);
  const [copyText, setCopyText] = useState("Copy address to clipboard");
  const params = useParams();
  const pubkey = params.pubkey as string;

  useEffect(() => {
    if (!pubkey) {
      return;
    }
    const sparkWallet = new SparkWallet(Network.REGTEST);
    sparkWallet.createSparkWalletFromSeed(pubkey).then(() => {
      sparkWallet.getMasterPubKey().then((masterPubKey) => {
        sparkWallet.generateDepositAddress(masterPubKey).then((res) => {
          setAddress(res.depositAddress);
        });
      });
    });
  }, [setAddress]);

  if (!address) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <p>
          You can use this address to safely deposit BTC into your wallet. Your
          balance will increase when the deposit is confirmed!
        </p>
        <p className="break-words max-w-[250px]">
          <b>Address:</b> {address.address}
        </p>
        <p className="break-words max-w-[250px]">
          <b>Verifying Key:</b>{" "}
          {Buffer.from(address.verifyingKey).toString("hex")}
        </p>
      </div>
      <a
        className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`/wallets/${pubkey}`}
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(address.address).then(() => {
            setCopyText("Copied!");
            setTimeout(() => {
              setCopyText("Copy address to clipboard");
            }, 2000);
          });
        }}
      >
        {copyText}
      </a>
      <a
        className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`/wallets/${pubkey}`}
      >
        Go back
      </a>
    </div>
  );
}
