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

  async function reportViolation(
    type: WarningType,
    message: string
  ) {
    if (cooldown.current) return;

    cooldown.current = true;

    setTimeout(() => {
      cooldown.current = false;
    }, 1500);

    const result = await recordWarningAction(
      testId,
      type,
      message
    );

    if (!result.success) return;

    const {
      warnings,
      maxWarnings,
      remainingWarnings,
      autoSubmit,
    } = result;

    setWarnings(warnings);
    setMaxWarnings(maxWarnings);

    if (autoSubmit) {
      setPopup({
        title: "Assessment Submitted",
        message:
          "Maximum warning limit reached.\n\nYour test has been submitted automatically.",
      });

      await submitTestAction(testId, true);

      router.replace(`/take-test/${testId}/submitted`);

      return;
    }

    setPopup({
      title: "Warning",
      message: `${message}

Warnings: ${warnings}/${maxWarnings}

Remaining: ${remainingWarnings}`,
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

      reportViolation(
        "TAB_SWITCH",
        "Tab switching detected."
      );
    }

    function blurHandler() {
      if (pageHidden) return;

      reportViolation(
        "WINDOW_BLUR",
        "Window focus lost."
      );
    }

    function fullscreenHandler() {
      if (document.fullscreenElement) return;

      reportViolation(
        "FULLSCREEN_EXIT",
        "Fullscreen exited."
      );
    }

    document.addEventListener(
      "visibilitychange",
      visibilityHandler
    );

    window.addEventListener("blur", blurHandler);

    document.addEventListener(
      "fullscreenchange",
      fullscreenHandler
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        visibilityHandler
      );

      window.removeEventListener("blur", blurHandler);

      document.removeEventListener(
        "fullscreenchange",
        fullscreenHandler
      );
    };
  }, [started]);

  if (!started) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6">

        <div
          className="
            w-full
            max-w-2xl
            rounded-3xl
            border
            border-neutral-800
            bg-[#111111]
            p-8
          "
        >
          <h1 className="text-3xl font-bold text-white">
            Ready to Begin?
          </h1>

          <p className="mt-3 text-neutral-500">
            Please read the instructions carefully before
            starting your assessment.
          </p>

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-neutral-800
              bg-neutral-900
              p-6
            "
          >
            <ul className="space-y-4 text-neutral-300">

              <li>• Stay in fullscreen during the assessment.</li>

              <li>• Do not switch tabs or applications.</li>

              <li>• Leaving fullscreen counts as a warning.</li>

              <li>
                • Multiple warnings will automatically
                submit your assessment.
              </li>

              <li>
                • Make sure your internet connection is
                stable.
              </li>

            </ul>
          </div>

          <button
            onClick={async () => {
              try {
                await document.documentElement.requestFullscreen();

                setStarted(true);
              } catch {
                setPopup({
                  title: "Fullscreen Required",
                  message:
                    "Please allow fullscreen mode before starting the assessment.",
                });
              }
            }}
            className="
              mt-8
              w-full
              rounded-2xl
              bg-orange-500/80
              py-4
              font-semibold
              text-black
              hover:bg-orange-500
              transition-colors
            "
          >
            Start Assessment
          </button>
        </div>

      </div>
    );
  }

  return (
    <>
      <div
        className="
          fixed
          right-6
          top-6
          z-50
          rounded-2xl
          border
          border-red-500/20
          bg-[#111111]
          px-5
          py-4
        "
      >
        <p className="text-xs uppercase tracking-wider text-red-400">
          Warnings
        </p>

        <p className="mt-1 text-2xl font-bold text-red-400">
          {warnings} / {maxWarnings}
        </p>
      </div>

      {popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6">

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
            <h2 className="text-2xl font-bold text-white">
              {popup.title}
            </h2>

            <p className="mt-5 whitespace-pre-line text-neutral-400">
              {popup.message}
            </p>

            {!popup.title.includes("Assessment Submitted") && (
              <button
                onClick={async () => {
                  if (!document.fullscreenElement) {
                    try {
                      await document.documentElement.requestFullscreen();
                    } catch {}
                  }

                  setPopup(null);
                }}
                className="
                  mt-8
                  w-full
                  rounded-2xl
                  bg-orange-500/80
                  py-3
                  font-semibold
                  text-black
                  hover:bg-orange-500
                "
              >
                Continue Assessment
              </button>
            )}
          </div>

        </div>
      )}
    </>
  );
}