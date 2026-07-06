"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WarningType } from "@prisma/client";

import { recordWarningAction } from "@/app/(dashboard)/actions/warning.action";
import { submitTestAction } from "@/app/(dashboard)/actions/attempt.action";

type ProctoringProps = {
  testId: string;
};

export default function Proctoring({ testId }: ProctoringProps) {
  const router = useRouter();

  const cooldown = useRef(false);
  const [started, setStarted] = useState(false);

  const [warnings, setWarnings] = useState(0);
  const [maxWarnings, setMaxWarnings] = useState(3);

  const [popup, setPopup] = useState<{
    title: string;
    message: string;
  } | null>(null);

  async function reportViolation(type: WarningType, message: string) {
    if (cooldown.current) return;

    cooldown.current = true;

    setTimeout(() => {
      cooldown.current = false;
    }, 1500);

    console.log("Reporting:", type);

    const result = await recordWarningAction(testId, type, message);

    console.log(result);

    if (!result.success) return;

    const { warnings, maxWarnings, remainingWarnings, autoSubmit } = result;

    setWarnings(warnings);
    setMaxWarnings(maxWarnings);

    if (autoSubmit) {
      setPopup({
        title: "Maximum Warnings Reached",
        message:
          "You have exceeded the maximum number of warnings.\n\nYour assessment is being submitted automatically.",
      });

      await submitTestAction(testId, true);

      router.replace(`/take-test/${testId}/submitted`);

      return;
    }

    setPopup({
      title: "Warning",
      message: `${message}

Warnings: ${warnings}/${maxWarnings}

Remaining warnings: ${remainingWarnings}`,
    });
  }

  useEffect(() => {
    if (!started) return;
    let pageHidden = false;

    function visibilityHandler() {
      if (!document.hidden) {
        pageHidden = false;
        return;
      }

      pageHidden = true;

      reportViolation("TAB_SWITCH", "Tab switching detected.");
    }

    function blurHandler() {
      if (pageHidden) return;

      reportViolation("WINDOW_BLUR", "Window focus lost.");
    }

    function fullscreenHandler() {
      if (document.fullscreenElement) return;

      reportViolation("FULLSCREEN_EXIT", "You exited fullscreen mode.");
    }

    document.addEventListener("visibilitychange", visibilityHandler);

    window.addEventListener("blur", blurHandler);

    document.addEventListener("fullscreenchange", fullscreenHandler);

    return () => {
      document.removeEventListener("visibilitychange", visibilityHandler);

      window.removeEventListener("blur", blurHandler);

      document.removeEventListener("fullscreenchange", fullscreenHandler);
    };
  }, [started]);

  if (!started) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-neutral-900">
          <h2 className="text-2xl font-bold">Assessment Instructions</h2>

          <ul className="mt-6 space-y-3 text-neutral-600 dark:text-neutral-300">
            <li>• This assessment must be taken in fullscreen mode.</li>

            <li>• Do not switch tabs or windows.</li>

            <li>• Exiting fullscreen counts as a warning.</li>

            <li>• Multiple warnings will automatically submit your test.</li>

            <li>• Ensure a stable internet connection before continuing.</li>
          </ul>

          <button
            className="mt-8 w-full rounded-xl bg-black py-3 font-semibold text-white dark:bg-white dark:text-black"
            onClick={async () => {
              try {
                await document.documentElement.requestFullscreen();

                setStarted(true);
              } catch {
                alert("Please allow fullscreen to start the assessment.");
              }
            }}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Warning Counter */}

      <div className="fixed top-5 right-5 z-50 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
          Warnings
        </p>

        <p className="text-2xl font-bold text-red-500">
          {warnings} / {maxWarnings}
        </p>
      </div>

      {/* Popup */}

      {popup && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-105 rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
            <h2 className="text-xl font-bold">{popup.title}</h2>

            <p className="mt-4 whitespace-pre-line text-neutral-600 dark:text-neutral-300">
              {popup.message}
            </p>

            {!popup.title.includes("Maximum") && (
              <button
                onClick={async () => {
                  if (!document.fullscreenElement) {
                    try {
                      await document.documentElement.requestFullscreen();
                    } catch {}
                  }

                  setPopup(null);
                }}
                className="mt-6 w-full rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                Continue Test
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
