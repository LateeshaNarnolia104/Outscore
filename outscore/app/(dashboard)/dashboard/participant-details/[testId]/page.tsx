import Link from "next/link";

export default async function ParticipantDetailsPage({
  params,
}: {
  params: Promise<{
    testId: string;
  }>;
}) {
  const { testId } = await params;

  return (
    <main className="px-8 pt-8">

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

      <div className="max-w-5xl mx-auto pt-6 text-white">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Participant Details
          </h1>

          <p className="mt-2 text-neutral-500">
            View everyone who has registered and attempted this test.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
            <p className="text-sm text-neutral-500">
              Total Participants
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              0
            </h2>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
            <p className="text-sm text-neutral-500">
              Submitted
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              0
            </h2>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
            <p className="text-sm text-neutral-500">
              In Progress
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              0
            </h2>
          </div>

        </div>

        {/* Participant List */}
        <div className="rounded-3xl border border-neutral-800 bg-[#111111]">

          <div className="border-b border-neutral-800 px-8 py-6">
            <h2 className="text-2xl font-semibold">
              Registered Participants
            </h2>

            <p className="mt-1 text-neutral-500">
              All students who have joined this test will appear here.
            </p>
          </div>

          <div className="p-10 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-3xl">
              👥
            </div>

            <h3 className="text-xl font-semibold">
              No Participants Yet
            </h3>

            <p className="mt-2 text-neutral-500">
              Share your access code with students. Once someone joins the
              test, they'll appear here.
            </p>

            <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-4 inline-block">
              <p className="text-sm text-neutral-500">
                Test ID
              </p>

              <p className="mt-1 font-mono text-orange-500/80">
                {testId}
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}