"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useJob } from "@/lib/queries";
import { useJobBoardState } from "@/components/job-board/context";
import { JobDetailView } from "@/components/job-board/views";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = use(params);
  const { slug } = useJobBoardState();
  const { data: job, isLoading } = useJob(id);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 @2xl:px-10 py-8">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="@5xl:grid @5xl:grid-cols-12 @5xl:gap-16">
            <div className="@5xl:col-span-4 mb-10 @5xl:mb-0">
              <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="@5xl:col-span-8 space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Job not found</h1>
        <p className="text-gray-500 mb-6">
          This position may no longer be available.
        </p>
        <Link
          href={`/${slug}`}
          className="px-6 py-2 bg-gray-900 text-white font-medium rounded hover:bg-black transition-colors"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      <JobDetailView job={job} />
    </motion.div>
  );
}
