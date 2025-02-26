"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import Loader from "@/app/components/loader";
import { getStoredWallet } from "@/app/storage";

export default function WalletDepositBtc() {
  // @ts-expect-error will fix later maybe
  const [address, setAddress] = useState<Address | null>(null);
  const [copyAddressText, setCopyAddressText] = useState(
    "Copy address to clipboard"
  );
  const [copyVerifText, setCopyVerifText] = useState("Copy key to clipboard");
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) {
      return;
    }
    const sparkWallet = new SparkWallet(Network.REGTEST);
    const storedWallet = getStoredWallet(walletId);
    sparkWallet.initWallet(storedWallet.mnemonic).then(() => {
      sparkWallet.getDepositAddress().then((address) => {
        setAddress(address);
      });
    });
  }, [walletId, setAddress]);

  if (!address) {
    return (
      <PageContainer>
        <Loader />
      </PageContainer>
    );
  }

  const verifKey = Buffer.from(address.verifyingKey).toString("hex");
  return (
    <PageContainer>
      <p>
        You can use this address to safely deposit BTC into your wallet. Your
        balance will increase when the deposit is confirmed!
      </p>
      <p className="break-words max-w-[250px]">
        <b>Address:</b> {address.address}
      </p>
      <Button
        kind="secondary"
        onClick={() => {
          navigator.clipboard.writeText(address.address).then(() => {
            setCopyAddressText("Copied!");
            setTimeout(() => {
              setCopyAddressText("Copy address to clipboard");
            }, 2000);
          });
        }}
      >
        {copyAddressText}
      </Button>
      <p className="break-words max-w-[250px]">
        <b>Verifying Key:</b> {verifKey}
      </p>
      <Button
        kind="secondary"
        onClick={() => {
          navigator.clipboard.writeText(verifKey).then(() => {
            setCopyVerifText("Copied!");
            setTimeout(() => {
              setCopyVerifText("Copy key to clipboard");
            }, 2000);
          });
        }}
      >
        {copyVerifText}
      </Button>
      <Button kind="primary" href={`/wallets/${walletId}`}>
        Go back
      </Button>
    </PageContainer>
  );
}
