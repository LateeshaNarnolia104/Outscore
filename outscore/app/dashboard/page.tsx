import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome, {session.user.name}
      </h1>

      <div className="mt-8">
        <button className="bg-black text-white px-5 py-3 rounded-md">
          Create New Test
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Hosted Tests
        </h2>

        <p className="text-gray-500">
          No tests created yet.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Participated Tests
        </h2>

        <p className="text-gray-500">
          No tests attempted yet.
        </p>
      </div>
    </main>
  );
}