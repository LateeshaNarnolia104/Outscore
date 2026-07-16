"use client";

import { useState } from "react";
import { createQuestionAction } from "@/app/(dashboard)/actions/question.action";
import { toast } from "sonner";

export default function AddQuestionForm({
  testId,
}: {
  testId: string;
}) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);

  async function handleSubmit() {
    await createQuestionAction({
      testId,
      questionText,
      marks,
      negativeMarks,
      options: options.map((option, index) => ({
        optionText: option,
        isCorrect: index === correct,
      })),
    });

    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    setMarks(1);
    setNegativeMarks(0);

    alert("Question Added");
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#111111] p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Add New Question
        </h2>

        <p className="mt-1 text-sm text-neutral-400">
          Fill in the details below.
        </p>
      </div>

      <div className="space-y-5">

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-300">
            Question
          </label>

          <textarea
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question..."
            className="w-full resize-none rounded-xl border border-neutral-700 bg-[#171717] px-4 py-3 text-white placeholder:text-neutral-500 focus:border-orange-500/80 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-neutral-300">
            Options
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <div
                key={index}
                className={`rounded-xl border p-3 transition ${
                  correct === index
                    ? "border-orange-500/80 bg-orange-500/5"
                    : "border-neutral-700 bg-[#171717]"
                }`}
              >
                <div className="flex items-center gap-3">

                  <input
                    type="radio"
                    checked={correct === index}
                    onChange={() => setCorrect(index)}
                    className="h-4 w-4 accent-orange-500/80 cursor-pointer"
                  />

                  <div className="flex-1">

                    <p className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
                      Option {index + 1}
                    </p>

                    <input
                      value={option}
                      onChange={(e) => {
                        const updated = [...options];
                        updated[index] = e.target.value;
                        setOptions(updated);
                      }}
                      placeholder={`Enter option ${index + 1}`}
                      className="w-full bg-transparent text-white placeholder:text-neutral-500 focus:outline-none"
                    />

                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Marks
            </label>

            <input
              type="number"
              min={1}
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-700 bg-[#171717] px-4 py-3 text-white focus:border-orange-500/80 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Negative Marks
            </label>

            <input
              type="number"
              min={0}
              step="0.25"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-700 bg-[#171717] px-4 py-3 text-white focus:border-orange-500/80 focus:outline-none"
            />
          </div>

        </div>

        <div className="flex justify-end border-t border-neutral-800 pt-5">

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-orange-500/80 px-6 py-2.5 font-semibold text-black hover:bg-orange-500 transition cursor-pointer"
          >
            + Add Question
          </button>

        </div>

      </div>
    </div>
  );
}