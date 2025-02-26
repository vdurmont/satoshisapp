"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import { getStoredWallet } from "@/app/storage";

export default function WalletSendSpark() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("0");
  const [idKey, setIdKey] = useState("");
  const params = useParams();
  const walletId = params.walletId as string;
  const router = useRouter();

  return (
    <PageContainer>
      <p>Use this form to send sats to a Spark wallet.</p>
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
        Receiver ID Key
        <textarea
          placeholder="Receiver ID Key"
          className="border border-gray-300 rounded p-2 w-full text-black"
          value={idKey}
          onChange={(e) => setIdKey(e.target.value)}
        />
      </label>
      <Button
        kind="primary"
        loading={loading}
        disabled={loading || !idKey || !amount}
        onClick={() => {
          setLoading(true);
          const sparkWallet = new SparkWallet(Network.REGTEST);
          const storedWallet = getStoredWallet(walletId);
          sparkWallet.initWallet(storedWallet.mnemonic).then(() => {
            sparkWallet
              .sendSparkTransfer({
                amount: parseInt(amount),
                receiverSparkAddress: idKey,
              })
              .then(() => {
                router.push(`/wallets/${walletId}`);
              });
          });
        }}
      >
        {loading ? "Sending..." : "Send transfer"}
      </Button>
      <Button kind="secondary" href={`/wallets/${walletId}`}>
        Go back
      </Button>
    </PageContainer>
  );
}
