import AddQuestionForm from "@/components/question/AddQuestionForm";
import { getQuestions } from "@/services/question.service";
import DeleteQuestionButton from "@/components/question/DeleteQuestionButton";
import EditQuestionButton from "@/components/question/EditQuestionButton";
import Link from "next/link";
import { auth } from "@/auth";
import { getTestForHost } from "@/services/test.service";
import { redirect } from "next/navigation";

export default async function TestPage({
  params,
}: {
  params: Promise<{
    testId: string;
  }>;
}) {
  const { testId } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const test = await getTestForHost(testId, session.user.id);

  if (!test) {
    redirect("/dashboard");
  }

  const isEditable = test.status === "DRAFT";

  const questions = await getQuestions(testId);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center mb-4 text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6">Add Questions</h1>

      {isEditable ? (
        <AddQuestionForm testId={testId} />
      ) : (
        <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400">
          🔒 Questions are locked because this test has already been published.
        </div>
      )}

      <div className="mt-10 space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-xl p-5">
            <h2 className="font-bold text-lg">Question {index + 1}</h2>
            {isEditable && (
              <div className="flex gap-2">
                <EditQuestionButton
                  question={{
                    ...question,
                    testId,
                  }}
                />

                <DeleteQuestionButton
                  questionId={question.id}
                  testId={testId}
                />
              </div>
            )}

            <p className="mt-2">{question.questionText}</p>

            <div className="mt-4 space-y-2">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-2 rounded ${
                    option.isCorrect ? "bg-green-100 dark:bg-green-900" : ""
                  }`}
                >
                  {option.optionText}
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Marks: {question.marks}</p>

              {question.negativeMarks > 0 && (
                <p>Negative Marks: {question.negativeMarks}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
