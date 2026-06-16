"use client";

import { useState } from "react";
import { updateQuestionAction } from "@/app/(dashboard)/actions/question.action";

type Option = {
  id: string;
  optionText: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  testId: string;
  questionText: string;
  marks: number;
  negativeMarks: number;
  options: Option[];
};

export default function EditQuestionButton({
  question,
}: {
  question: Question;
}) {
  const [editing, setEditing] = useState(false);

  const [questionText, setQuestionText] = useState(
    question.questionText
  );

  const [marks, setMarks] = useState(question.marks);

  const [negativeMarks, setNegativeMarks] = useState(
    question.negativeMarks
  );

  const [options, setOptions] = useState(
    question.options.map((o) => o.optionText)
  );

  const [correct, setCorrect] = useState(
    question.options.findIndex((o) => o.isCorrect)
  );

  async function handleSave() {
    await updateQuestionAction(question.id, {
      testId: question.testId,
      questionText,
      marks,
      negativeMarks,
      options: options.map((option, index) => ({
        optionText: option,
        isCorrect: index === correct,
      })),
    });

    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="space-y-3 border p-4 rounded mt-3">
      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {options.map((option, index) => (
        <input
          key={index}
          value={option}
          onChange={(e) => {
            const temp = [...options];
            temp[index] = e.target.value;
            setOptions(temp);
          }}
          className="w-full border p-2 rounded"
        />
      ))}

      <select
        value={correct}
        onChange={(e) =>
          setCorrect(Number(e.target.value))
        }
        className="border p-2 rounded"
      >
        <option value={0}>Option 1 Correct</option>
        <option value={1}>Option 2 Correct</option>
        <option value={2}>Option 3 Correct</option>
        <option value={3}>Option 4 Correct</option>
      </select>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={marks}
          onChange={(e) =>
            setMarks(Number(e.target.value))
          }
          className="border p-2 rounded"
        />

        <input
          type="number"
          step="0.25"
          value={negativeMarks}
          onChange={(e) =>
            setNegativeMarks(Number(e.target.value))
          }
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}