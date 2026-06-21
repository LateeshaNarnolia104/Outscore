"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { startTestAction } from "@/app/(dashboard)/actions/test.action";

type StartTestButtonProps = {
  testId: string;
};

export default function StartTestButton({ testId }: StartTestButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    startTransition(async () => {
      try {
        const response = await startTestAction(testId);

        toast.success(response.message);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    });
  }

  return (
    <button
      onClick={handleStart}
      disabled={isPending}
      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
    >
      {isPending ? "Starting..." : "Start Test"}
    </button>
  );
}
