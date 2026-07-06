"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { endTestAction } from "@/app/(dashboard)/actions/test.action";
import { toast } from "sonner";

type Props = {
  testId: string;
};

export default function EndTestButton({
  testId,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleEnd() {
    startTransition(async () => {
      try {
        await endTestAction(testId);

        toast.success("Test ended");

        router.refresh();
      } catch (error) {
        toast.error("Failed to end test");
      }
    });
  }

  return (
    <button
      disabled={isPending}
      onClick={handleEnd}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      {isPending
        ? "Ending..."
        : "End Test"}
    </button>
  );
}