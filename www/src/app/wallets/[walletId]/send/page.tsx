"use client";

import { useParams } from "next/navigation";
import { FaBitcoin, FaBolt, FaStar } from "react-icons/fa";
import Button from "@/app/components/button";
import Page from "@/app/components/page";
import ButtonsContainer from "@/app/components/buttonsContainer";

export default function WalletSend() {
  const params = useParams();
  const walletId = params.walletId as string;

  return (
    <Page>
      <ButtonsContainer>
        <Button kind="primary" href={`/wallets/${walletId}/send-ln`}>
          <FaBolt />
          Send on Lightning
        </Button>
        <Button kind="primary" href={`/wallets/${walletId}/send-spark`}>
          <FaStar />
          Send on Spark
        </Button>
        <Button kind="primary" href={`/wallets/${walletId}/send-btc`}>
          <FaBitcoin />
          Send on Bitcoin
        </Button>
        <Button kind="secondary" href={`/wallets/${walletId}`}>
          Go back
        </Button>
      </ButtonsContainer>
    </Page>
  );
}
