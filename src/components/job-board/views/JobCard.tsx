"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useJobBoardState } from "../context";
import type { Job } from "../types";

interface JobCardProps {
  job: Job;
  index: number;
}

function formatSalary(job: Job): string | null {
  if (!job.showSalary || !job.salaryMin) return null;
  const fmt = (v: string) => Number(v).toLocaleString();
  const currency = job.currency ?? "";
  const period = job.payPeriod ? `/${job.payPeriod}` : "";
  if (job.salaryMax) {
    return `${currency} ${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}${period}`;
  }
  return `${currency} ${fmt(job.salaryMin)}${period}`;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const { slug } = useJobBoardState();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const locationDisplay = (() => {
    if (!job.locations || job.locations.length === 0) return null;

    const first = job.locations[0];
    const firstLocation = [first.city, first.state, first.country]
      .filter(Boolean)
      .join(", ");

    if (job.locations.length > 1) {
      return `${firstLocation} +${job.locations.length - 1}`;
    }
    return firstLocation;
  })();

  const salary = formatSalary(job);
  const meta = [job.departmentName, locationDisplay, job.workTypeName].filter(
    Boolean,
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link
        href={`/${slug}/jobs/${job.id}`}
        className="group relative flex flex-col @2xl:flex-row @2xl:items-center justify-between py-6 border-b border-gray-200 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200 px-2"
      >
        <div className="flex-1">
          <h3
            className="text-xl font-semibold text-gray-900 group-hover:text-black transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {job.title}
          </h3>
          {meta.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm text-gray-500 font-mono">
              {meta.map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span>&middot;</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {salary && (
          <div className="mt-2 @2xl:mt-0 @2xl:ml-4 text-sm font-medium text-gray-900">
            {salary}
          </div>
        )}
      </Link>
    </motion.div>
  );
};
