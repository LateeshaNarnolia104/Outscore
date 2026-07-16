"use client";

import { useState, useTransition } from "react";
import { createTestAction } from "@/app/(dashboard)/actions/test.action";
import { toast } from "sonner";


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
        // toast.success("Failed to create test");
      }
    });
  };

  return (
    <div className="space-y-7">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-300">
          Test Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. DSA Mid Semester"
          className="
            w-full
            rounded-2xl
            border
            border-neutral-700
            bg-[#171717]
            px-4
            py-3
            text-white
            placeholder:text-neutral-500
            focus:border-orange-500/40
            focus:outline-none
          "
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-300">
          Description
        </label>

        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          className="
            w-full
            resize-none
            rounded-2xl
            border
            border-neutral-700
            bg-[#171717]
            px-4
            py-3
            text-white
            placeholder:text-neutral-500
            focus:border-orange-500/40
            focus:outline-none
          "
        />
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-300">
          Duration
        </label>

        <div className="relative">
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="
              w-full
              rounded-2xl
              border
              border-neutral-700
              bg-[#171717]
              px-4
              py-3
              pr-20
              text-white
              focus:border-orange-500/40
              focus:outline-none
            "
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
            mins
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-neutral-800 pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="
            rounded-xl
            bg-orange-500/80
            hover:bg-orange-500
            px-6
            py-3
            font-semibold
            text-black
            transition-colors
            disabled:opacity-50
            cursor-pointer
          "
        >
          {isPending ? "Creating..." : "Create Test"}
        </button>
      </div>
    </div>
  );
}
