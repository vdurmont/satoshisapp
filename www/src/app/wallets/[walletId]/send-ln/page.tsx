"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import Page from "@/app/components/page";
import { getStoredWallet } from "@/app/storage";
import ButtonsContainer from "@/app/components/buttonsContainer";

export default function WalletSendLn() {
  const [amount, setAmount] = useState("0");
  const [invoice, setInvoice] = useState("");
  const [step, setStep] = useState(0);
  const params = useParams();
  const walletId = params.walletId as string;

  if (step === 0) {
    return (
      <Page>
        <p>
          Use this form to pay a Lightning Network invoice from your wallet.
        </p>
        <label className="block">
          Amount (sats, optional)
          <input
            type="number"
            placeholder="Amount (sats)"
            className="border border-gray-300 rounded p-2 w-full text-black"
            value={amount || ""}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
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
      </Page>
    );
  }

  if (step === 1) {
    return (
      <Page>
        <p>Review the details of the invoice below.</p>
        <ButtonsContainer>
          <Button
            kind="primary"
            onClick={() => {
              const sparkWallet = new SparkWallet(Network.REGTEST);
              const storedWallet = getStoredWallet(walletId);
              sparkWallet
                .initWalletFromMnemonic(storedWallet.mnemonic)
                .then(() => {
                  sparkWallet
                    .payLightningInvoice({
                      amountSats: amount ? parseInt(amount) : undefined,
                      invoice,
                    })
                    .then(() => {
                      setStep(2);
                    });
                });
            }}
          >
            Pay Invoice
          </Button>
          <Button
            kind="secondary"
            onClick={() => {
              setStep(0);
            }}
          >
            Go back
          </Button>
        </ButtonsContainer>
      </Page>
    );
  }

  if (step === 2) {
    return (
      <Page>
        <p>The payment was successful!</p>
        <ButtonsContainer>
          <Button kind="primary" href={`/wallets/${walletId}`}>
            Go back
          </Button>
        </ButtonsContainer>
      </Page>
    );
  }
}
