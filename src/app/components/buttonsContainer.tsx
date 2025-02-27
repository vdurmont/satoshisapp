"use client";

type Props = {
  children: React.ReactNode;
};

export default function ButtonsContainer(props: Props) {
  return <div className="flex flex-col items-center">{props.children}</div>;
}
