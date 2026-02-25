"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useJobBoardState } from "../context";

export const SuccessView: React.FC = () => {
  const { slug } = useJobBoardState();
  const headline = "Application Received";
  const letters = headline.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.2 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.15, ease: "easeOut" as const },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-8"
      >
        <Check size={40} strokeWidth={3} />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-2xl @2xl:text-4xl @3xl:text-6xl font-bold text-gray-900 mb-6 flex flex-wrap justify-center"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {letters.map((letter, index) => (
          <motion.span variants={child} key={index}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-gray-500 max-w-md text-lg mb-10 leading-relaxed"
      >
        Thank you for your interest. Our team will review your application and
        get back to you shortly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Link
          href={`/${slug}`}
          className="px-8 py-3 bg-gray-900 text-white font-medium rounded hover:bg-black transition-colors inline-block"
        >
          Back to Jobs
        </Link>
      </motion.div>
    </div>
  );
};
