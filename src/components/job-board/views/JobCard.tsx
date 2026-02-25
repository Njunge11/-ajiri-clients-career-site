"use client"

import React from 'react'
import { motion } from 'framer-motion'
import type { Job } from '../types'

interface JobCardProps {
  job: Job
  onClick: () => void
  index: number
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" as const }
    }
  }

  const locationDisplay = (() => {
    if (job.location) return job.location
    if (!job.locations || job.locations.length === 0) return null

    const first = job.locations[0]
    const firstLocation = [first.city, first.state, first.country].filter(Boolean).join(', ')

    if (job.locations.length > 1) {
      return `${firstLocation} +${job.locations.length - 1}`
    }
    return firstLocation
  })()

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onClick={onClick}
      className="group relative flex flex-col @2xl:flex-row @2xl:items-center justify-between py-6 border-b border-gray-200 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200 px-2"
    >
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-black transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
          {job.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm text-gray-500 font-mono">
          {job.department && <span>{job.department}</span>}
          {job.department && (locationDisplay || job.workType) && <span>·</span>}
          {locationDisplay && <span>{locationDisplay}</span>}
          {locationDisplay && job.workType && <span>·</span>}
          {job.workType && <span>{job.workType}</span>}
        </div>
      </div>

      {job.salary && (
        <div className="mt-2 @2xl:mt-0 @2xl:ml-4 text-sm font-medium text-gray-900">
          {job.salary}
        </div>
      )}
    </motion.div>
  )
}
