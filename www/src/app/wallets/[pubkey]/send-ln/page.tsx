"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";

export default function WalletSendLn() {
  const [copyText, setCopyText] = useState("Copy invoice to clipboard");
  const [amount, setAmount] = useState("0");
  const [invoice, setInvoice] = useState("");
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      {invoice ? null : (
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <p>
            Use this form to pay a Lightning Network invoice from your wallet.
          </p>
          <label className="block">
            Amount (sats, optional)
            <input
              type="number"
              placeholder="Amount (sats)"
              className="border border-gray-300 rounded p-2 w-full text-black"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="block">
            Lightning Invoice
            <textarea
              placeholder="Lightning Invoice"
              className="border border-gray-300 rounded p-2 w-full text-black"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
            />
          </label>
        </div>
      )}
      <a
        className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          const sparkWallet = new SparkWallet(Network.REGTEST);
          sparkWallet.createSparkWalletFromSeed(pubkey).then(() => {
            sparkWallet
              .payLightningInvoice({
                amountSats: amount ? parseInt(amount) : undefined,
                invoice,
              })
              .then(() => {
                console.log("Invoice paid");
              });
          });
        }}
      >
        Pay invoice
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
