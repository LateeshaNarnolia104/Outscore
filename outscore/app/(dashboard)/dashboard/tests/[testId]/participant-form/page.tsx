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
      <div className="p-8 text-center text-red-500">
        Test not found.
      </div>
    );
  }

  const isEditable = test.status === "DRAFT";

  const initialFields = Array.isArray(test.settings?.participantFields)
    ? (test.settings.participantFields as unknown as ParticipantField[])
    : undefined;

  return (
    <main className="px-8 py-8">

      {/* Back Button */}
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

      {/* Page Content */}
      <div className="max-w-4xl mx-auto pt-6">

        <div className="mb-4">
          <h1 className="text-4xl font-bold text-white">
            Participant Registration Form
          </h1>

          <p className="mt-2 text-neutral-500">
            Configure the information participants must provide before joining
            <span className="text-orange-500/80 font-medium">
              {" "}
              {test.title}
            </span>
          </p>
        </div>

        {!isEditable && (
          <div className="mb-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-500/80">
            This registration form is locked because the test has already been
            published.
          </div>
        )}

        <div className="rounded-3xl border border-neutral-800 bg-[#111111] p-4">
          {isEditable && (
            <ParticipantFieldBuilder
              testId={testId}
              initialFields={initialFields}
            />
          )}
        </div>

      </div>

    </main>
  );
}