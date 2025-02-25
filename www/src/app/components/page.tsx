"use client";

type Props = {
  children: React.ReactNode;
};

export default function Page(props: Props) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2 max-w-xs sm:max-w-md">
        Satoshis App
      </h1>
      <div className="flex flex-col gap-4 mt-10">{props.children}</div>
    </div>
  );
}
