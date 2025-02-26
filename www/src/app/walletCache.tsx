"use client";

import { SparkWallet } from "@buildonspark/spark-sdk";
import { getStoredWallet } from "./storage";
import { Network } from "@buildonspark/spark-sdk/utils";

type CachedWallet = {
  sparkWallet: SparkWallet;
  balance: bigint;
  mnemonic: string;
};

const WALLETS: { [key: string]: CachedWallet } = {};

export async function getOrInitCachedWallet(id: string) {
  if (!WALLETS[id]) {
    const storedWallet = getStoredWallet(id);
    const sparkWallet = new SparkWallet(Network.REGTEST);
    const initRes = await sparkWallet.initWallet(storedWallet.mnemonic);
    const cachedWallet = {
      sparkWallet,
      balance: initRes.balance,
      mnemonic: storedWallet.mnemonic,
    };
    WALLETS[id] = cachedWallet;
  }
  return WALLETS[id];
}

export function deleteWallet(id: string) {
  delete WALLETS[id];
}
