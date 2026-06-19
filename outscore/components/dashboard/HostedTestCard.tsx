import { TestStatus } from "@prisma/client";
import PublishButton from "./PublishButton";
import CopyCodeButton from "./CopyCodeButton";
import AddQuestionsButton from "./AddQuestionsButton";

type HostedTestCardProps = {
  test: {
    id: string;
    title: string;
    description: string | null;
    accessCode: string;
    duration: number;
    status: TestStatus;
    totalQuestions: number;
    totalMarks: number;
  };
};

export default function HostedTestCard({
  test,
}: HostedTestCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {test.title}
        </h2>

        <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          {test.status}
        </span>
      </div>

      <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm min-h-10 leading-relaxed">
        {test.description ?? "No description provided"}
      </p>

      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase font-medium">Access Code</p>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{test.accessCode}</p>
        </div>

        <div>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase font-medium">Duration</p>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
            {test.duration} mins
          </p>
        </div>

        <div>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase font-medium">Questions</p>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
            {test.totalQuestions}
          </p>
        </div>

        <div>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase font-medium">Marks</p>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
            {test.totalMarks}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-neutral-100 dark:border-neutral-800 pt-5">

        <AddQuestionsButton
          testId={test.id}
        />

        <CopyCodeButton
          accessCode={test.accessCode}
        />

        {test.status === "DRAFT" ? (
          <PublishButton
            testId={test.id}
          />
        ) : (
          <span className="rounded-lg bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400">
            ✓ Published
          </span>
        )}

      </div>
    </div>
  );
}

