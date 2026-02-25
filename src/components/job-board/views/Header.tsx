"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import type { JobBoardConfig } from "../types";

interface HeaderProps {
  config: JobBoardConfig;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onHomeClick }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-white border-b border-gray-100 h-[clamp(4rem,3rem_+_2.5cqi,5rem)] flex items-center px-[clamp(1.5rem,0.5rem_+_2.5cqi,2.5rem)] shadow-sm"
    >
      <div
        className={clsx(
          "w-full flex items-center",
          config.logoPosition === "center"
            ? "justify-center"
            : "justify-between",
        )}
      >
        <button onClick={onHomeClick} className="focus:outline-none">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.logoUrl}
              alt="Company Logo"
              className="h-[clamp(2rem,1.5rem_+_1.25cqi,2.5rem)] object-contain"
            />
          ) : (
            <div className="text-xl font-bold tracking-tight text-gray-900 font-swiss">
              COMPANY
            </div>
          )}
        </button>

        {config.logoPosition === "center" && (
          <div className="hidden @2xl:block absolute right-10"></div>
        )}
      </div>
    </motion.header>
  );
};
