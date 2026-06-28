import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07090D] overflow-hidden px-4">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-orange-500/10 blur-[180px] rounded-full" />

        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-amber-500/5 blur-[180px] rounded-full" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-3xl
            p-8
            shadow-[0_0_40px_rgba(0,0,0,0.3)]
          "
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xl font-bold text-white">
                Outscore
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center text-white">
            Welcome Back
          </h1>

          <p className="text-center text-slate-400 mt-3 mb-8">
            Sign in to continue to your dashboard
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
              className="
                w-full
                py-4
                rounded-xl
                font-semibold
                text-black
                bg-gradient-to-r
                from-orange-500
                to-amber-500
                shadow-[0_0_25px_rgba(249,115,22,0.15)]
                hover:shadow-[0_0_35px_rgba(249,115,22,0.25)]
                hover:-translate-y-1
                transition-all
                duration-300
                cursor-pointer
              "
            >
              Sign in with Google
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-slate-500">
              Secure authentication powered by Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}