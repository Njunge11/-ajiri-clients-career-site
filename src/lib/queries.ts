import { useMutation } from "@tanstack/react-query";
import { submitApplication } from "./api";
import type { ApplicationData } from "@/components/job-board/types";

export function useSubmitApplication() {
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: ApplicationData }) =>
      submitApplication(jobId, data),
  });
}
