"use client";

import { JobBoard } from "@/components/job-board";
import type { JobBoardConfig } from "@/components/job-board/types";

export function JobBoardShell({
  config,
  slug,
  children,
}: {
  config: JobBoardConfig;
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <JobBoard.Root config={config} slug={slug}>
      <div className="@container flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
        <JobBoard.Background />
        <div className="relative z-10 flex-1 flex flex-col">
          <JobBoard.Header />
          {children}
        </div>
      </div>
    </JobBoard.Root>
  );
}
