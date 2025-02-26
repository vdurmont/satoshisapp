"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowDown, FaArrowUp, FaCopy } from "react-icons/fa";
import { getStoredWallet } from "@/app/storage";
import Button from "@/app/components/button";
import Loader from "@/app/components/loader";
import PageContainer from "@/app/components/pageContainer";
import ButtonsContainer from "@/app/components/buttonsContainer";

type Wallet = {
  sparkWallet: SparkWallet;
  balance: bigint;
  pubkey: string;
};

export default function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [copyText, setCopyText] = useState("");
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) {
      return;
    }
    const sparkWallet = new SparkWallet(Network.REGTEST);
    const storedWallet = getStoredWallet(walletId);
    sparkWallet.initWalletFromMnemonic(storedWallet.mnemonic).then(() => {
      sparkWallet.getIdentityPublicKey().then((pubkey) => {
        sparkWallet.getBalance().then((balance) => {
          setWallet({ sparkWallet, balance: balance as bigint, pubkey });
        });
      });
    });
  }, []);

  if (!wallet) {
    return (
      <PageContainer>
        <Loader />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="w-full">
        <p>
          <b>Pubkey</b>
        </p>
        <p className="flex flex-row items-center break-words">
          <span className="mr-3">
            {wallet.pubkey.substring(0, 15)}...
            {wallet.pubkey.substring(wallet.pubkey.length - 15)}
          </span>
          {copyText ? null : (
            <FaCopy
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(wallet.pubkey).then(() => {
                  setCopyText("Copied!");
                  setTimeout(() => {
                    setCopyText("");
                  }, 1000);
                });
              }}
            />
          )}
          {copyText ? <span className="text-sm">{copyText}</span> : null}
        </p>
      </div>
      <div className="w-full">
        <p>
          <b>Balance</b>
        </p>
        <p>{String(wallet.balance)} sats</p>
      </div>
      <ButtonsContainer>
        <Button kind="primary" href={`/wallets/${walletId}/send`}>
          <FaArrowUp />
          Send
        </Button>
        <Button kind="primary" href={`/wallets/${walletId}/receive`}>
          <FaArrowDown />
          Receive
        </Button>
        <Button kind="secondary" href="/wallets">
          Go back to wallets
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
}
