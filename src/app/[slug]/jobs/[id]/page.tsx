import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchJob, fetchApplicationForm } from "@/lib/api";
import { jobOptions, applicationFormOptions } from "@/lib/queries";
import { getQueryClient } from "@/lib/get-query-client";
import { JobDetailView } from "@/components/job-board/views";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const queryClient = getQueryClient();

  const job = await fetchJob(slug, id);
  if (!job) notFound();

  queryClient.setQueryData(jobOptions(slug, id).queryKey, job);

  // Fire-and-forget: warm the cache for the apply page without blocking render
  void fetchApplicationForm(slug, id)
    .then((form) =>
      queryClient.setQueryData(applicationFormOptions(slug, id).queryKey, form),
    )
    .catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobDetailView job={job} />
    </HydrationBoundary>
  );
}
