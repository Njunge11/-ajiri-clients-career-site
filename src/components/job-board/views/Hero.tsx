"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { JobBoardConfig } from '../types'

interface HeroProps {
  config: JobBoardConfig
  textColor: string
}

export const Hero: React.FC<HeroProps> = ({ config, textColor }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.610, 0.355, 1.000] as const
      }
    }
  }

  const isCentered = config.copyPosition === 'center'

  return (
    <section className="w-full min-h-[400px] flex flex-col justify-center px-6 @2xl:px-10 py-12 @2xl:py-20 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={clsx(
          "flex flex-col gap-6 @2xl:gap-8",
          isCentered ? "items-center text-center" : "items-start text-left"
        )}
        style={{ color: textColor }}
      >
        <motion.span
          variants={itemVariants}
          className="font-mono text-[11px] @2xl:text-[13px] uppercase tracking-[0.2em] opacity-80"
        >
          {config.subtext}
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="text-4xl @2xl:text-5xl @3xl:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl"
          style={{
            fontFamily: 'var(--font-heading)',
            whiteSpace: 'pre-wrap'
          }}
        >
          {config.headline}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base @2xl:text-lg @3xl:text-xl max-w-2xl opacity-80 leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {config.supportingCopy}
        </motion.p>
      </motion.div>
    </section>
  )
}
