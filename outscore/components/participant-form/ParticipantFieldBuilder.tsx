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
  const [fields, setFields] = useState<ParticipantField[]>(initialFields);
  console.log(fields);

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
          : field,
      ),
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
          : field,
      ),
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
          : field,
      ),
    );
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((field) => field.id !== id));
  }

  function handleSave() {
    startTransition(async () => {
      const response = await updateParticipantFieldsAction(testId, fields);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold">Participant Fields</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Add the fields students must fill before starting the test.
          </p>
        </div>

        <button
          onClick={addField}
          className="rounded-xl bg-orange-500/80 hover:bg-orange-500 px-5 py-2.5 font-medium text-black transition cursor-pointer"
        >
          {" "}
          + Add Field
        </button>
      </div>

      {fields.map((field) => (
        <div
          key={field.id}
          className="
rounded-2xl
border
border-neutral-800
bg-neutral-900
p-4
space-y-5
"
        >
          <div>
            <label className="text-sm font-semibold">Field Label</label>

            <input
              value={field.label}
              onChange={(e) => updateLabel(field.id, e.target.value)}
              className="
mt-2
w-full
rounded-xl
border
border-neutral-700
bg-[#171717]
px-4
py-2
text-white
placeholder:text-neutral-500
focus:border-orange-500/40
focus:outline-none
"
              placeholder="Enter field name"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Field Type</label>

            <select
              value={field.type}
              onChange={(e) =>
                updateType(
                  field.id,
                  e.target.value as "text" | "email" | "number",
                )
              }
              className="
mt-2
w-full
rounded-xl
border
border-neutral-700
bg-[#171717]
px-4
py-2
text-white
focus:border-orange-500/40
focus:outline-none
"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-800 pt-2">
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                className="accent-orange-500"
                checked={field.required}
                onChange={() => toggleRequired(field.id)}
              />
              Required
            </label>

            <button
              onClick={() => removeField(field.id)}
              className="
rounded-lg
border
border-red-900
px-4
py-2
text-sm
text-red-400
hover:bg-red-500/10
transition
cursor-pointer
"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="
mt-4
w-full
rounded-2xl
bg-orange-500/80
py-2
font-semibold
text-black
hover:bg-orange-500
transition
disabled:opacity-50
cursor-pointer
"
      >
        {isPending ? "Saving..." : "Save Participant Fields"}
      </button>
    </div>
  );
}
