"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import ButtonsContainer from "@/app/components/buttonsContainer";
import { getOrInitCachedWallet, refreshWallet } from "@/app/walletCache";
import { useRouter } from "next/navigation";

enum Status {
  None,
  Paying,
  Syncing,
}

export default function WalletSendBtc() {
  const [amount, setAmount] = useState("0");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Status>(Status.None);
  const params = useParams();
  const walletId = params.walletId as string;
  const router = useRouter();

  let buttonText;
  switch (status) {
    case Status.None:
      buttonText = "Send";
      break;
    case Status.Paying:
      buttonText = "Sending...";
      break;
    case Status.Syncing:
      buttonText = "Syncing wallet...";
      break;
  }

  return (
    <PageContainer>
      <p>Use this form to send Bitcoin from your wallet.</p>
      <label className="block">
        Amount (sats)
        <textarea
          placeholder="Amount (sats)"
          className="border border-gray-300 rounded p-2 w-full text-black"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <label className="block">
        Bitcoin Address
        <textarea
          placeholder="Bitcoin Address"
          className="border border-gray-300 rounded p-2 w-full text-black"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <ButtonsContainer>
        <Button
          kind="primary"
          loading={status !== Status.None}
          disabled={status !== Status.None}
          onClick={() => {
            setStatus(Status.Paying);
            getOrInitCachedWallet(walletId).then((cachedWallet) => {
              cachedWallet.sparkWallet
                .withdraw({
                  onchainAddress: address,
                  targetAmountSats: parseInt(amount),
                })
                .then(() => {
                  setStatus(Status.Syncing);
                  refreshWallet(walletId).then(() => {
                    router.push(`/wallets/${walletId}`);
                  });
                })
                .catch((e) => {
                  setStatus(Status.None);
                  console.log(e);
                  alert("An error occurred. Check the JS Console.");
                });
            });
          }}
        >
          {buttonText}
        </Button>
        <Button kind="secondary" href={`/wallets/${walletId}`}>
          Go back
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
}
