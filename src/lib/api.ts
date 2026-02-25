import type {
  Job,
  JobBoardConfig,
  JobFacets,
  JobsResponse,
  JobFiltersParams,
  ApplicationData,
} from "@/components/job-board/types";

const API_URL = process.env.API_URL!;
const API_SECRET = process.env.API_SECRET!;

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_SECRET}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${url}`);
  }

  return res.json();
}

// ── Config ──────────────────────────────────────────────────────────

interface ConfigResponse {
  companyId: string;
  config: JobBoardConfig;
  status: "published" | "draft";
}

export async function fetchConfig(slug: string): Promise<ConfigResponse> {
  return apiFetch<ConfigResponse>(
    `api/companies/${encodeURIComponent(slug)}/job-board-config`,
  );
}

// ── Jobs ────────────────────────────────────────────────────────────

export async function fetchJobs(
  slug: string,
  filters: JobFiltersParams = {},
): Promise<JobsResponse> {
  const params = new URLSearchParams();
  params.set("status", "open");

  if (filters.search) params.set("search", filters.search);
  if (filters.department) params.set("department", filters.department);
  if (filters.workType) params.set("workType", filters.workType);
  if (filters.location) params.set("location", filters.location);
  if (filters.page) params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize ?? 100));

  return apiFetch<JobsResponse>(
    `api/companies/${encodeURIComponent(slug)}/jobs?${params.toString()}`,
  );
}

// ── Facets ─────────────────────────────────────────────────────────

export async function fetchFacets(slug: string): Promise<JobFacets> {
  return apiFetch<JobFacets>(
    `api/companies/${encodeURIComponent(slug)}/jobs/facets`,
  );
}

// ── Single Job (stub – detail endpoint not yet available) ───────────

export async function fetchJob(id: string): Promise<Job | null> {
  void id;
  return null;
}

// ── Application (placeholder) ───────────────────────────────────────

export async function submitApplication(
  jobId: string,
  data: ApplicationData,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Application submitted:", { jobId, data });
}
