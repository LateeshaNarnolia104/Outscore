import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 transition-colors duration-200">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 w-full max-w-md bg-white dark:bg-neutral-900 shadow-sm transition-all duration-200">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight text-neutral-900 dark:text-neutral-100">
          Welcome Back
        </h1>

        <p className="text-center text-neutral-500 dark:text-neutral-400 mb-6">
          Sign in to continue
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: "/dashboard",
            });
          }}
        >
          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 py-3 rounded-md font-medium transition-colors duration-200 cursor-pointer"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}