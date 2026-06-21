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
  const [isPending, startTransition] =
    useTransition();

  const [answers, setAnswers] = useState<
  Record<string, string>
>(initialAnswers ?? {});

  function handleSelect(
    questionId: string,
    optionId: string
  ) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    startTransition(async () => {
      try {
        await saveAnswerAction(
          testId,
          questionId,
          optionId
        );
      } catch {
        toast.error("Failed to save answer");
      }
    });
  }

  return (
    <div className="space-y-6">

      {questions.map((question, index) => (
        <div
          key={question.id}
          className="rounded-xl border p-5"
        >
          <h2 className="font-semibold text-lg">
            Q{index + 1}. {question.questionText}
          </h2>

          <div className="mt-4 space-y-3">

            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={
                    answers[question.id] === option.id
                  }
                  onChange={() =>
                    handleSelect(
                      question.id,
                      option.id
                    )
                  }
                />

                <span>{option.optionText}</span>
              </label>
            ))}

          </div>
        </div>
      ))}

      {isPending && (
        <p className="text-sm text-neutral-500">
          Saving...
        </p>
      )}
    </div>
  );
}