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
      className="rounded-xl
border
border-neutral-700
bg-[#181818]
px-5
py-3
text-sm
font-semibold
text-neutral-200
transition-all
duration-300
hover:border-orange-500
hover:text-orange-400
hover:bg-[#202020]
"
    >
      Copy Code
    </button>
  );
}
