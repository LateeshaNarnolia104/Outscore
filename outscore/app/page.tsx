import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <nav className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-bold">Outscore</h1>

        <Link
          href="/login"
          className="px-4 py-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-md font-medium transition-colors duration-200"
        >
          Login
        </Link>
      </nav>

      <section className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Create & Conduct Online Tests
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mb-8 leading-relaxed">
          Build MCQ tests, share links with students, monitor attempts and
          evaluate results.
        </p>

        <Link
          href="/login"
          className="px-6 py-3 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-md font-medium text-lg shadow-sm transition-all duration-200"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}