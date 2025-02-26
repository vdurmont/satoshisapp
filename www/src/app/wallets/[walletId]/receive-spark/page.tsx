"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import Loader from "@/app/components/loader";
import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { getStoredWallet } from "@/app/storage";

export default function WalletReceiveSpark() {
  const [pubkey, setPubkey] = useState<string | null>();
  const [copyText, setCopyText] = useState("Copy address to clipboard");
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) {
      return;
    }
    const sparkWallet = new SparkWallet(Network.REGTEST);
    const storedWallet = getStoredWallet(walletId);
    sparkWallet.initWallet(storedWallet.mnemonic).then(() => {
      sparkWallet.getSparkAddress().then((pubkey) => {
        setPubkey(pubkey);
      });
    });
  });

  if (!pubkey) {
    return (
      <PageContainer>
        <Loader />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <p>Use this Spark address to receive funds in your wallet.</p>
      <p className="break-words max-w-[250px]">{pubkey}</p>
      <Button
        kind="secondary"
        onClick={() => {
          navigator.clipboard.writeText(pubkey).then(() => {
            setCopyText("Copied!");
            setTimeout(() => {
              setCopyText("Copy address to clipboard");
            }, 2000);
          });
        }}
      >
        {copyText}
      </Button>
      <Button kind="primary" href={`/wallets/${walletId}`}>
        Go back
      </Button>
    </PageContainer>
  );
}
