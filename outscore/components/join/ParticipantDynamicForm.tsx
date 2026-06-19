"use client";

import { FormEvent, useState } from "react";
import { ParticipantField } from "@/validators/participant-fields";

type ParticipantDynamicFormProps = {
  fields: ParticipantField[];
  onSubmit: (values: Record<string, any>) => void;
  loading?: boolean;
};

export default function ParticipantDynamicForm({
  fields,
  onSubmit,
  loading = false,
}: ParticipantDynamicFormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      initial[field.id] = "";
    });
    return initial;
  });

  const handleChange = (id: string, val: string) => {
    setValues((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6 text-left">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col">
          <label className="mb-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={
              field.type === "number"
                ? "number"
                : field.type === "email"
                ? "email"
                : "text"
            }
            required={field.required}
            value={values[field.id] ?? ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 p-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            placeholder={`Enter your ${field.label.toLowerCase()}`}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black py-3 font-semibold text-sm text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black mt-6 cursor-pointer"
      >
        {loading ? "Registering..." : "Submit & Start Assessment"}
      </button>
    </form>
  );
}
