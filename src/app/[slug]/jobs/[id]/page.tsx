import { notFound } from "next/navigation";
import { fetchJob } from "@/lib/api";
import { JobDetailView } from "@/components/job-board/views";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const job = await fetchJob(slug, id);

  if (!job) notFound();

  return <JobDetailView job={job} />;
}
