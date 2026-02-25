"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useJob } from "@/lib/queries";
import { useJobBoardState } from "@/components/job-board/context";
import { ApplicationFormView } from "@/components/job-board/views";

export default function ApplyPage({
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
        <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="p-6 @2xl:p-10 bg-gray-50">
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="bg-white p-6 @2xl:p-8 rounded-xl shadow-sm space-y-6">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
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
      <ApplicationFormView job={job} />
    </motion.div>
  );
}
