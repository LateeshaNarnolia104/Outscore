import { z } from "zod";

export const joinTestSchema = z.object({
  accessCode: z
    .string()
    .trim()
    .min(6, "Invalid access code")
    .max(6, "Invalid access code")
    .transform((value) => value.toUpperCase()),
});

export type JoinTestInput = z.infer<
  typeof joinTestSchema
>;