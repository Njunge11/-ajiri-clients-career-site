"use client";

import { JobBoardFlow, SAMPLE_JOBS, INITIAL_CONFIG } from "@/components/job-board";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <JobBoardFlow
        mode="preview"
        jobs={SAMPLE_JOBS}
        config={INITIAL_CONFIG}
      />
    </div>
  );
}
