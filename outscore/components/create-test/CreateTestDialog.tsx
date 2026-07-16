"use client";

import { useState } from "react";
import CreateTestForm from "./CreateTestForm";

export default function CreateTestDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-white hover:bg-orange-100 px-6 py-3 font-semibold text-black transition"
      >
        + Create Test
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div
            className="
              w-full
              max-w-xl
              rounded-3xl
              border
              border-neutral-800
              bg-[#111111]
              text-white
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Create Test
                </h2>

                <p className="mt-1 text-sm text-neutral-400">
                  Set up a new assessment for your participants.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="
                  h-10
                  w-10
                  rounded-xl
                  border
                  border-neutral-800
                  text-neutral-400
                  hover:bg-[#171717]
                  hover:text-white
                  transition-colors
                  cursor-pointer
                "
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-8">
              <CreateTestForm
                onSuccess={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}