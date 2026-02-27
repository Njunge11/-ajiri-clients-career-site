import type {
  Job,
  JobBoardConfig,
  JobFacets,
  JobsResponse,
  JobFiltersParams,
  ApplicationForm,
  ApplicationData,
  ApplicationResponse,
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

// ── Single Job ─────────────────────────────────────────────────────

export async function fetchJob(
  slug: string,
  jobSlug: string,
): Promise<Job | null> {
  try {
    return await apiFetch<Job>(
      `api/companies/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(jobSlug)}`,
    );
  } catch (err) {
    console.error("[fetchJob]", err);
    return null;
  }
}

// ── Application Form ──────────────────────────────────────────────────

export async function fetchApplicationForm(
  slug: string,
  jobId: string,
): Promise<ApplicationForm> {
  return apiFetch<ApplicationForm>(
    `api/companies/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(jobId)}/application-form`,
  );
}

// ── Application Submit ──────────────────────────────────────────────

export async function submitApplication(
  slug: string,
  jobId: string,
  data: ApplicationData,
): Promise<ApplicationResponse> {
  const formData = new FormData();
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);

  if (data.resumeFile) {
    formData.append("resume", data.resumeFile);
  }
  if (data.coverLetterFile) {
    formData.append("coverLetter", data.coverLetterFile);
  }

  const screeningAnswers = Object.entries(data.answers).map(
    ([questionId, answer]) => ({ questionId, answer }),
  );
  formData.append("screeningAnswers", JSON.stringify(screeningAnswers));

  const res = await fetch(
    `/api/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(jobId)}/apply`,
    { method: "POST", body: formData },
  );

  const json: ApplicationResponse = await res.json();

  if (!res.ok) {
    const err = new Error(json.error ?? "Application failed") as Error & {
      status: number;
      response: ApplicationResponse;
    };
    err.status = res.status;
    err.response = json;
    throw err;
  }

  return json;
}
