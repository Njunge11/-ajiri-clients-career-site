import { fetchJobs, fetchFacets } from "@/lib/api";
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

  const [{ jobs, total, page, pageSize }, facets] = await Promise.all([
    fetchJobs(slug, {
      search: sp.search,
      department: sp.department,
      workType: sp.workType,
      location: sp.location,
      page: sp.page ? Number(sp.page) : undefined,
    }),
    fetchFacets(slug),
  ]);

  return (
    <>
      <JobBoard.Hero />
      <JobListView
        jobs={jobs}
        total={total}
        page={page}
        pageSize={pageSize}
        facets={facets}
        activeFilters={{
          departments: sp.department?.split(",").filter(Boolean) ?? [],
          locations: sp.location?.split(",").filter(Boolean) ?? [],
          workTypes: sp.workType?.split(",").filter(Boolean) ?? [],
        }}
      />
    </>
  );
}
