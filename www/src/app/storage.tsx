"use client";

const STORAGE_KEY = "SATOSHIS_APP_MNEMONICS";

export function addMnemonic(mnemonic: string) {
  const oldMnemonics = getMnemonics();
  const newMnemonics = oldMnemonics.concat([mnemonic]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newMnemonics));
}

export function getMnemonics(): Array<string> {
  const mnemonics = localStorage.getItem(STORAGE_KEY);
  return mnemonics ? JSON.parse(mnemonics) : [];
}

export function clearMnemonics() {
  localStorage.removeItem(STORAGE_KEY);
}
