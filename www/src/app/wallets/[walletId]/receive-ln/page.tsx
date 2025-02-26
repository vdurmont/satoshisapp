"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import { getStoredWallet } from "@/app/storage";
import ButtonsContainer from "@/app/components/buttonsContainer";

export default function WalletReceiveLn() {
  const [invoice, setInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyText, setCopyText] = useState("Copy invoice to clipboard");
  const [amount, setAmount] = useState("0");
  const [memo, setMemo] = useState("");
  const params = useParams();
  const walletId = params.walletId as string;

  if (invoice === null) {
    return (
      <PageContainer>
        <p>
          Use this form to generate a Lightning Network invoice for receiving
          funds in your wallet.
        </p>
        <label className="block">
          Amount (sats)
          <input
            type="number"
            disabled={loading}
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
            disabled={loading}
            className="border border-gray-300 rounded p-2 w-full text-black"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>
        <ButtonsContainer>
          <Button
            loading={loading}
            kind="primary"
            onClick={() => {
              if (loading) {
                return;
              }
              setLoading(true);
              const sparkWallet = new SparkWallet(Network.REGTEST);
              const storedWallet = getStoredWallet(walletId);
              sparkWallet.initWallet(storedWallet.mnemonic).then(() => {
                sparkWallet
                  .createLightningInvoice({
                    amountSats: parseInt(amount),
                    memo,
                  })
                  .then((invoice) => {
                    setInvoice(invoice);
                  });
              });
            }}
          >
            {loading ? "Creating invoice..." : "Create invoice"}
          </Button>
          <Button kind="secondary" href={`/wallets/${walletId}`}>
            Go back
          </Button>
        </ButtonsContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <p>Share this Lightning Network invoice with the sender!</p>
      <p className="break-words max-w-[250px]">{invoice}</p>
      <ButtonsContainer>
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
        <Button kind="primary" href={`/wallets/${walletId}`}>
          Go back
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
}
