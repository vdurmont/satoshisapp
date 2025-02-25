"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import Page from "@/app/components/page";

export default function WalletSendLn() {
  const [amount, setAmount] = useState("0");
  const [invoice, setInvoice] = useState("");
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <Page>
      {invoice ? null : (
        <>
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
        </>
      )}
      <Button
        kind="primary"
        onClick={() => {
          const sparkWallet = new SparkWallet(Network.REGTEST);
          sparkWallet.initWallet(pubkey).then(() => {
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
    </Page>
  );
}
