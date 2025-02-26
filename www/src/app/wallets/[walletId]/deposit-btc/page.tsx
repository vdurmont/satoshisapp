"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import Loader from "@/app/components/loader";
import { getOrInitCachedWallet } from "@/app/walletCache";

export default function WalletDepositBtc() {
  const [address, setAddress] = useState<string | null>(null);
  const [copyAddressText, setCopyAddressText] = useState(
    "Copy address to clipboard"
  );
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) {
      return;
    }
    getOrInitCachedWallet(walletId).then((cachedWallet) => {
      cachedWallet.sparkWallet.getDepositAddress().then((address) => {
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

  return (
    <PageContainer>
      <p>
        You can use this address to safely deposit BTC into your wallet. Your
        balance will increase when the deposit is confirmed!
      </p>
      <p className="break-words max-w-[250px]">
        <b>Address:</b> {address}
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
      <Button kind="primary" href={`/wallets/${walletId}`}>
        Go back
      </Button>
    </PageContainer>
  );
}
