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
    <main className="px-8 pt-8">
      <Link
        href="/dashboard"
        className="
        inline-flex
        items-center
        text-sm
        font-medium
        text-neutral-400
        hover:text-orange-500/80
        transition-colors
      "
      >
        ← Back to Dashboard
      </Link>
      <main className="max-w-4xl mx-auto p-8 pt-6 text-white">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Add Questions</h1>

          <p className="mt-2 text-neutral-500">
            Create multiple choice questions for your assessment.
          </p>
        </div>

        {isEditable ? (
          <AddQuestionForm testId={testId} />
        ) : (
          <div className="mb-8 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5 text-orange-500/80">
            This test has already been published. Questions can no longer be
            edited.
          </div>
        )}

        <div className="mt-12 space-y-8">
          {questions.length === 0 ? (
            <div className="rounded-3xl border border-neutral-800 bg-[#111111] p-10 text-center">
              <h3 className="text-xl font-semibold">No Questions Added Yet</h3>

              <p className="mt-2 text-neutral-500">
                Use the form above to add your first question.
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div
                key={question.id}
                className="
                rounded-3xl
                border
                border-neutral-800
                bg-[#111111]
                p-7
                space-y-6
              "
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <span
                      className="
                      inline-flex
                      rounded-full
                      bg-orange-500/10
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-orange-500/80
                    "
                    >
                      Question {index + 1}
                    </span>

                    <h2 className="mt-4 text-xl font-semibold leading-relaxed">
                      {question.questionText}
                    </h2>
                  </div>

                  <div className="flex gap-3">
                    <div className="rounded-xl border border-neutral-700 px-4 py-2 text-sm">
                      <p className="text-neutral-500 text-xs uppercase">
                        Marks
                      </p>

                      <p className="font-semibold">{question.marks}</p>
                    </div>

                    {question.negativeMarks > 0 && (
                      <div className="rounded-xl border border-red-900 px-4 py-2 text-sm">
                        <p className="text-neutral-500 text-xs uppercase">
                          Negative
                        </p>

                        <p className="font-semibold text-red-400">
                          -{question.negativeMarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}

                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`
                      rounded-2xl
                      border
                      p-4
                      flex
                      items-center
                      justify-between
                      ${
                        option.isCorrect
                          ? "border-orange-500/30 bg-orange-500/5"
                          : "border-neutral-800 bg-neutral-900"
                      }
                    `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                          h-3
                          w-3
                          rounded-full
                          ${
                            option.isCorrect
                              ? "bg-orange-500/80"
                              : "bg-neutral-600"
                          }
                        `}
                        />

                        <span>{option.optionText}</span>
                      </div>

                      {option.isCorrect && (
                        <span
                          className="
                          rounded-full
                          bg-orange-500/10
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          text-orange-500/80
                        "
                        >
                          Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Buttons */}

                {isEditable && (
                  <div className="flex justify-end gap-3 border-t border-neutral-800 pt-6">
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
              </div>
            ))
          )}
        </div>
      </main>
    </main>
  );
}
