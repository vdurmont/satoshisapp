"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import Page from "@/app/components/page";

export default function WalletReceiveLn() {
  const [invoice, setInvoice] = useState<string | null>(null);
  const [copyText, setCopyText] = useState("Copy invoice to clipboard");
  const [amount, setAmount] = useState("0");
  const [memo, setMemo] = useState("");
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <Page>
      {invoice ? null : (
        <>
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
        </>
      )}
      {invoice ? null : (
        <Button
          kind="primary"
          onClick={() => {
            const sparkWallet = new SparkWallet(Network.REGTEST);
            sparkWallet.initWallet(pubkey).then(() => {
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
        </Button>
      )}
      {invoice ? (
        <>
          <p>Share this Lightning Network invoice with the sender!</p>
          <p className="break-words max-w-[250px]">{invoice}</p>
        </>
      ) : null}
      {invoice ? (
        <Button
          kind="secondary"
          onClick={() => {
            navigator.clipboard.writeText(invoice).then(() => {
              setCopyText("Copied!");
              setTimeout(() => {
                setCopyText("Copy invoice to clipboard");
              }, 2000);
            });
          }}
        >
          {copyText}
        </Button>
      ) : null}
      <Button kind="primary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </Page>
  );
}
