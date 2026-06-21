"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitTestAction } from "@/app/(dashboard)/actions/participant.action";

type SubmitTestButtonProps = {
  testId: string;
};

export default function SubmitTestButton({
  testId,
}: SubmitTestButtonProps) {
  const [isPending, startTransition] =
    useTransition();

  const [open, setOpen] = useState(false);

  const router = useRouter();

  function handleSubmit() {
    startTransition(async () => {
      try {
        await submitTestAction(testId);

        router.replace(
          `/take-test/${testId}/submitted`
        );
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 transition"
      >
        Submit Test
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl">
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <span className="text-xl">⚠️</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  Submit Test?
                </h2>

                <p className="text-sm text-neutral-500">
                  Final confirmation required
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 p-4">
              <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
                <li>
                  • You will not be able to modify answers.
                </li>

                <li>
                  • The test will be finalized immediately.
                </li>

                <li>
                  • Any unanswered questions will remain unanswered.
                </li>

                <li>
                  • Your score will be calculated after submission.
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Continue Attempt
              </button>

              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="rounded-xl bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50 transition"
              >
                {isPending
                  ? "Submitting..."
                  : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}