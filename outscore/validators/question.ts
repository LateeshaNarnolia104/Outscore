import { z } from "zod";

export const createQuestionSchema = z.object({
  testId: z.string(),

  questionText: z
    .string()
    .min(5, "Question is too short")
    .max(500),

  marks: z.number().min(1).max(100),

  negativeMarks: z.number().min(0),

  options: z
    .array(
      z.object({
        optionText: z.string().min(1),
        isCorrect: z.boolean(),
      })
    )
    .length(4),
});

export type CreateQuestionInput =
  z.infer<typeof createQuestionSchema>;