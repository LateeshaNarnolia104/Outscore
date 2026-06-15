import { z } from "zod";

export const createTestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  duration: z.coerce
  .number({
    error: "Duration must be a number",
  })
  .min(1, "Duration must be at least 1 minute")
  .max(300, "Duration cannot exceed 300 minutes"),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;