"use client";

import { motion } from "framer-motion";
import { SuccessView } from "@/components/job-board/views";

export default function SuccessPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      <SuccessView />
    </motion.div>
  );
}
