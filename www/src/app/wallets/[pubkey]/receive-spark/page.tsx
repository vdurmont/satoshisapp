"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import Page from "@/app/components/page";

export default function WalletReceiveSpark() {
  const [copyText, setCopyText] = useState("Copy address to clipboard");
  const params = useParams();
  const pubkey = params.pubkey as string;

  return (
    <Page>
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
      <Button kind="primary" href={`/wallets/${pubkey}`}>
        Go back
      </Button>
    </Page>
  );
}
