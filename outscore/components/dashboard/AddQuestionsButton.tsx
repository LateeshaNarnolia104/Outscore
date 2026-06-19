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
      className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      Add Questions
    </Link>
  );
}

