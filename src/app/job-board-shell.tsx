"use client";

import { useQuery } from "@tanstack/react-query";
import { JobBoard } from "@/components/job-board";
import { configOptions } from "@/lib/queries";
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
  // Hydrated from server, refetches on window focus automatically
  const { data } = useQuery({
    ...configOptions(slug),
    initialData: { companyId: "", config, status: "published" as const },
  });

  const liveConfig = data.config;

  return (
    <JobBoard.Root config={liveConfig} slug={slug}>
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
