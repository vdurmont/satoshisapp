"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaArrowDown,
  FaArrowUp,
  FaCopy,
  FaCheckCircle,
  FaEye,
  FaSync,
} from "react-icons/fa";
import Button from "@/app/components/button";
import Loader from "@/app/components/loader";
import PageContainer from "@/app/components/pageContainer";
import ButtonsContainer from "@/app/components/buttonsContainer";
import { getOrInitCachedWallet, refreshWallet } from "@/app/walletCache";

type Wallet = {
  balance: bigint;
  pubkey: string;
  mnemonic: string;
};

export default function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [pubkeyCopied, setPubkeyCopied] = useState(false);
  const [mnemonicCopied, setMnemonicCopied] = useState(false);
  const [revealMnemonic, setRevealMnemonic] = useState(false);
  const params = useParams();
  const walletId = params.walletId as string;

  useEffect(() => {
    if (!walletId) {
      return;
    }
    getOrInitCachedWallet(walletId).then((cachedWallet) => {
      cachedWallet.sparkWallet.getSparkAddress().then((pubkey) => {
        setWallet({
          balance: cachedWallet.balance,
          mnemonic: cachedWallet.mnemonic,
          pubkey,
        });
      });
    });
  }, [walletId, setWallet]);
  useEffect(() => {
    if (!walletId) {
      return;
    }
    getOrInitCachedWallet(walletId).then((cachedWallet) => {
      cachedWallet.sparkWallet.getSparkAddress().then((pubkey) => {
        setWallet({
          balance: cachedWallet.balance,
          mnemonic: cachedWallet.mnemonic,
          pubkey,
        });
      });
    });
  }, [walletId, setWallet]);

  if (!wallet) {
    return (
      <PageContainer>
        <Loader />
      </PageContainer>
    );
  }

  const PubkeyCopyIcon = pubkeyCopied ? FaCheckCircle : FaCopy;
  const MnemonicCopyIcon = mnemonicCopied ? FaCheckCircle : FaCopy;

  return (
    <PageContainer>
      <div className="w-full">
        <p>
          <b>Pubkey</b>
        </p>
        <p className="flex flex-row items-center break-words">
          <span className="mr-3">
            {wallet.pubkey.substring(0, 15)}...
            {wallet.pubkey.substring(wallet.pubkey.length - 15)}
          </span>
          <PubkeyCopyIcon
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(wallet.pubkey).then(() => {
                setPubkeyCopied(true);
                setTimeout(() => {
                  setPubkeyCopied(false);
                }, 1000);
              });
            }}
          />
        </p>
      </div>
      <div className="w-full">
        <p>
          <b>Balance</b>
        </p>
        <p>{String(wallet.balance)} sats</p>
      </div>
      <div className="w-full">
        <p>
          <b>Mnemonic phrase</b>
        </p>
        <div className="flex flex-row items-center">
          {revealMnemonic ? (
            <>
              <span className="font-mono">{wallet.mnemonic}</span>
              <p>
                <MnemonicCopyIcon
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(wallet.mnemonic).then(() => {
                      setMnemonicCopied(true);
                      setTimeout(() => {
                        setMnemonicCopied(false);
                      }, 1000);
                    });
                  }}
                />
              </p>
            </>
          ) : (
            <>
              <a
                className="mr-2"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealMnemonic(true);
                }}
              >
                Reveal
              </a>
              <FaEye
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealMnemonic(true);
                }}
              />
            </>
          )}
        </div>
      </div>
      <ButtonsContainer>
        <Button kind="primary" href={`/wallets/${walletId}/send`}>
          <FaArrowUp />
          Send
        </Button>
        <Button kind="primary" href={`/wallets/${walletId}/receive`}>
          <FaArrowDown />
          Receive
        </Button>
        <Button
          kind="primary"
          disabled={syncing}
          loading={syncing}
          onClick={() => {
            setSyncing(true);
            refreshWallet(walletId).then((cachedWallet) => {
              cachedWallet.sparkWallet.getSparkAddress().then((pubkey) => {
                setWallet({
                  balance: cachedWallet.balance,
                  mnemonic: cachedWallet.mnemonic,
                  pubkey,
                });
                setSyncing(false);
              });
            });
          }}
        >
          {syncing ? null : <FaSync />}
          Synchronize wallet
        </Button>
        <Button kind="secondary" href="/wallets">
          Go back to wallets
        </Button>
      </ButtonsContainer>
    </PageContainer>
  );
}
