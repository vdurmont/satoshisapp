"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import Page from "@/app/components/page";

export default function WalletDepositBtc() {
  // @ts-expect-error will fix later maybe
  const [address, setAddress] = useState<Address | null>(null);
  const [copyText, setCopyText] = useState("Copy address to clipboard");
  const params = useParams();
  const pubkey = params.pubkey as string;

  useEffect(() => {
    if (!pubkey) {
      return;
    }
    const sparkWallet = new SparkWallet(Network.REGTEST);
    sparkWallet.initWallet(pubkey).then(() => {
      sparkWallet.getIdentityPublicKey().then((idPubkey) => {
        const address = Uint8Array.from(Buffer.from(idPubkey, "hex"));
        sparkWallet.generateDepositAddress(address).then((res) => {
          setAddress(res.depositAddress);
        });
      });
    });
  }, [pubkey, setAddress]);

  if (!address) {
    return (
      <Page>
        <p>Loading...</p>
      </Page>
    );
  }

  return (
    <Page>
      <p>
        You can use this address to safely deposit BTC into your wallet. Your
        balance will increase when the deposit is confirmed!
      </p>
      <p className="break-words max-w-[250px]">
        <b>Address:</b> {address.address}
      </p>
      <p className="break-words max-w-[250px]">
        <b>Verifying Key:</b>{" "}
        {Buffer.from(address.verifyingKey).toString("hex")}
      </p>
      <Button
        kind="secondary"
        onClick={() => {
          navigator.clipboard.writeText(address.address).then(() => {
            setCopyText("Copied!");
            setTimeout(() => {
              setCopyText("Copy address to clipboard");
            }, 2000);
          });
        }}
      >
        {copyText}
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </Page>
  );
}
