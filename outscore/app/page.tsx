import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold">Outscore</h1>

        <Link
          href="/login"
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Login
        </Link>
      </nav>

      <section className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4">
          Create & Conduct Online Tests
        </h1>

        <p className="text-gray-600 max-w-xl mb-6">
          Build MCQ tests, share links with students, monitor attempts and
          evaluate results.
        </p>

        <Link
          href="/login"
          className="px-6 py-3 bg-black text-white rounded-md"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}