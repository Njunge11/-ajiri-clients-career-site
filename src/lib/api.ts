import type {
  Job,
  JobBoardConfig,
  JobFacets,
  JobsResponse,
  JobFiltersParams,
  ApplicationForm,
  ApplicationData,
  ApplicationResponse,
  UploadUrlResponse,
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

// ── Presigned Upload ────────────────────────────────────────────────

async function getUploadUrl(
  slug: string,
  jobId: string,
  category: string,
  mimeType: string,
): Promise<UploadUrlResponse> {
  const res = await fetch(
    `/api/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(jobId)}/upload-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, mimeType }),
    },
  );
  if (!res.ok) {
    throw new Error("Failed to get upload URL");
  }
  return res.json();
}

async function uploadToS3(url: string, file: File): Promise<void> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) {
    throw new Error("File upload failed");
  }
}

// ── Application Submit ──────────────────────────────────────────────

export async function submitApplication(
  slug: string,
  jobId: string,
  data: ApplicationData,
): Promise<ApplicationResponse> {
  const res = await fetch(
    `/api/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(jobId)}/apply`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
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

// ── Upload Files & Submit ───────────────────────────────────────────

export async function uploadAndSubmit(
  slug: string,
  jobId: string,
  params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumeFile: File;
    coverLetterFile?: File;
    answers: Record<string, string | string[]>;
  },
): Promise<ApplicationResponse> {
  // Step 1: Get presigned URLs in parallel
  const uploadPromises: Promise<UploadUrlResponse>[] = [
    getUploadUrl(slug, jobId, "applicant-resumes", params.resumeFile.type),
  ];
  if (params.coverLetterFile) {
    uploadPromises.push(
      getUploadUrl(
        slug,
        jobId,
        "applicant-cover-letters",
        params.coverLetterFile.type,
      ),
    );
  }

  const uploadUrls = await Promise.all(uploadPromises);
  const resumeUploadUrl = uploadUrls[0];
  const coverLetterUploadUrl = uploadUrls[1];

  // Step 2: Upload files to S3 in parallel
  const s3Promises: Promise<void>[] = [
    uploadToS3(resumeUploadUrl.url, params.resumeFile),
  ];
  if (params.coverLetterFile && coverLetterUploadUrl) {
    s3Promises.push(
      uploadToS3(coverLetterUploadUrl.url, params.coverLetterFile),
    );
  }

  await Promise.all(s3Promises);

  // Step 3: Submit application with file keys
  const screeningAnswers = Object.entries(params.answers).map(
    ([questionId, answer]) => ({ questionId, answer }),
  );

  return submitApplication(slug, jobId, {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    phone: params.phone,
    resumeKey: resumeUploadUrl.key,
    coverLetterKey: coverLetterUploadUrl?.key,
    screeningAnswers,
  });
}
