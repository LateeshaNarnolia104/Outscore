import { prisma } from "@/lib/prisma";
import { CreateQuestionInput } from "@/validators/question";

async function updateTestStats(testId: string) {
  const questions = await prisma.question.findMany({
    where: {
      testId,
    },

    select: {
      marks: true,
    },
  });

  const totalQuestions = questions.length;

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0
  );

  await prisma.test.update({
    where: {
      id: testId,
    },

    data: {
      totalQuestions,
      totalMarks,
    },
  });
}

export async function createQuestion(
  data: CreateQuestionInput
) {
  const count = await prisma.question.count({
    where: {
      testId: data.testId,
    },
  });

  const question = await prisma.question.create({
    data: {
      testId: data.testId,
      questionText: data.questionText,
      marks: data.marks,
      negativeMarks: data.negativeMarks,
      position: count + 1,
    },
  });

  await prisma.option.createMany({
    data: data.options.map((option, index) => ({
      questionId: question.id,
      optionText: option.optionText,
      isCorrect: option.isCorrect,
      position: index + 1,
    })),
  });

  await updateTestStats(data.testId);

  return question;
}

export async function getQuestions(testId: string) {
  return prisma.question.findMany({
    where: {
      testId,
    },

    include: {
      options: {
        orderBy: {
          position: "asc",
        },
      },
    },

    orderBy: {
      position: "asc",
    },
  });
}

export async function deleteQuestion(
  questionId: string
) {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  await prisma.question.delete({
    where: {
      id: questionId,
    },
  });

  await updateTestStats(question.testId);

  return question;
}

export async function updateQuestion(
  questionId: string,
  data: CreateQuestionInput
) {
  const oldQuestion = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!oldQuestion) {
    throw new Error("Question not found");
  }

  await prisma.question.update({
    where: {
      id: questionId,
    },

    data: {
      questionText: data.questionText,
      marks: data.marks,
      negativeMarks: data.negativeMarks,
    },
  });

  await prisma.option.deleteMany({
    where: {
      questionId,
    },
  });

  await prisma.option.createMany({
    data: data.options.map((option, index) => ({
      questionId,
      optionText: option.optionText,
      isCorrect: option.isCorrect,
      position: index + 1,
    })),
  });

  await updateTestStats(oldQuestion.testId);
}