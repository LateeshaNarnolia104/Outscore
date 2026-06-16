"use client";

import { useState } from "react";
import { createQuestionAction } from "@/app/(dashboard)/actions/question.action";

export default function AddQuestionForm({ testId }: { testId: string }) {
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

    alert("Question Added");
  }

  return (
    <div className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-lg">
      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Question"
        className="w-full border p-3 rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <input
            key={index}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${index + 1}`}
            className="border border-neutral-700 bg-neutral-900 p-3 rounded-xl"
          />
        ))}
      </div>

      <select
        value={correct}
        onChange={(e) => setCorrect(Number(e.target.value))}
        className="border p-2 rounded"
      >
        <option value={0}>Option 1 Correct</option>

        <option value={1}>Option 2 Correct</option>

        <option value={2}>Option 3 Correct</option>

        <option value={3}>Option 4 Correct</option>
      </select>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Marks</label>

          <input
            type="number"
            min={1}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Negative Marks</label>

          <input
            type="number"
            min={0}
            step="0.25"
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add Question
      </button>
    </div>
  );
}
