"use client";

import { deleteQuestionAction }
from "@/app/(dashboard)/actions/question.action";

export default function DeleteQuestionButton({
  questionId,
  testId,
}: {
  questionId: string;
  testId: string;
}) {
  async function handleDelete() {
    const confirmed = confirm(
      "Delete this question?"
    );

    if (!confirmed) return;

    await deleteQuestionAction(
      questionId,
      testId
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  );
}