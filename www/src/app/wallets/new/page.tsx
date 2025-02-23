"use client";

import { useState } from "react";
import bip39 from "bip39";
import { useRouter } from "next/navigation";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function prettyIndex(index: number) {
  switch (index) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${index}th`;
  }
}

export default function NewWallet() {
  const [mnemonic] = useState(bip39.generateMnemonic());
  const [copyText, setCopyText] = useState("Copy to clipboard");
  const [step, setStep] = useState(0);
  const router = useRouter();

  const [index1] = useState(getRandomInt(1, 12));
  const [word1, setWord1] = useState("");

  let index2Candidate = getRandomInt(1, 12);
  while (index2Candidate === index1) {
    index2Candidate = getRandomInt(1, 12);
  }

  const [index2, setIndex2] = useState(index2Candidate);
  const [word2, setWord2] = useState("");

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      {step === -1 ? (
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <p>
            Uh oh... You entered the wrong word. We are going to start over and
            generate a new mnemonic phrase for you.
          </p>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              location.reload();
            }}
          >
            Start over
          </a>
        </div>
      ) : step === 0 ? (
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <p>
            We generated a random mnemonic phrase for you. It is very important
            to write it down and keep it safe.
          </p>
          <textarea
            value={mnemonic}
            className="font-mono p-2 border border-gray-300 rounded w-full h-32 text-black"
            readOnly
          />
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(mnemonic).then(() => {
                setCopyText("Copied!");
                setTimeout(() => {
                  setCopyText("Copy to clipboard");
                }, 2000);
              });
            }}
          >
            {copyText}
          </a>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setStep(1);
            }}
          >
            Next
          </a>
        </div>
      ) : step === 1 ? (
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <p>You will need your passphrase to recover your wallet.</p>
          <p>Enter the {prettyIndex(index1)} word here:</p>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full text-black"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
          />
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (mnemonic.split(" ")[index1 - 1] === word1) {
                setStep(2);
              } else {
                setStep(-1);
              }
            }}
          >
            Next
          </a>
        </div>
      ) : step === 2 ? (
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <p>Without it you will lose access to your funds.</p>
          <p>Enter the {prettyIndex(index2)} word here:</p>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full text-black"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
          />
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (mnemonic.split(" ")[index2 - 1] === word2) {
                const mnemonics = localStorage.getItem(
                  "SATOSHIS_APP_MNEMONICS"
                );
                if (mnemonics) {
                  localStorage.setItem(
                    "SATOSHIS_APP_MNEMONICS",
                    mnemonics + [mnemonic]
                  );
                } else {
                  localStorage.setItem("SATOSHIS_APP_MNEMONICS", mnemonic);
                }
                router.push("/wallets");
              } else {
                setStep(-1);
              }
            }}
          >
            Next
          </a>
        </div>
      ) : null}
    </div>
  );
}
