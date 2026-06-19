"use client";

import { useTransition } from "react";
import { publishTestAction } from "@/app/(dashboard)/actions/test.action";
import { toast } from "sonner";

type PublishButtonProps = {
  testId: string;
};

export default function PublishButton({
  testId,
}: PublishButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handlePublish() {
    startTransition(async () => {
      try {
        const response = await publishTestAction(testId);

        toast.success(response.message);

        } catch (error) {

        toast.error(
            error instanceof Error
            ? error.message
            : "Something went wrong"
        );

        }
    });
  }

  return (
    <button
      onClick={handlePublish}
      disabled={isPending}
      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
    >
      {isPending ? "Publishing..." : "Publish"}
    </button>
  );
}