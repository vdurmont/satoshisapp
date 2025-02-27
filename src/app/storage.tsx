"use client";

import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "SATOSHIS_APP_MNEMONICS";

export type StoredWallet = {
  id: string;
  mnemonic: string;
};

export function addStoredWallet(mnemonic: string): StoredWallet {
  const oldWallets = getAllStoredWallets();
  const wallet = { id: uuidv4(), mnemonic };
  const newWallets = oldWallets.concat([wallet]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newWallets));
  return wallet;
}

export function getAllStoredWallets(): Array<StoredWallet> {
  const wallets = localStorage.getItem(STORAGE_KEY);
  return wallets ? JSON.parse(wallets) : [];
}

export function getStoredWallet(id: string): StoredWallet {
  const rawWallets = localStorage.getItem(STORAGE_KEY);
  const wallets = rawWallets ? JSON.parse(rawWallets) : [];
  return wallets.find((w: StoredWallet) => w.id === id);
}

export function clearStoredWallets() {
  localStorage.removeItem(STORAGE_KEY);
}
