import { queryOptions, useMutation } from "@tanstack/react-query";
import { submitApplication } from "./api";
import type {
  JobBoardConfig,
  Job,
  JobFacets,
  JobsResponse,
  JobFiltersParams,
  ApplicationForm,
  ApplicationData,
} from "@/components/job-board/types";

// ── Config ──────────────────────────────────────────────────────────

interface ConfigResponse {
  companyId: string;
  config: JobBoardConfig;
  status: "published" | "draft";
}

export function configOptions(slug: string) {
  return queryOptions({
    queryKey: ["config", slug],
    queryFn: async (): Promise<ConfigResponse> => {
      const res = await fetch(`/api/${encodeURIComponent(slug)}/config`);
      if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
      return res.json();
    },
    staleTime: 0,
  });
}

// ── Jobs ────────────────────────────────────────────────────────────

export function jobsOptions(slug: string, filters: JobFiltersParams = {}) {
  return queryOptions({
    queryKey: ["jobs", slug, filters],
    queryFn: async (): Promise<JobsResponse> => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.department) params.set("department", filters.department);
      if (filters.workType) params.set("workType", filters.workType);
      if (filters.location) params.set("location", filters.location);
      if (filters.page) params.set("page", String(filters.page));
      const qs = params.toString();
      const url = `/api/${encodeURIComponent(slug)}/jobs${qs ? `?${qs}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Jobs fetch failed: ${res.status}`);
      return res.json();
    },
  });
}

// ── Facets ─────────────────────────────────────────────────────────

export function facetsOptions(slug: string) {
  return queryOptions({
    queryKey: ["facets", slug],
    queryFn: async (): Promise<JobFacets> => {
      const res = await fetch(`/api/${encodeURIComponent(slug)}/facets`);
      if (!res.ok) throw new Error(`Facets fetch failed: ${res.status}`);
      return res.json();
    },
  });
}

// ── Single Job ─────────────────────────────────────────────────────

export function jobOptions(slug: string, id: string) {
  return queryOptions({
    queryKey: ["job", slug, id],
    queryFn: async (): Promise<Job> => {
      const res = await fetch(
        `/api/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(id)}`,
      );
      if (!res.ok) throw new Error(`Job fetch failed: ${res.status}`);
      return res.json();
    },
  });
}

// ── Application Form ───────────────────────────────────────────────

export function applicationFormOptions(slug: string, jobId: string) {
  return queryOptions({
    queryKey: ["application-form", slug, jobId],
    queryFn: async (): Promise<ApplicationForm> => {
      const res = await fetch(
        `/api/${encodeURIComponent(slug)}/jobs/${encodeURIComponent(jobId)}/application-form`,
      );
      if (!res.ok)
        throw new Error(`Application form fetch failed: ${res.status}`);
      return res.json();
    },
    staleTime: 0,
  });
}

// ── Application Mutation ───────────────────────────────────────────

export function useSubmitApplication() {
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: ApplicationData }) =>
      submitApplication(jobId, data),
  });
}
