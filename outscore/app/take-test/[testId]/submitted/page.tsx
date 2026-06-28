import { getParticipantRankAction } from "@/app/(dashboard)/actions/leaderboard.action";

export default function SubmittedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border p-8 text-center">
        <h1 className="text-3xl font-bold">
          Test Submitted
        </h1>

        <p className="mt-4 text-neutral-500">
          Your responses have been saved
          successfully.
        </p>

        <p className="mt-2 text-neutral-500">
          You may now close this tab.
        </p>
      </div>
    </main>
  );
}