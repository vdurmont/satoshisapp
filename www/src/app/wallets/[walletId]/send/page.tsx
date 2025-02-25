"use client";

import { useParams } from "next/navigation";
import { FaBitcoin, FaBolt, FaStar } from "react-icons/fa";
import Button from "@/app/components/button";
import Page from "@/app/components/page";

export default function WalletSend() {
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <Page>
      <Button kind="primary" href={`/wallets/${pubkey}/send-ln`}>
        <FaBolt />
        Send on Lightning
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}/send-spark`}>
        <FaStar />
        Send on Spark
      </Button>
      <Button kind="primary" href={`/wallets/${pubkey}/send-btc`}>
        <FaBitcoin />
        Send on Bitcoin
      </Button>
      <Button kind="secondary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </Page>
  );
}
