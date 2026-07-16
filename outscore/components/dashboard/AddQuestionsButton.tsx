"use client";

import Link from "next/link";

type AddQuestionsButtonProps = {
  testId: string;
};

export default function AddQuestionsButton({
  testId,
}: AddQuestionsButtonProps) {
  return (
    <Link
      href={`/dashboard/tests/${testId}`}
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
      Add Questions
    </Link>
  );
}

