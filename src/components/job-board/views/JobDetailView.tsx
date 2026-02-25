"use client"

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Coins, Clock, ChevronDown } from 'lucide-react'
import type { Job, JobLocation } from '../types'

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2
      className="text-2xl font-bold mb-4 mt-10 first:mt-0 text-gray-900"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="text-sm uppercase tracking-widest mb-4 mt-8 text-gray-900 border-b border-gray-200 pb-2 font-mono"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p
      className="text-base leading-relaxed text-gray-700 mb-4"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-3 my-4 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-3 my-4 list-none">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-3 text-gray-700">
      <span className="text-gray-400 shrink-0 mt-1.5">•</span>
      <span className="text-base" style={{ fontFamily: 'var(--font-body)' }}>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-gray-900 underline hover:no-underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
}

function formatLocation(loc: JobLocation): string {
  const parts: string[] = []
  if (loc.city) parts.push(loc.city)
  if (loc.state) parts.push(loc.state)
  if (loc.country) parts.push(loc.country)
  return parts.join(', ')
}

interface JobDetailViewProps {
  job: Job
  onBack: () => void
  onApply: () => void
  showBackButton?: boolean
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  onBack,
  onApply,
  showBackButton = true,
}) => {
  const [locationsExpanded, setLocationsExpanded] = useState(false)

  const locations = job.locations || []
  const hasMultipleLocations = locations.length > 1

  return (
    <motion.div
      className="bg-white min-h-screen relative"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
      exit={{ x: '100%', opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
    >
      <div className="max-w-7xl mx-auto px-6 @2xl:px-10 py-8">
        {showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all jobs
          </button>
        )}

        <div className="@5xl:grid @5xl:grid-cols-12 @5xl:gap-16">
          <div className="@5xl:col-span-4 mb-10 @5xl:mb-0">
            <div className="@5xl:sticky @5xl:top-32">
              <h1 className="text-4xl @2xl:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {job.title}
              </h1>

              <div className="space-y-4 mb-8">
                {job.department && (
                  <div className="flex items-center text-gray-600">
                    <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-medium font-mono uppercase">
                      {job.department}
                    </span>
                  </div>
                )}

                {locations.length > 0 && (
                  <div className="text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-3 text-gray-400 shrink-0" />
                      {hasMultipleLocations ? (
                        <button
                          onClick={() => setLocationsExpanded(!locationsExpanded)}
                          className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                        >
                          <span>Multiple locations ({locations.length})</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${locationsExpanded ? 'rotate-180' : ''}`}
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
                          animate={{ height: 'auto', opacity: 1 }}
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

                {!locations.length && job.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-3 text-gray-400" />
                    {job.location}
                  </div>
                )}

                {job.workType && (
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-3 text-gray-400" />
                    {job.workType}
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center font-medium text-gray-900">
                    <Coins size={18} className="mr-3 text-gray-400" />
                    {job.salary}
                  </div>
                )}
              </div>

              <button
                onClick={onApply}
                className="w-full @2xl:w-auto @5xl:w-full py-4 px-8 bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply for this Position
              </button>
            </div>
          </div>

          <div className="@5xl:col-span-8">
            <div className="[&>*:first-child]:mt-0">
              <ReactMarkdown components={markdownComponents}>
                {job.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
