"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  clearStoredWallets,
  getAllStoredWallets,
  type StoredWallet,
} from "@/app/storage";
import Button from "@/app/components/button";
import ButtonsContainer from "@/app/components/buttonsContainer";
import Loader from "@/app/components/loader";
import PageContainer from "@/app/components/pageContainer";

type Wallet = {
  id: string;
  sparkWallet: SparkWallet;
  balance: bigint;
  pubkey: string;
};

type BoxProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

function Box(props: BoxProps) {
  return (
    <div className="flex flex-row w-full items-center justify-center">
      <div
        onClick={props.onClick}
        className="flex flex-row flex-wrap gap-2 cursor-pointer border border-solid border-foreground rounded-lg p-4 h-[80px] content-center justify-center w-[350px]"
      >
        {props.children}
      </div>
    </div>
  );
}

type WalletProps = {
  storedWallet: StoredWallet;
};

function WalletItem(props: WalletProps) {
  const [wallet, setWallet] = useState<Wallet | null>();
  const { id, mnemonic } = props.storedWallet;
  const router = useRouter();

  useEffect(() => {
    const sparkWallet = new SparkWallet(Network.REGTEST);
    sparkWallet.initWallet(mnemonic).then((res) => {
      sparkWallet.getSparkAddress().then((pubkey) => {
        setWallet({ sparkWallet, balance: res.balance as bigint, id, pubkey });
      });
    });
  }, []);

  if (!wallet) {
    return (
      <Box>
        <Loader />
      </Box>
    );
  }

  return (
    <Box
      onClick={() => {
        router.push(`/wallets/${wallet.id}`);
      }}
    >
      <div className="flex flex-col">
        <p>{wallet.pubkey.substring(0, 20)}...</p>
        <p>Balance: {String(wallet.balance)} sats</p>
      </div>
      <div className="flex flex-col items-center justify-center ml-4">
        <FaArrowRight />
      </div>
    </Box>
  );
}

export default function Wallets() {
  const [wallets, setWallets] = useState<Array<StoredWallet>>([]);

  useEffect(() => {
    setWallets(getAllStoredWallets());
  }, [setWallets]);

  return (
    <PageContainer>
      {wallets.map((wallet) => (
        <WalletItem key={wallet.id} storedWallet={wallet} />
      ))}
      <ButtonsContainer>
        <Button kind="primary" href="/wallets/new">
          Create a wallet
        </Button>
        <Button kind="primary" href="/wallets/recover">
          Recover a wallet
        </Button>
        <Button
          kind="secondary"
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to clear all the wallets? " +
                  "You can recover them using the mnemonics you saved during the creation process."
              )
            ) {
              clearStoredWallets();
              location.reload();
            }
          }}
        >
          Clear wallets
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
}
