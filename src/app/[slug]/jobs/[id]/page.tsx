import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchJob } from "@/lib/api";
import { jobOptions } from "@/lib/queries";
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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobDetailView job={job} />
    </HydrationBoundary>
  );
}
