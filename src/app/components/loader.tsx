"use client";

import { FaSync } from "react-icons/fa";

export default function Loader() {
  return (
    <div className="flex flex-row w-full justify-center items-center">
      <FaSync className="animate-spin" />
      <span className="ml-4">Loading...</span>
    </div>
  );
}
