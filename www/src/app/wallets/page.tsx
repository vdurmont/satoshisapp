"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { clearMnemonics, getMnemonics } from "@/app/storage";
import Button from "@/app/components/button";
import Page from "@/app/components/page";

type Wallet = {
  sparkWallet: SparkWallet;
  balance: bigint;
  pubkey: string;
};

export default function Wallets() {
  const [wallets, setWallets] = useState<Array<Wallet>>([]);
  const [walletsCount, setWalletsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const mnemonics = getMnemonics();
    setWalletsCount(mnemonics.length);
    for (const mnemonic of mnemonics) {
      const sparkWallet = new SparkWallet(Network.REGTEST);
      sparkWallet.initWalletFromMnemonic(mnemonic).then(() => {
        sparkWallet.getIdentityPublicKey().then((pubkey) => {
          sparkWallet.getBalance().then((balance) => {
            setWallets((w) =>
              w
                .concat([{ sparkWallet, balance: balance as bigint, pubkey }])
                .reduce((acc, cur) => {
                  if (!acc.find((w) => w.pubkey === cur.pubkey)) {
                    acc.push(cur);
                  }
                  return acc;
                }, [] as Wallet[])
            );
          });
        });
      });
    }
  }, [setWallets]);

  return (
    <Page>
      {wallets.map((wallet, index) => (
        <div
          key={index}
          className="flex flex-row gap-2 cursor-pointer"
          onClick={() => {
            router.push(`/wallets/${wallet.pubkey}`);
          }}
        >
          <div className="flex flex-col">
            <p>{wallet.pubkey.substring(0, 20)}...</p>
            <p>Balance: {String(wallet.balance)} sats</p>
          </div>
          <div className="flex flex-col items-center justify-center ml-4">
            <FaArrowRight />
          </div>
        </div>
      ))}
      {walletsCount - wallets.length > 0 ? (
        <p>
          Loading {walletsCount - wallets.length} wallet
          {walletsCount - wallets.length > 1 ? "s" : ""}...
        </p>
      ) : null}
      <Button kind="primary" href="/wallets/new">
        Create a wallet
      </Button>
      <Button kind="primary" href="/wallets/recover">
        Recover a wallet
      </Button>
      <Button
        kind="secondary"
        onClick={() => {
          clearMnemonics();
          location.reload();
        }}
      >
        Clear wallets
      </Button>
    </Page>
  );
}
