"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { ArrowLeft, MapPin, Coins, Clock, ChevronDown } from "lucide-react";
import { useJobBoardState } from "../context";
import type { Job, JobLocation } from "../types";

function formatLocation(loc: JobLocation): string {
  const parts: string[] = [];
  if (loc.city) parts.push(loc.city);
  if (loc.state) parts.push(loc.state);
  if (loc.country) parts.push(loc.country);
  return parts.join(", ");
}

function formatSalary(job: Job): string | null {
  if (!job.showSalary || !job.salaryMin) return null;
  const fmt = (v: number) => v.toLocaleString();
  const currency = job.currency ?? "";
  const period = job.payPeriod ? `/${job.payPeriod}` : "";
  if (job.salaryMax) {
    return `${currency} ${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}${period}`;
  }
  return `${currency} ${fmt(job.salaryMin)}${period}`;
}

interface JobDetailViewProps {
  job: Job;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({ job }) => {
  const { slug } = useJobBoardState();
  const [locationsExpanded, setLocationsExpanded] = useState(false);

  const locations = job.locations || [];
  const hasMultipleLocations = locations.length > 1;

  return (
    <div className="bg-white min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 @2xl:px-10 py-8">
        <Link
          href={`/${slug}`}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Back to all jobs
        </Link>

        <div className="@5xl:grid @5xl:grid-cols-12 @5xl:gap-16">
          <div className="@5xl:col-span-4 mb-10 @5xl:mb-0">
            <div className="@5xl:sticky @5xl:top-32">
              <h1
                className="text-4xl @2xl:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {job.title}
              </h1>

              <div className="space-y-4 mb-8">
                {job.departmentName && (
                  <div className="flex items-center text-gray-600">
                    <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-medium font-mono uppercase">
                      {job.departmentName}
                    </span>
                  </div>
                )}

                {locations.length > 0 && (
                  <div className="text-gray-600">
                    <div className="flex items-center">
                      <MapPin
                        size={18}
                        className="mr-3 text-gray-400 shrink-0"
                      />
                      {hasMultipleLocations ? (
                        <button
                          onClick={() =>
                            setLocationsExpanded(!locationsExpanded)
                          }
                          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        >
                          <span>Multiple locations ({locations.length})</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${locationsExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      ) : (
                        <span>{formatLocation(locations[0])}</span>
                      )}
                    </div>

                    <AnimatePresence>
                      {hasMultipleLocations && locationsExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-[30px] mt-2 space-y-1 overflow-hidden"
                        >
                          {locations.map((loc, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              {formatLocation(loc)}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {job.workTypeName && (
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-3 text-gray-400" />
                    {job.workTypeName}
                  </div>
                )}
                {job.showSalary && job.salaryMin && (
                  <div className="flex items-center font-medium text-gray-900">
                    <Coins size={18} className="mr-3 text-gray-400" />
                    {formatSalary(job)}
                  </div>
                )}
              </div>

              <Link
                href={`/${slug}/jobs/${job.id}/apply`}
                className="block w-full @2xl:w-auto @5xl:w-full py-4 px-8 bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                Apply for this Position
              </Link>
            </div>
          </div>

          <div className="@5xl:col-span-8">
            {job.description ? (
              <div className="prose prose-gray max-w-none [&>*:first-child]:mt-0">
                <Markdown>{job.description}</Markdown>
              </div>
            ) : (
              <p className="text-gray-500">
                No description available for this position.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
