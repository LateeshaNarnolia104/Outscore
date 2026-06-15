import { auth } from "@/auth";
import { getHostedTestsAction } from "../actions/test.action";
import HostedTestCard from "@/components/dashboard/HostedTestCard";
import { redirect } from "next/navigation";
import CreateTestDialog from "@/components/create-test/CreateTestDialog";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>Please login.</div>;
  }

  const hostedTests = await getHostedTestsAction();

  return (
    <main className="mx-auto max-w-6xl p-8 min-h-screen text-neutral-900 dark:text-neutral-100">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {session.user.name}
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Manage your hosted assessments.
          </p>
        </div>

        <CreateTestDialog />
      </div>

      <div className="mt-8 space-y-4">
        {hostedTests.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 shadow-sm">
            <p className="text-lg font-medium">No hosted tests yet.</p>
            <p className="text-sm mt-1 text-neutral-400">Click the button above to create your first assessment.</p>
          </div>
        ) : (
          hostedTests.map((test) => (
            <HostedTestCard
              key={test.id}
              test={test}
            />
          ))
        )}
      </div>
    </main>
  );
}