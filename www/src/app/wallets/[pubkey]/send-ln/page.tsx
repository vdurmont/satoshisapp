"use client";

import { SparkWallet } from "@buildonspark/spark-js-sdk";
import { Network } from "@buildonspark/spark-js-sdk/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";

export default function WalletSendLn() {
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
        <div className="flex flex-col gap-4 mt-10">
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
      <Button
        kind="primary"
        onClick={() => {
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
      </Button>
      <Button kind="secondary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </div>
  );
}
