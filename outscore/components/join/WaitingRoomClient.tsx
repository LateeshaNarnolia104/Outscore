"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestStatusAction } from "@/app/(dashboard)/actions/test.action";

type WaitingRoomClientProps = {
  testId: string;
  testTitle: string;
  participantName: string;
};

export default function WaitingRoomClient({
  testId,
  testTitle,
  participantName,
}: WaitingRoomClientProps) {
  const router = useRouter();

  const [status, setStatus] = useState("PUBLISHED");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const currentStatus = await getTestStatusAction(testId);

        if (currentStatus) {
          setStatus(currentStatus);

          if (currentStatus === "LIVE") {
            clearInterval(interval);
            router.push(`/take-test/${testId}`);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router, testId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 py-10">
      <div
        className="
          w-full
          max-w-xl
          rounded-3xl
          border
          border-neutral-800
          bg-[#111111]
          p-10
          shadow-2xl
          text-center
        "
      >
        {/* Animated Icon */}

        <div className="flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500/20"></span>

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/30 text-3xl">
              ⏳
            </div>
          </div>
        </div>

        {/* Header */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Registration Successful
          </p>

          <h1 className="mt-4 text-4xl font-bold text-white">
            {testTitle}
          </h1>

          <p className="mt-3 text-neutral-400">
            Your registration has been completed successfully.
          </p>
        </div>

        {/* Candidate */}

        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">
            Participant
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {participantName}
          </p>
        </div>

        {/* Waiting Status */}

        <div className="mt-8">
          <div
            className="
              inline-flex
              rounded-full
              bg-orange-500/10
              px-5
              py-2
              text-sm
              font-semibold
              text-orange-400
            "
          >
            Waiting for Host
          </div>

          <p className="mt-5 text-neutral-300">
            The host hasn't started the assessment yet.
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            Current Status :
            <span className="ml-2 font-semibold text-orange-400">
              {status}
            </span>
          </p>
        </div>

        {/* Loading Animation */}

        <div className="mt-8 flex justify-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500"></div>

          <div
            className="h-2 w-2 animate-bounce rounded-full bg-orange-500"
            style={{ animationDelay: "0.2s" }}
          ></div>

          <div
            className="h-2 w-2 animate-bounce rounded-full bg-orange-500"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Instructions */}

        <div
          className="
            mt-10
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            p-6
            text-left
          "
        >
          <p className="font-semibold text-red-400">
            Important Instructions
          </p>

          <ul className="mt-4 space-y-3 text-sm text-neutral-300">
            <li>• Keep this tab open until the assessment begins.</li>

            <li>• Do not refresh the page.</li>

            <li>• You'll automatically enter the assessment once the host starts the test.</li>

            <li>• Ensure you have a stable internet connection.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}