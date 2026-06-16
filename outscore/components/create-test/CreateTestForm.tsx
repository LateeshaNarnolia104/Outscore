"use client";

import { useState, useTransition } from "react";

import { createTestAction } from "@/app/(dashboard)/actions/test.action";

type CreateTestFormProps = {
  onSuccess: () => void;
};

export default function CreateTestForm({
  onSuccess,
}: CreateTestFormProps) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await createTestAction({
          title,
          description,
          duration,
        });

        onSuccess();
      } catch (error) {
        console.error(error);
        alert("Failed to create test.");
      }
    });
  };

  return (
    <div className="space-y-5 text-neutral-900 dark:text-neutral-100">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200"
          placeholder="Weekly DSA Test"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200"
          rows={4}
          placeholder="Optional description..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Duration (minutes)
        </label>

        <input
          type="number"
          value={duration}
          onChange={(e) =>
            setDuration(Number(e.target.value))
          }
          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="rounded-lg bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-5 py-2.5 font-semibold text-sm disabled:opacity-50 transition-all duration-200 cursor-pointer"
        >
          {isPending ? "Creating..." : "Create Test"}
        </button>
      </div>
    </div>
  );
}