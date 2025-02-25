"use client";

import { useState } from "react";
import { validateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import Page from "@/app/components/page";
import { addMnemonic } from "@/app/storage";

export default function RecoverWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const router = useRouter();

  return (
    <Page>
      <p>Enter your mnemonic phrase below to recover your wallet.</p>
      <textarea
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        className="font-mono p-2 border border-gray-300 rounded w-full h-32 text-black"
      />
      <Button
        kind="primary"
        onClick={() => {
          if (!validateMnemonic(mnemonic)) {
            alert("Invalid mnemonic phrase.");
            return;
          }

          addMnemonic(mnemonic);
          router.push("/wallets");
        }}
      >
        Recover
      </Button>
      <Button kind="secondary" href="/wallets">
        Go back
      </Button>
    </Page>
  );
}
