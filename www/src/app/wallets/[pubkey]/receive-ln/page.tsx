"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function WalletReceiveLn() {
  const [invoice, setInvoice] = useState<string | null>(null);
  const [copyText, setCopyText] = useState("Copy invoice to clipboard");
  const [amount, setAmount] = useState("0");
  const [memo, setMemo] = useState("");
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      {invoice ? null : (
        <div className="flex flex-col gap-4 mt-10">
          <p>
            Use this form to generate a Lightning Network invoice for receiving
            funds in your wallet.
          </p>
          <label className="block">
            Amount (sats)
            <input
              type="number"
              placeholder="Amount (sats)"
              className="border border-gray-300 rounded p-2 w-full text-black"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="block">
            Memo (optional)
            <textarea
              placeholder="Memo"
              className="border border-gray-300 rounded p-2 w-full text-black"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>
        </div>
      )}
      {invoice ? null : (
        <Link
          className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            const sparkWallet = new SparkWallet(Network.REGTEST);
            sparkWallet.createSparkWalletFromSeed(pubkey).then(() => {
              sparkWallet
                .createLightningInvoice({
                  amountSats: parseInt(amount),
                  memo,
                  expirySeconds: 3600,
                })
                .then((invoice) => {
                  setInvoice(invoice);
                });
            });
          }}
        >
          Create invoice
        </Link>
      )}
      {invoice ? (
        <div className="flex flex-col gap-4 mt-10">
          <p>Share this Lightning Network invoice with the sender!</p>
          <p className="break-words max-w-[250px]">{invoice}</p>
        </div>
      ) : null}
      {invoice ? (
        <Link
          className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-background text-foreground gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href={`/wallets/${pubkey}`}
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(invoice).then(() => {
              setCopyText("Copied!");
              setTimeout(() => {
                setCopyText("Copy invoice to clipboard");
              }, 2000);
            });
          }}
        >
          {copyText}
        </Link>
      ) : null}
      <Link
        className="rounded-full mt-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`/wallets/${pubkey}`}
      >
        Go back
      </Link>
    </div>
  );
}
