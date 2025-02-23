"use client";

export default function Wallets() {
  const rawMnemonics = localStorage.getItem("SATOSHIS_APP_MNEMONICS");
  const mnemonics = rawMnemonics ? JSON.parse(rawMnemonics) : [];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <p className="mb-5">
          You have {mnemonics.length} wallet{mnemonics.length > 1 ? "s" : ""}.
        </p>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/wallets/new"
        >
          Create a wallet
        </a>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/wallets/recover"
        >
          Recover a wallet
        </a>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/wallets/clear"
        >
          Clear wallets
        </a>
      </div>
    </div>
  );
}
