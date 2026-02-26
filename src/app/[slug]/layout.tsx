import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchConfig } from "@/lib/api";
import { configOptions } from "@/lib/queries";
import { getQueryClient } from "@/lib/get-query-client";
import { JobBoardShell } from "../job-board-shell";

export default async function CompanyLayout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  let configResponse;
  try {
    configResponse = await fetchConfig(slug);
  } catch {
    notFound();
  }

  if (configResponse.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          No open positions
        </h1>
        <p className="text-gray-500 max-w-md">
          We don&apos;t have any openings right now. Check back soon for new
          opportunities.
        </p>
      </div>
    );
  }

  // Seed the query cache so client useQuery picks it up
  queryClient.setQueryData(configOptions(slug).queryKey, configResponse);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobBoardShell config={configResponse.config} slug={slug}>
        {children}
      </JobBoardShell>
    </HydrationBoundary>
  );
}
