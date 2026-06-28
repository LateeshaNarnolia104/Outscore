import { auth } from "@/auth";
import Link from "next/link";
import { getHostedTestsAction } from "../actions/test.action";
import HostedTestCard from "@/components/dashboard/HostedTestCard";
import { redirect } from "next/navigation";
import CreateTestDialog from "@/components/create-test/CreateTestDialog";
import SignOutButton from "@/components/Button/SignOutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>Please login.</div>;
  }

  const hostedTests = await getHostedTestsAction();

  return (
    <main className="w-full p-8 min-h-screen text-neutral-900 dark:text-neutral-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-3xl font-extrabold tracking-tight">Outscore</h1>

        <SignOutButton />
      </nav>

      {/* Welcome Section */}
      <div className="mt-10">
        <h2 className="text-5xl font-bold leading-tight">
          Welcome,
          {session.user.name}
        </h2>

        <p className="mt-3 text-lg text-neutral-500 dark:text-neutral-400">
          Manage your hosted assessments.
        </p>

        <div className="mt-6 flex gap-4">
          <CreateTestDialog />

          <Link
            href="/join"
            className="
            px-6 py-3
            rounded-2xl
            bg-neutral-800
            hover:bg-neutral-700
            text-white
            font-medium
            transition
          "
          >
            Join Test
          </Link>
          <Link
            href="/dashboard/joined"
            className="px-6 py-3
            rounded-2xl
            bg-neutral-800
            hover:bg-neutral-700
            text-white
            font-medium
            transition"
          >
            Joined Tests
          </Link>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {hostedTests.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 shadow-sm">
            <p className="text-lg font-medium">No hosted tests yet.</p>

            <p className="text-sm mt-1 text-neutral-400">
              Click the button above to create your first assessment.
            </p>
          </div>
        ) : (
          hostedTests.map((test) => (
            <div
              key={test.id}
              className="mb-4 hover:scale-[1.01] transition-all duration-200"
            >
              <HostedTestCard test={test} />
            </div>
          ))
        )}
      </div>
    </main>
  );
}
