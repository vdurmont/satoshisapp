"use client";

import Link from "next/link";
import cx from "classnames";

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  kind: "primary" | "secondary";
};

export default function Button(props: Props) {
  return (
    <Link
      className={cx(
        "rounded-full mt-5 border border-solid transition-colors flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 max-w-[250px]",
        props.kind === "primary" &&
          "border-transparent bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]",
        props.kind === "secondary" &&
          "border-foreground bg-background text-foreground dark:hover:bg-[#383838] hover:bg-[#ccc]"
      )}
      href={props.href || "#"}
      onClick={(e) => {
        if (props.disabled) {
          e.preventDefault();
          return;
        }
        if (props.onClick) {
          e.preventDefault();
          props.onClick();
        }
      }}
    >
      {props.children}
    </Link>
  );
}
