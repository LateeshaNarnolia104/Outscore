"use server";

import { auth } from "@/auth";
import { updateParticipantFields } from "@/services/participant-form.service";
import { participantFieldsSchema } from "@/validators/participant-fields";

export async function updateParticipantFieldsAction(
  testId: string,
  fields: unknown
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const validatedFields =
    participantFieldsSchema.safeParse(fields);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid participant fields",
    };
  }

  return updateParticipantFields(
    testId,
    session.user.id,
    validatedFields.data
  );
}
