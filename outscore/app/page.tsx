"use client";

import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import MouseSpotlight from "@/components/MouseSpotlight/MouseSpotlight";
import NoiseGrid from "@/components/ui/NoiseGrid";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#151515] text-white overflow-hidden relative">
      <NoiseGrid />
      <MouseSpotlight />

      {/* BACKGROUND ATMOSPHERE */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] bg-orange-500 blur-[180px] rounded-full" />

        <div className="absolute bottom-[-250px] right-[-250px] w-[700px] h-[700px] bg-amber-500/5 blur-[220px] rounded-full" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 backdrop-blur-2xl bg-[#151515] border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <h1 className="text-2xl font-bold tracking-tight">Outscore</h1>
          </div>

          <Link
            href="/login"
            className="
              px-5 py-2
              rounded-xl
              text-black
              font-semibold
              bg-gradient-to-r
              from-orange-500
              to-amber-500
              shadow-[0_0_20px_rgba(249,115,22,0.15)]
              hover:shadow-[0_0_35px_rgba(249,115,22,0.25)]
              transition-all duration-300
            "
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 pt-12 pb-18 relative z-10">
        <div className="grid lg:grid-cols-2 gap-15 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-sm mb-5">
              Online Assessment Platform
            </div>

            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Assess{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                  Smarter.
                </span>
                <br />
                Not Harder.
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-5 text-xl text-slate-400 leading-relaxed max-w-xl">
                Create assessments, share access codes, manage participants and
                evaluate results all from one clean platform.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  href="/login"
                  className="
                    px-7 py-4
                    rounded-xl
                    font-bold
                    text-black
                    bg-gradient-to-r
                    from-orange-500
                    to-amber-500
                    shadow-[0_0_25px_rgba(249,115,22,0.15)]
                    hover:shadow-[0_0_35px_rgba(249,115,22,0.25)]
                    transition-all duration-300
                    hover:-translate-y-1
                  "
                >
                  Get Started
                </Link>

                <a
                  href="#features"
                  className="
                    px-7 py-4
                    rounded-xl
                    bg-white/5
                    backdrop-blur-xl
                    border border-white
                    hover:border-orange-500
                    transition-all duration-300
                    hover:-translate-y-1
                  "
                >
                  Learn More
                </a>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT DASHBOARD */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full" />

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Java Assessment</h3>

                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                  LIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Participants", "132"],
                  ["Avg Score", "78%"],
                  ["Questions", "25"],
                  ["Duration", "60m"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="
                      bg-white/5
                      backdrop-blur-xl
                      border border-white/5
                      p-4
                      rounded-xl
                      hover:border-orange-500/20
                      hover:-translate-y-1
                      transition-all duration-300
                    "
                  >
                    <p className="text-slate-400 text-sm">{label}</p>

                    <h2 className="text-3xl font-bold mt-2">{value}</h2>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-8 py-14 relative z-10"
      >
        <FadeIn>
          <h2 className="text-4xl font-bold text-center mb-16">
            Built For Modern Assessments
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Instant Test Creation",
              desc: "Create MCQ assessments in minutes.",
            },
            {
              title: "Access Code Joining",
              desc: "Participants join using a simple code.",
            },
            {
              title: "Result Tracking",
              desc: "Monitor performance and submissions.",
            },
          ].map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.15}>
              <div
                className="
                  bg-white/5
                  backdrop-blur-xl
                  border border-white/10
                  rounded-3xl
                  p-8
                  transition-all duration-300
                  hover:-translate-y-3
                  hover:border-orange-500/30
                  hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]
                "
              >
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>

                <p className="text-slate-400">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section
        id="roles"
        className="max-w-7xl mx-auto px-8 py-14 relative z-10"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn>
            <div
              className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-orange-500
                hover:-translate-y-3
                transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                <span className="text-orange-400 font-semibold">FOR HOSTS</span>

                <h2 className="text-3xl font-bold mt-4">
                  Create & Manage Assessments
                </h2>

                <p className="mt-6 text-slate-400 flex-grow">
                  Build tests, add questions, publish assessments, monitor
                  participants and evaluate results.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div
              className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-orange-500
                hover:-translate-y-3
                transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                <span className="text-orange-400 font-semibold">
                  FOR PARTICIPANTS
                </span>

                <h2 className="text-3xl font-bold mt-4">
                  Join & Attempt Tests
                </h2>

                <p className="mt-6 text-slate-400 flex-grow">
                  Enter an access code, complete required details and attempt
                  assessments seamlessly.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-8 py-14 relative z-10">
        <FadeIn>
          <div
            className="
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              rounded-3xl
              p-12
              text-center
            "
          >
            <h2 className="text-4xl font-bold">Ready to get started?</h2>

            <p className="mt-4 text-slate-400">
              Create your first assessment and start evaluating participants.
            </p>

            <Link
              href="/login"
              className="
                inline-block
                mt-8
                px-8
                py-4
                rounded-xl
                font-bold
                bg-gradient-to-r
                from-orange-500
                to-amber-500
                shadow-[0_0_25px_rgba(249,115,22,0.15)]
                hover:shadow-[0_0_35px_rgba(249,115,22,0.25)]
                hover:-translate-y-1
                transition-all duration-300
                text-black
              "
            >
              Launch Outscore
            </Link>
          </div>
        </FadeIn>
      </section>

      <footer className="border-t border-white/10 mt-24">
  <div className="max-w-7xl mx-auto px-8 py-8 text-center">
    <p className="text-slate-500 text-sm">
      Open source on{" "}
      <a
        href="https://github.com/LateeshaNarnolia104/Outscore"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 transition-colors"
      >
        GitHub
      </a>
      {" • "}
      © {new Date().getFullYear()} Outscore
    </p>
  </div>
</footer>
    </main>
  );
}
