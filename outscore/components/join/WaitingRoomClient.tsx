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
  const [status, setStatus] = useState<string>("PUBLISHED");

  useEffect(() => {
    // Poll test status every 3 seconds
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
        console.error("Error polling test status:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [testId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl text-center space-y-6">
        
        {/* Pulse Indicator */}
        <div className="flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 bg-pink-500 shadow-lg flex items-center justify-center text-white font-bold">
              ⏳
            </span>
          </div>
        </div>

        {/* Header Success Message */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-green-400 tracking-wide uppercase">
            ✔ Registration Complete
          </p>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {testTitle}
          </h1>
          <p className="text-neutral-400 text-sm">
            Candidate: <span className="font-semibold text-neutral-200">{participantName}</span>
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800"></div>

        {/* Status */}
        <div className="space-y-2">
          <p className="text-neutral-300 font-medium text-base">
            You are in the waiting room
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-xl bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest border border-neutral-700 animate-pulse">
            WAITING FOR HOST TO START TEST
          </div>
          <p className="text-neutral-400 text-xs">
            Waiting for host to start the test...
          </p>
        </div>

        {/* Warnings */}
        <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-3.5 text-xs text-red-300 font-medium">
          ⚠️ Please do not close this tab or navigate away.
        </div>

      </div>
    </div>
  );
}
