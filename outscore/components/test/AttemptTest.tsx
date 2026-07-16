"use client";

import { useState, useTransition } from "react";
import { saveAnswerAction } from "@/app/(dashboard)/actions/attempt.action";
import { toast } from "sonner";

type AttemptTestProps = {
  testId: string;

  questions: {
    id: string;
    questionText: string;

    options: {
      id: string;
      optionText: string;
    }[];
  }[];

  initialAnswers?: Record<string, string>;
};

export default function AttemptTest({
  testId,
  questions,
  initialAnswers,
}: AttemptTestProps) {
  const [isPending, startTransition] = useTransition();

  const [answers, setAnswers] = useState<Record<string, string>>(
    initialAnswers ?? {}
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    startTransition(async () => {
      try {
        await saveAnswerAction(testId, questionId, optionId);
      } catch {
        toast.error("Failed to save answer");
      }
    });
  }

  return (
    <div className="grid grid-cols-[220px_1fr] gap-8">
      {/* LEFT SIDEBAR */}

      <aside className="sticky top-8 h-fit rounded-3xl border border-neutral-800 bg-[#111111] p-6">
        <h2 className="mb-5 text-lg font-semibold">
          Questions
        </h2>

        <div className="grid grid-cols-4 gap-3">
          {questions.map((question, index) => {
            const answered = !!answers[question.id];

            const active = currentQuestion === index;

            return (
              <button
                key={question.id}
                onClick={() => {
                  setCurrentQuestion(index);

                  document
                    .getElementById(question.id)
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className={`
                  h-11
                  w-11
                  rounded-xl
                  border
                  text-sm
                  font-semibold
                  transition

                  ${
                    active
                      ? "border-orange-500/80 bg-orange-500/80 text-black"
                      : answered
                      ? "border-orange-500/30 bg-orange-500/10 text-orange-500/80"
                      : "border-neutral-700 bg-neutral-900 hover:border-orange-500/40"
                  }
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-8 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500/80" />
            Current
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500/20 border border-orange-500/50" />
            Answered
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-neutral-700" />
            Not Answered
          </div>
        </div>
      </aside>

      {/* QUESTIONS */}

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div
            key={question.id}
            id={question.id}
            className="rounded-3xl border border-neutral-800 bg-[#111111] p-7"
          >
            <div className="mb-6">
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500/80">
                Question {index + 1}
              </span>

              <h2 className="mt-4 text-xl font-semibold leading-relaxed">
                {question.questionText}
              </h2>
            </div>

            <div className="space-y-4">
              {question.options.map((option) => {
                const selected =
                  answers[question.id] === option.id;

                return (
                  <label
                    key={option.id}
                    className={`
                      flex
                      cursor-pointer
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      p-4
                      transition

                      ${
                        selected
                          ? "border-orange-500/50 bg-orange-500/10"
                          : "border-neutral-800 bg-neutral-900 hover:border-orange-500/30"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={selected}
                      onChange={() =>
                        handleSelect(
                          question.id,
                          option.id
                        )
                      }
                      className="h-5 w-5 accent-orange-500 cursor-pointer"
                    />

                    <span className="text-base">
                      {option.optionText}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {isPending && (
          <p className="text-sm text-neutral-500">
            Saving...
          </p>
        )}
      </div>
    </div>
  );
}