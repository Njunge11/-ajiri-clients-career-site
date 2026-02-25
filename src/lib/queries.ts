import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchJob, submitApplication } from "./api";
import type { ApplicationData } from "@/components/job-board/types";

export const jobKeys = {
  all: ["jobs"] as const,
  list: () => [...jobKeys.all, "list"] as const,
  detail: (id: string) => [...jobKeys.all, "detail", id] as const,
};

export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => fetchJob(id),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: ApplicationData }) =>
      submitApplication(jobId, data),
  });
}
