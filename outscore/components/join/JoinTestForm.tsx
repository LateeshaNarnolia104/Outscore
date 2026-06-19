"use client";

import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { joinTestAction } from "@/app/(dashboard)/actions/participant.action";

type TestPreview = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
};

export default function JoinTestForm() {
  const [accessCode, setAccessCode] = useState("");
  const [test, setTest] = useState<TestPreview | null>(null);

  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const response = await joinTestAction(accessCode);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      if (response.data) {
        setTest(response.data);
      }

      toast.success(response.message);
    });
  }

  function handleBack() {
    setTest(null);
    setAccessCode("");
  }

  function handleContinue() {
    toast.info("Participant details form will be implemented next.");
  }

  return (
    <div className="w-full">
      {!test ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm"
        >
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Join Test
          </h1>

          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Enter the access code shared by the host.
          </p>

          <input
            value={accessCode}
            onChange={(e) =>
              setAccessCode(e.target.value.toUpperCase())
            }
            maxLength={6}
            placeholder="ABC123"
            className="
              mt-6
              w-full
              rounded-xl
              border
              border-neutral-300
              dark:border-neutral-700
              bg-transparent
              p-3
              text-center
              text-lg
              font-semibold
              uppercase
              tracking-widest
              outline-none
              focus:ring-2
              focus:ring-black
              dark:focus:ring-white
            "
          />

          <button
            type="submit"
            disabled={isPending}
            className="
              mt-6
              w-full
              rounded-xl
              bg-black
              py-3
              font-medium
              text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:bg-white
              dark:text-black
            "
          >
            {isPending ? "Checking..." : "Join Test"}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {test.title}
          </h1>

          <p className="mt-3 text-neutral-500 dark:text-neutral-400">
            {test.description ?? "No description provided"}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 p-5">
            <div>
              <p className="text-xs uppercase text-neutral-500">
                Duration
              </p>

              <p className="mt-1 text-lg font-semibold">
                {test.duration} mins
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-neutral-500">
                Questions
              </p>

              <p className="mt-1 text-lg font-semibold">
                {test.totalQuestions}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-neutral-500">
                Marks
              </p>

              <p className="mt-1 text-lg font-semibold">
                {test.totalMarks}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="
                flex-1
                rounded-xl
                border
                border-neutral-300
                dark:border-neutral-700
                py-3
                font-medium
                transition
                hover:bg-neutral-100
                dark:hover:bg-neutral-800
              "
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="
                flex-1
                rounded-xl
                bg-black
                py-3
                font-medium
                text-white
                transition
                hover:opacity-90
                dark:bg-white
                dark:text-black
              "
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}