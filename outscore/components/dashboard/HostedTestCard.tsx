import { Clock3, Hash, FileText, Copy, Trophy, PlayCircle } from "lucide-react";

import { TestStatus } from "@prisma/client";
import PublishButton from "./PublishButton";
import CopyCodeButton from "./CopyCodeButton";
import AddQuestionsButton from "./AddQuestionsButton";
import Link from "next/link";
import StartTestButton from "./StartTestButton";
import EndTestButton from "./EndTestButton";

type HostedTestCardProps = {
  test: {
    id: string;
    title: string;
    description: string | null;
    accessCode: string;
    duration: number;
    status: TestStatus;
    totalQuestions: number;
    totalMarks: number;
  };
};

export default function HostedTestCard({ test }: HostedTestCardProps) {
  const badgeStyle = {
    DRAFT: "bg-neutral-800 text-neutral-300 border-neutral-700",

    PUBLISHED: "bg-blue-500/10 text-blue-400 border-blue-500/20",

    LIVE: "bg-orange-500/10 text-orange-400 border-orange-500/20",

    COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
  };
  return (
    <div className="group rounded-3xl border border-neutral-800 bg-[#111111] p-7 transition-all duration-500 hover:border-orange-500 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(249,115,22,0.01)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="text-2xl font-black text-white">{test.title}</h2>

          <p className="text-neutral-400 mt-2 max-w-xl">
            {test.description ?? "No description provided"}
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${badgeStyle[test.status]}`}
        >
          {test.status}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="rounded-xl bg-[#171717] border border-neutral-800 p-4">
          <div className="flex items-center gap-2 text-orange-500">
            <Clock3 size={18} />

            <span className="text-sm">Duration</span>
          </div>

          <p className="mt-3 text-xl font-bold">{test.duration} mins</p>
        </div>

        <div className="rounded-xl bg-[#171717] border border-neutral-800 p-4">
          <div className="flex items-center gap-2 text-orange-500">
            <FileText size={18} />

            <span className="text-sm">Questions</span>
          </div>

          <p className="mt-3 text-xl font-bold">{test.totalQuestions}</p>
        </div>

        <div className="rounded-xl bg-[#171717] border border-neutral-800 p-4">
          <div className="flex items-center gap-2 text-orange-500">
            <Trophy size={18} />

            <span className="text-sm">Marks</span>
          </div>

          <p className="mt-3 text-xl font-bold">{test.totalMarks}</p>
        </div>

        <div className="rounded-xl bg-[#171717] border border-neutral-800 p-4">
          <div className="flex items-center gap-2 text-orange-500">
            <Hash size={18} />

            <span className="text-sm">Access Code</span>
          </div>

          <p className="mt-3 text-xl font-bold tracking-widest">
            {test.accessCode}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-800">
        <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-5">
          Actions
        </h3>

        <div className="flex flex-wrap gap-3">
          <AddQuestionsButton  testId={test.id} />

          <Link
            href={`/dashboard/tests/${test.id}/participant-form`}
            className="
rounded-xl
border
border-neutral-700
bg-[#181818]
px-5
py-3
text-sm
font-semibold
text-neutral-200
transition-all
duration-300
hover:border-orange-500
hover:text-orange-400
hover:bg-[#202020]
"
          >
            Participant Form
          </Link>

          <Link
            href={`/dashboard/tests/${test.id}/participants`}
            className="
rounded-xl
border
border-neutral-700
bg-[#181818]
px-5
py-3
text-sm
font-semibold
text-neutral-200
transition-all
duration-300
hover:border-orange-500
hover:text-orange-400
hover:bg-[#202020]
"
          >
            Results
          </Link>

          <CopyCodeButton accessCode={test.accessCode} />

          {test.status === "DRAFT" && <PublishButton testId={test.id} />}

          {test.status === "PUBLISHED" && <StartTestButton testId={test.id} />}

          {test.status === "LIVE" && (
            <>
              <span className=" rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-2 text-sm font-semibold text-orange-400 animate-pulse">
                ● LIVE
              </span>

              <EndTestButton testId={test.id} />
            </>
          )}

          {test.status === "COMPLETED" && (
            <span className=" rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-2 text-sm font-semibold text-orange-400 animate-pulse">
              Results Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
