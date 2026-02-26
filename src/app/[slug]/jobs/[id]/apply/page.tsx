import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchJob, fetchApplicationForm } from "@/lib/api";
import { jobOptions, applicationFormOptions } from "@/lib/queries";
import { getQueryClient } from "@/lib/get-query-client";
import { ApplicationFormView } from "@/components/job-board/views";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const queryClient = getQueryClient();

  const [job, applicationForm] = await Promise.all([
    fetchJob(slug, id),
    fetchApplicationForm(slug, id).catch(() => null),
  ]);

  if (!job) notFound();

  queryClient.setQueryData(jobOptions(slug, id).queryKey, job);
  if (applicationForm) {
    queryClient.setQueryData(
      applicationFormOptions(slug, id).queryKey,
      applicationForm,
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApplicationFormView job={job} />
    </HydrationBoundary>
  );
}
