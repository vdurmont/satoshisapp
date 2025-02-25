"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Button from "@/app/components/button";
import Loader from "@/app/components/loader";
import Page from "@/app/components/page";

type Wallet = {
  sparkWallet: SparkWallet;
  balance: bigint;
  pubkey: string;
};

export default function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const params = useParams();
  const pubkey = params.pubkey as string;

  useEffect(() => {
    if (!pubkey) {
      return;
    }
    const sparkWallet = new SparkWallet(Network.REGTEST);
    sparkWallet.initWallet(pubkey).then(() => {
      sparkWallet.getBalance().then((balance) => {
        setWallet({ sparkWallet, balance: balance as bigint, pubkey });
      });
    });
  }, [pubkey, setWallet]);

  if (!wallet) {
    return (
      <Page>
        <Loader />
      </Page>
    );
  }

  return (
    <Page>
      <p className="break-words max-w-[250px]">
        <b>Pubkey:</b> {wallet.pubkey}
      </p>
      <p>
        <b>Balance:</b> {String(wallet.balance)} sats
      </p>
      <Button kind="primary" href={`/wallets/${pubkey}/send`}>
        <FaArrowUp />
        Send
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}/receive`}>
        <FaArrowDown />
        Receive
      </Button>
      <Button kind="secondary" href="/wallets">
        Go back to wallets
      </Button>
    </Page>
  );
}
