import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getJoinedTestsAction } from "../../actions/participant.action";

export default async function JoinedTestsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const tests = await getJoinedTestsAction();

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Joined Tests
          </h1>

          <p className="text-neutral-500 mt-1">
            Tests you've participated in.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="border px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          ← Dashboard
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Joined Tests
          </h2>

          <p className="text-neutral-500 mt-2">
            Join a test using an access code to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tests.map((participant) => (
            <div
              key={participant.id}
              className="border rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {participant.test.title}
                  </h2>

                  <p className="text-neutral-500 mt-1">
                    {participant.test.description}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full border text-sm">
                  {participant.status.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                <div>
                  <p className="text-sm text-neutral-500">
                    Score
                  </p>

                  <p className="font-bold text-lg">
                    {participant.score} / {participant.test.totalMarks}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    Questions
                  </p>

                  <p className="font-bold">
                    {participant.test.totalQuestions}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    Access Code
                  </p>

                  <p className="font-mono">
                    {participant.test.accessCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    Joined
                  </p>

                  <p>
                    {new Date(
                      participant.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

              </div>

              {(participant.status === "SUBMITTED" ||
                participant.status === "AUTO_SUBMITTED") && (
                <div className="mt-6">
                  <Link
                    href={`/dashboard/joined/${participant.test.id}`}
                    className="bg-black text-white px-4 py-2 rounded-lg"
                  >
                    View Result →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}