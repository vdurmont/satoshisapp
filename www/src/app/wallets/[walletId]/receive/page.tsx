"use client";

import { useParams } from "next/navigation";
import { FaBitcoin, FaBolt, FaStar } from "react-icons/fa";
import Button from "@/app/components/button";
import Page from "@/app/components/page";

export default function WalletReceive() {
  const params = useParams();
  const walletId = params.walletId as string;

  return (
    <Page>
      <Button kind="primary" href={`/wallets/${walletId}/deposit-btc`}>
        <FaBitcoin />
        Deposit from Bitcoin
      </Button>
      <Button kind="primary" href={`/wallets/${walletId}/receive-ln`}>
        <FaBolt />
        Receive on Lightning
      </Button>
      <Button kind="primary" href={`/wallets/${walletId}/receive-spark`}>
        <FaStar />
        Receive on Spark
      </Button>
      <Button kind="secondary" href={`/wallets/${walletId}`}>
        Go back
      </Button>
    </Page>
  );
}
