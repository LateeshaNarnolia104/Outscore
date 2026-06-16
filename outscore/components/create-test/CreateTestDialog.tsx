"use client";

import { useState } from "react";
import CreateTestForm from "./CreateTestForm";

export default function CreateTestDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black px-4 py-2.5 font-medium transition-all duration-200 shadow-sm cursor-pointer"
      >
        + Create Test
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl transition-all duration-200 text-neutral-900 dark:text-neutral-100">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Create Test
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-xl text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors duration-150 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <CreateTestForm
              onSuccess={() => setOpen(false)}
            />

          </div>
        </div>
      )}
    </>
  );
}

