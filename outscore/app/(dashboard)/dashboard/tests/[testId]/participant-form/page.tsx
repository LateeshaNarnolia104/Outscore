import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTestForHost } from "@/services/test.service";
import ParticipantFieldBuilder from "@/components/participant-form/ParticipantFieldBuilder";
import { ParticipantField } from "@/validators/participant-fields";

export default async function ParticipantFormPage({
  params,
}: {
  params: Promise<{
    testId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { testId } = await params;

  const test = await getTestForHost(testId, session.user.id);

  if (!test) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Test not found or unauthorized.
      </div>
    );
  }

  const isEditable = test.status === "DRAFT";

  // Parse existing fields
  const initialFields = Array.isArray(test.settings?.participantFields)
    ? (test.settings.participantFields as unknown as ParticipantField[])
    : undefined;

  return (
    <main className="max-w-3xl mx-auto p-8 text-neutral-900 dark:text-neutral-100">
      <Link
        href="/dashboard"
        className="inline-flex items-center mb-6 text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition"
      >
        ← Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Configure Registration Form
        </h1>
        <p className="text-neutral-500 mt-2">
          Design the form that participants must fill out before starting the
          test: <strong>{test.title}</strong>
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
        {!isEditable && (
          <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400">
            🔒 The participant registration form is locked because this test has
            already been published.
          </div>
        )}

        {isEditable && (
          <ParticipantFieldBuilder
            testId={testId}
            initialFields={initialFields}
          />
        )}
      </div>
    </main>
  );
}
