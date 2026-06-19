"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateParticipantFieldsAction } from "@/app/(dashboard)/actions/participant-form.action";
import { ParticipantField } from "@/validators/participant-fields";

type ParticipantFieldBuilderProps = {
  testId: string;
  initialFields?: ParticipantField[];
};

export default function ParticipantFieldBuilder({
  testId,
  initialFields = [
    {
      id: crypto.randomUUID(),
      label: "Full Name",
      type: "text",
      required: true,
    },
  ],
}: ParticipantFieldBuilderProps) {
  const [fields, setFields] =
    useState<ParticipantField[]>(initialFields);

  const [isPending, startTransition] = useTransition();

  function addField() {
    setFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: "",
        type: "text",
        required: false,
      },
    ]);
  }

  function updateLabel(id: string, value: string) {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? {
              ...field,
              label: value,
            }
          : field
      )
    );
  }

  function updateType(id: string, value: "text" | "email" | "number") {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? {
              ...field,
              type: value,
            }
          : field
      )
    );
  }

  function toggleRequired(id: string) {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? {
              ...field,
              required: !field.required,
            }
          : field
      )
    );
  }

  function removeField(id: string) {
    setFields((prev) =>
      prev.filter((field) => field.id !== id)
    );
  }

  function handleSave() {
    startTransition(async () => {
      const response =
        await updateParticipantFieldsAction(
          testId,
          fields
        );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
    });
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Participant Details
        </h2>

        <button
          onClick={addField}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black cursor-pointer"
        >
          + Add Field
        </button>

      </div>

      {fields.map((field) => (
        <div
          key={field.id}
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4 text-neutral-900 dark:text-neutral-100"
        >

          <div>

            <label className="text-sm font-semibold">
              Field Label
            </label>

            <input
              value={field.label}
              onChange={(e) =>
                updateLabel(
                  field.id,
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3"
              placeholder="Enter field name"
            />

          </div>

          <div>

            <label className="text-sm font-semibold">
              Field Type
            </label>

            <select
              value={field.type}
              onChange={(e) =>
                updateType(
                  field.id,
                  e.target.value as "text" | "email" | "number"
                )
              }
              className="mt-2 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
            </select>

          </div>

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 font-medium">

              <input
                type="checkbox"
                checked={field.required}
                onChange={() =>
                  toggleRequired(field.id)
                }
              />

              Required

            </label>

            <button
              onClick={() =>
                removeField(field.id)
              }
              className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
            >
              Remove
            </button>

          </div>

        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-xl bg-black py-3 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black cursor-pointer"
      >
        {isPending
          ? "Saving..."
          : "Save Participant Fields"}
      </button>

    </div>
  );
}