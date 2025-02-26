"use client";

import { useEffect, useState } from "react";
import { generateMnemonic } from "bip39";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import PageContainer from "@/app/components/pageContainer";
import { addStoredWallet } from "@/app/storage";

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
  const [mnemonic, setMnemonic] = useState("");
  const [copyText, setCopyText] = useState("Copy to clipboard");
  const [step, setStep] = useState(0);
  const router = useRouter();

  const [index1, setIndex1] = useState(0);
  const [word1, setWord1] = useState("");
  const [index2, setIndex2] = useState(0);
  const [word2, setWord2] = useState("");

  useEffect(() => {
    setMnemonic(generateMnemonic());
    const i1 = getRandomInt(1, 12);
    setIndex1(i1);
    let index2Candidate = getRandomInt(1, 12);
    while (index2Candidate === i1) {
      index2Candidate = getRandomInt(1, 12);
    }
    setIndex2(index2Candidate);
  }, [setMnemonic, setIndex1, setIndex2]);

  return (
    <PageContainer>
      {step === -1 ? (
        <>
          <p>
            Uh oh... You entered the wrong word. We are going to start over and
            generate a new mnemonic phrase for you.
          </p>
          <Button
            kind="primary"
            onClick={() => {
              location.reload();
            }}
          >
            Start over
          </Button>
        </>
      ) : step === 0 ? (
        <>
          <p>
            We generated a random mnemonic phrase for you. It is very important
            to write it down and keep it safe.
          </p>
          <textarea
            value={mnemonic}
            className="font-mono p-2 border border-gray-300 rounded w-full h-32 text-black"
            readOnly
          />
          <Button
            kind="secondary"
            onClick={() => {
              navigator.clipboard.writeText(mnemonic).then(() => {
                setCopyText("Copied!");
                setTimeout(() => {
                  setCopyText("Copy to clipboard");
                }, 2000);
              });
            }}
          >
            {copyText}
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              setStep(1);
            }}
          >
            Next
          </Button>
        </>
      ) : step === 1 ? (
        <>
          <p>You will need your passphrase to recover your wallet.</p>
          <p>Enter the {prettyIndex(index1)} word here:</p>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full text-black"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
          />
          <Button
            kind="primary"
            onClick={() => {
              if (mnemonic.split(" ")[index1 - 1] === word1) {
                setStep(2);
              } else {
                setStep(-1);
              }
            }}
          >
            Next
          </Button>
        </>
      ) : step === 2 ? (
        <>
          <p>Without it you will lose access to your funds.</p>
          <p>Enter the {prettyIndex(index2)} word here:</p>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full text-black"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
          />
          <Button
            kind="primary"
            onClick={() => {
              if (mnemonic.split(" ")[index2 - 1] === word2) {
                addStoredWallet(mnemonic);
                router.push("/wallets");
              } else {
                setStep(-1);
              }
            }}
          >
            Next
          </Button>
        </>
      ) : null}
      <Button kind="secondary" href="/wallets">
        Back to wallets list
      </Button>
    </PageContainer>
  );
}
