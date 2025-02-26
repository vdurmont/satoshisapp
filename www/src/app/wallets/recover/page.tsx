"use client";

import { useState } from "react";
import { validateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import ButtonsContainer from "@/app/components/buttonsContainer";
import PageContainer from "@/app/components/pageContainer";
import { addStoredWallet } from "@/app/storage";

export default function RecoverWallet() {
  const [mnemonic, setMnemonic] = useState("");
  const router = useRouter();

  return (
    <PageContainer>
      <p>Enter your mnemonic phrase below to recover your wallet.</p>
      <textarea
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        className="font-mono p-2 border border-gray-300 rounded w-full h-32 text-black"
      />
      <ButtonsContainer>
        <Button
          kind="primary"
          onClick={() => {
            if (!validateMnemonic(mnemonic)) {
              alert("Invalid mnemonic phrase.");
              return;
            }

            addStoredWallet(mnemonic);
            router.push("/wallets");
          }}
        >
          Recover
        </Button>
        <Button kind="secondary" href="/wallets">
          Go back
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
}
