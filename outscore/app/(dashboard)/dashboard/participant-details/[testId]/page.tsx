export default async function ParticipantDetailsPage({
  params,
}: {
  params: Promise<{
    testId: string;
  }>;
}) {
  const { testId } = await params;

  return (
    <main className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold">
        Participant Details
      </h1>

      <p className="mt-2 text-neutral-500">
        Configure what information participants must fill before joining this
        test.
      </p>

      <div className="mt-8 rounded-xl border p-6">
        <p>Test ID: {testId}</p>
      </div>

    </main>
  );
}