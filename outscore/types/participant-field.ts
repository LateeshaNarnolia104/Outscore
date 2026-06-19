export type ParticipantField = {
  id: string;
  label: string;
  type: "text" | "email" | "number";
  required: boolean;
};