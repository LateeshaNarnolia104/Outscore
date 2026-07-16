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
  const liveTests = hostedTests.filter((test) => test.status === "LIVE").length;

  return (
    <main className="w-full p-8 min-h-screen bg-black  text-white dark:text-neutral-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-3xl font-extrabold tracking-tight">Outscore</h1>

        <SignOutButton />
      </nav>

      {/* Welcome Section */}
      {/* Hero */}

      <section className="mt-10 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#111111] to-[#1a1a1a] p-8 shadow-2xl shadow-orange-500/5">
        <p className="text-orange-500 font-semibold tracking-widest uppercase text-sm">
          Dashboard
        </p>

        <h2 className="mt-3 text-5xl font-black tracking-tight text-white">
          Welcome back,
          <span className="text-orange-500/80"> {session.user.name}</span>
        </h2>

        <p className="mt-4 text-neutral-400 max-w-2xl leading-7">
          Create assessments, publish tests, monitor participants, and analyze
          results—all from one place.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6 hover:border-orange-500 transition">
            <p className="text-neutral-400 text-sm">Hosted Tests</p>

            <h3 className="text-4xl font-black mt-2 text-white">
              {hostedTests.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6 hover:border-orange-500 transition">
            <p className="text-neutral-400 text-sm">Joined Tests</p>

            <h3 className="text-4xl font-black mt-2 text-white">--</h3>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6 hover:border-orange-500 transition">
            <p className="text-neutral-400 text-sm">Live Tests</p>

            <h3 className="text-4xl font-black mt-2 text-orange-500/90">
              {liveTests}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-10">
          <CreateTestDialog />

          <Link
            href="/join"
            className="rounded-xl bg-orange-500/80 hover:bg-orange-600 px-6 py-3 font-semibold text-white transition"
          >
            Join Test
          </Link>

          <Link
            href="/dashboard/joined"
            className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold hover:border-orange-500/80 hover:text-orange-500 transition"
          >
            Joined Tests
          </Link>
        </div>
      </section>

      <div className="mt-14 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Hosted Assessments</h2>

          <p className="text-neutral-400 mt-1">
            Manage and monitor all your hosted tests.
          </p>
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
