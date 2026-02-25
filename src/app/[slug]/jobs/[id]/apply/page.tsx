import { notFound } from "next/navigation";
import { fetchJob } from "@/lib/api";
import { ApplicationFormView } from "@/components/job-board/views";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const job = await fetchJob(slug, id);

  if (!job) notFound();

  return <ApplicationFormView job={job} />;
}
