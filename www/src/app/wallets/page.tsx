"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import { useEffect, useState } from "react";
import { FaArrowRight, FaSync } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { clearMnemonics, getMnemonics } from "@/app/storage";
import Button from "@/app/components/button";
import ButtonsContainer from "@/app/components/buttonsContainer";
import Page from "@/app/components/page";

type Wallet = {
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
  mnemonic: string;
};

function WalletItem(props: WalletProps) {
  const [wallet, setWallet] = useState<Wallet | null>();
  const { mnemonic } = props;
  const router = useRouter();

  useEffect(() => {
    const sparkWallet = new SparkWallet(Network.REGTEST);
    sparkWallet.initWalletFromMnemonic(mnemonic).then(() => {
      sparkWallet.getIdentityPublicKey().then((pubkey) => {
        sparkWallet.getBalance().then((balance) => {
          setWallet({ sparkWallet, balance: balance as bigint, pubkey });
        });
      });
    });
  }, [mnemonic, setWallet]);

  if (!wallet) {
    return (
      <Box>
        <FaSync className="animate-spin" />
        Loading...
      </Box>
    );
  }

  return (
    <Box
      onClick={() => {
        router.push(`/wallets/${wallet.pubkey}`);
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
  const [mnemonics, setMnemonics] = useState<Array<string>>([]);

  useEffect(() => {
    setMnemonics(getMnemonics());
  }, [setMnemonics]);

  return (
    <Page>
      {mnemonics.map((mnemonic) => (
        <WalletItem key={mnemonic} mnemonic={mnemonic} />
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
            clearMnemonics();
            location.reload();
          }}
        >
          Clear wallets
        </Button>
      </ButtonsContainer>
    </Page>
  );
}
