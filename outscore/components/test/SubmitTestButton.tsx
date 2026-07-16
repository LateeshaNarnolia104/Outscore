"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitTestAction } from "@/app/(dashboard)/actions/attempt.action";

type SubmitTestButtonProps = {
  testId: string;
};

export default function SubmitTestButton({
  testId,
}: SubmitTestButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  function handleSubmit() {
    startTransition(async () => {
      try {
        await submitTestAction(testId);

        router.replace(`/take-test/${testId}/submitted`);
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          rounded-xl
          bg-orange-500/80
          px-6
          py-3
          font-semibold
          text-black
          hover:bg-orange-500
          transition-colors
          cursor-pointer
        "
      >
        Submit Test
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-neutral-800
              bg-[#111111]
              p-7
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-500/10
                  text-xl
                "
              >
                ⚠️
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Submit Test?
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  This action cannot be undone.
                </p>

              </div>

            </div>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-neutral-800
                bg-neutral-900
                p-5
              "
            >

              <ul className="space-y-3 text-sm text-neutral-300">

                <li>• You won't be able to change any answers.</li>

                <li>• Unanswered questions will stay unanswered.</li>

                <li>• Your attempt will be submitted immediately.</li>

                <li>• Your score will be calculated after evaluation.</li>

              </ul>

            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="
                  rounded-xl
                  border
                  border-neutral-700
                  px-5
                  py-2.5
                  text-neutral-300
                  hover:bg-neutral-800
                  transition-colors
                  cursor-pointer
                "
              >
                Continue Test
              </button>

              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="
                  rounded-xl
                  bg-orange-500/80
                  px-5
                  py-2.5
                  font-semibold
                  text-black
                  hover:bg-orange-500
                  disabled:opacity-50
                  transition-colors
                  cursor-pointer
                "
              >
                {isPending ? "Submitting..." : "Submit"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}