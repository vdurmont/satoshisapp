"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/app/components/button";
import { FaSync } from "react-icons/fa";

export default function WalletSendSpark() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("0");
  const [idKey, setIdKey] = useState("");
  const params = useParams();
  const pubkey = params.pubkey as string;
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col gap-4 mt-10">
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
      </div>
      <Button
        kind="primary"
        disabled={loading || !idKey || !amount}
        onClick={() => {
          setLoading(true);
          const sparkWallet = new SparkWallet(Network.REGTEST);
          sparkWallet.initWallet(pubkey).then(() => {
            const receiverPubKey = Uint8Array.from(Buffer.from(idKey, "hex"));
            sparkWallet
              .sendTransfer({
                amount: amount ? parseInt(amount) : undefined,
                receiverPubKey,
              })
              .then(() => {
                router.push(`/wallets/${pubkey}`);
              });
          });
        }}
      >
        {loading ? <FaSync className="animate-spin" /> : null}
        Send transfer
      </Button>
      <Button kind="secondary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </div>
  );
}
