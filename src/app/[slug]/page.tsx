import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchJobs, fetchFacets } from "@/lib/api";
import { jobsOptions, facetsOptions } from "@/lib/queries";
import { getQueryClient } from "@/lib/get-query-client";
import { JobBoard } from "@/components/job-board";
import { JobListView } from "@/components/job-board/views";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const queryClient = getQueryClient();

  const filters = {
    search: sp.search,
    department: sp.department,
    workType: sp.workType,
    location: sp.location,
    page: sp.page ? Number(sp.page) : undefined,
  };

  const [jobsData, facetsData] = await Promise.all([
    fetchJobs(slug, filters),
    fetchFacets(slug),
  ]);

  // Seed the query cache
  queryClient.setQueryData(jobsOptions(slug, filters).queryKey, jobsData);
  queryClient.setQueryData(facetsOptions(slug).queryKey, facetsData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobBoard.Hero />
      <JobListView
        jobs={jobsData.jobs}
        total={jobsData.total}
        page={jobsData.page}
        pageSize={jobsData.pageSize}
        facets={facetsData}
        activeFilters={{
          departments: sp.department?.split(",").filter(Boolean) ?? [],
          locations: sp.location?.split(",").filter(Boolean) ?? [],
          workTypes: sp.workType?.split(",").filter(Boolean) ?? [],
        }}
      />
    </HydrationBoundary>
  );
}
