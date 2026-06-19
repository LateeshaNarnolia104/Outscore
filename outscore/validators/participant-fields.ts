import { z } from "zod";

export const participantFieldSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1).max(50),
  type: z.enum(["text", "email", "number"]),
  required: z.boolean(),
});

export const participantFieldsSchema = z.array(
  participantFieldSchema
);

export type ParticipantField =
  z.infer<typeof participantFieldSchema>;

export type ParticipantFields =
  z.infer<typeof participantFieldsSchema>;
  