import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTestForHost } from "@/services/test.service";
import { getParticipantsByTestId } from "@/services/participant.service";
import { ParticipantField } from "@/validators/participant-fields";

export default async function ParticipantsPage({
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

  const { participants, stats } = await getParticipantsByTestId(
    testId,
    session.user.id,
  );

  const dynamicFields = Array.isArray(test.settings?.participantFields)
    ? (test.settings.participantFields as unknown as ParticipantField[])
    : [];

  return (
    <main className="max-w-6xl mx-auto p-8 text-neutral-900 dark:text-neutral-100">
      <Link
        href="/dashboard"
        className="inline-flex items-center mb-6 text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition"
      >
        ← Back to Dashboard
      </Link>

      {/* Header Panel */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Leaderboard</h1>
        <p className="text-neutral-500 mt-2">
          Performance overview for <strong>{test.title}</strong>
        </p>
      </div>

      {/* Stat Card block */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-neutral-400 text-sm">Total Participants</p>

          <h2 className="text-4xl font-bold mt-3">{stats.totalParticipants}</h2>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-neutral-400 text-sm">Submitted</p>

          <h2 className="text-4xl font-bold mt-3 text-green-400">
            {stats.submittedCount}
          </h2>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-neutral-400 text-sm">Highest Score</p>

          <h2 className="text-4xl font-bold mt-3 text-yellow-400">
            {stats.highestScore}
          </h2>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-neutral-400 text-sm">Average Score</p>

          <h2 className="text-4xl font-bold mt-3">
            {stats.averageScore.toFixed(1)}
          </h2>
        </div>
      </div>

      {participants.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-16 text-center bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 shadow-sm">
          <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
            No participants yet
          </p>
          <p className="text-sm mt-1 text-neutral-400 dark:text-neutral-500">
            Share the access code{" "}
            <strong className="text-neutral-700 dark:text-neutral-300 font-mono bg-neutral-105 dark:bg-neutral-800 px-2 py-0.5 rounded">
              {test.accessCode}
            </strong>{" "}
            to invite candidates.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <th className="py-4 px-6 w-16">Rank</th>
                {dynamicFields.map((field) => (
                  <th key={field.id} className="py-4 px-6">
                    {field.label}
                  </th>
                ))}
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Accuracy</th>
                <th className="py-4 px-6">Joined At</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm text-neutral-900 dark:text-neutral-100">
              {participants.map((participant, index) => {
                const details =
                  (participant.details as Record<string, any>) || {};
                return (
                  <tr
                    key={participant.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-neutral-400 dark:text-neutral-500">
                      {index === 0 ? (
                        <span className="text-2xl">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-2xl">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </td>
                    {dynamicFields.map((field) => {
                      const val = details[field.id];
                      return (
                        <td key={field.id} className="py-4 px-6 font-semibold">
                          {val !== undefined && val !== null
                            ? String(val)
                            : "-"}
                        </td>
                      );
                    })}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                          participant.status === "SUBMITTED"
                            ? "bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20"
                            : participant.status === "AUTO_SUBMITTED"
                              ? "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20"
                              : participant.status === "IN_PROGRESS"
                                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
                        }`}
                      >
                        {participant.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6  text-neutral-950 dark:text-white">
                      {participant.status === "SUBMITTED" ||
                      participant.status === "AUTO_SUBMITTED"
                        ? `${(
                            (participant.score / test.totalMarks) *
                            100
                          ).toFixed(1)}%`
                        : "-"}
                    </td>
                    <td className="py-4 px-6 text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                      {new Date(participant.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/dashboard/participants-details/${participant.id}`}
                        className="inline-flex items-center rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:scale-105 transition hover:bg-yellow-400 hover:text-black duration-300"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
