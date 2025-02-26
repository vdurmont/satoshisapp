"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import ButtonsContainer from "@/app/components/buttonsContainer";
import { getOrInitCachedWallet, refreshWallet } from "@/app/walletCache";
import bolt11 from "bolt11";
import { useRouter } from "next/navigation";

enum Status {
  None,
  Paying,
  Syncing,
}

export default function WalletSendLn() {
  const [invoice, setInvoice] = useState("");
  const [status, setStatus] = useState<Status>(Status.None);
  const [step, setStep] = useState(0);
  const params = useParams();
  const walletId = params.walletId as string;
  const router = useRouter();

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
    let buttonText;
    switch (status) {
      case Status.None:
        buttonText = "Pay Invoice";
        break;
      case Status.Paying:
        buttonText = "Paying invoice...";
        break;
      case Status.Syncing:
        buttonText = "Syncing wallet...";
        break;
    }

    const decoded = bolt11.decode(invoice);
    const memo = decoded.tagsObject.description;
    return (
      <PageContainer>
        <p>Review the details of the invoice below.</p>
        <p>
          <b>Amount</b>
        </p>
        <p>{decoded.millisatoshis} millisatoshis</p>
        <p>
          <b>Expires date</b>
        </p>
        <p>{decoded.timeExpireDateString}</p>
        {memo ? (
          <>
            <p>
              <b>Memo</b>
            </p>
            <p>{memo}</p>
          </>
        ) : null}
        <ButtonsContainer>
          <Button
            kind="primary"
            loading={status !== Status.None}
            disabled={status !== Status.None}
            onClick={() => {
              setStatus(Status.Paying);
              getOrInitCachedWallet(walletId).then((cachedWallet) => {
                cachedWallet.sparkWallet
                  .payLightningInvoice({ invoice })
                  .then(() => {
                    setStatus(Status.Syncing);
                    refreshWallet(walletId).then(() => {
                      router.push(`/wallets/${walletId}`);
                    });
                  });
              });
            }}
          >
            {buttonText}
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
}
