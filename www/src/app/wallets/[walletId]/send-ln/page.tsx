"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import ButtonsContainer from "@/app/components/buttonsContainer";
import { getOrInitCachedWallet } from "@/app/walletCache";

export default function WalletSendLn() {
  const [invoice, setInvoice] = useState("");
  const [step, setStep] = useState(0);
  const params = useParams();
  const walletId = params.walletId as string;

  if (step === 0) {
    return (
      <PageContainer>
        <p>
          Use this form to pay a Lightning Network invoice from your wallet.
        </p>
        <label className="block">
          Lightning Invoice
          <textarea
            placeholder="Lightning Invoice"
            className="border border-gray-300 rounded p-2 w-full text-black"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
          />
        </label>
        <ButtonsContainer>
          <Button
            kind="primary"
            onClick={() => {
              setStep(1);
            }}
          >
            Next
          </Button>
          <Button kind="secondary" href={`/wallets/${walletId}`}>
            Go back
          </Button>
        </ButtonsContainer>
      </PageContainer>
    );
  }

  if (step === 1) {
    return (
      <PageContainer>
        <p>Review the details of the invoice below.</p>
        <ButtonsContainer>
          <Button
            kind="primary"
            onClick={() => {
              getOrInitCachedWallet(walletId).then((cachedWallet) => {
                cachedWallet.sparkWallet
                  .payLightningInvoice({ invoice })
                  .then(() => {
                    setStep(2);
                  });
              });
            }}
          >
            Pay Invoice
          </Button>
          <Button
            disabled={!invoice}
            kind="secondary"
            onClick={() => {
              setStep(0);
            }}
          >
            Go back
          </Button>
        </ButtonsContainer>
      </PageContainer>
    );
  }

  if (step === 2) {
    return (
      <PageContainer>
        <p>The payment was successful!</p>
        <ButtonsContainer>
          <Button kind="primary" href={`/wallets/${walletId}`}>
            Go back
          </Button>
        </ButtonsContainer>
      </PageContainer>
    );
  }
}
