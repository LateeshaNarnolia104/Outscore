"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitTestAction } from "@/app/(dashboard)/actions/attempt.action";
import { getTestStatusAction } from "@/app/(dashboard)/actions/test.action";

type TestTimerProps = {
  endsAt: Date | string;
  testId: string;
};

export default function TestTimer({ endsAt, testId }: TestTimerProps) {
  const router = useRouter();

  const [remaining, setRemaining] = useState(0);

  const submittedRef = useRef(false);

  useEffect(() => {
    async function autoSubmit() {
      if (submittedRef.current) return;

      submittedRef.current = true;

      try {
        await submitTestAction(testId, true);
        router.replace(`/take-test/${testId}/submitted`);
      } catch (error) {
        console.error(error);
      }
    }

    async function updateTimer() {
      const status = await getTestStatusAction(testId);

      if (status === "COMPLETED") {
        await autoSubmit();
        return;
      }

      const diff = new Date(endsAt).getTime() - Date.now();

      if (diff <= 0) {
        setRemaining(0);

        await autoSubmit();
        return;
      }

      setRemaining(Math.max(0, diff));
    }

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endsAt, testId, router]);

  const totalSeconds = Math.floor(remaining / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return (
    <div
      className="
      rounded-2xl
      border
      border-neutral-800
      bg-[#171717]
      px-6
      py-4
      min-w-[180px]
    "
    >
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        Time Remaining
      </p>

      <p
        className={`
        mt-2
        text-3xl
        font-bold
        tabular-nums
        ${
          totalSeconds <= 60
            ? "text-red-500"
            : totalSeconds <= 300
              ? "text-orange-500/80"
              : "text-white"
        }
      `}
      >
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </p>

      <p className="mt-1 text-xs text-neutral-500">
        {totalSeconds <= 60
          ? "Less than 1 minute left"
          : totalSeconds <= 300
            ? "Final 5 minutes"
            : "Timer is running"}
      </p>
    </div>
  );
}
