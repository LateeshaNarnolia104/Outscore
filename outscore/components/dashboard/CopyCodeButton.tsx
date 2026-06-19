"use client";

import { toast } from "sonner";

type CopyCodeButtonProps = {
  accessCode: string;
};

export default function CopyCodeButton({
  accessCode,
}: CopyCodeButtonProps) {
  async function handleCopy() {
    await navigator.clipboard.writeText(accessCode);

    toast.success("Access code copied");
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      Copy Code
    </button>
  );
}
