"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./views/Header";
import { JobListView } from "./views/JobListView";
import { JobDetailView } from "./views/JobDetailView";
import { ApplicationFormView } from "./views/ApplicationFormView";
import { SuccessView } from "./views/SuccessView";
import type {
  JobBoardFlowProps,
  NavigationState,
  ApplicationData,
} from "./types";

export const JobBoardFlow: React.FC<JobBoardFlowProps> = ({
  mode,
  jobs,
  config,
  isLoading = false,
  initialView = "list",
  initialJobId,
  showList = true,
  onApplicationSubmit,
}) => {
  const [nav, setNav] = useState<NavigationState>({
    view: initialView,
    selectedJobId: initialJobId || null,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleExitComplete = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    let headingFont = "Inter, sans-serif";
    let bodyFont = "Inter, sans-serif";

    switch (config.typography) {
      case "editorial":
        headingFont = '"Playfair Display", serif';
        bodyFont = '"Inter", sans-serif';
        break;
      case "grotesk":
        headingFont = '"Space Grotesk", sans-serif';
        bodyFont = '"Space Grotesk", sans-serif';
        break;
      case "swiss":
        headingFont = '"Inter", sans-serif';
        bodyFont = '"Inter", sans-serif';
        break;
      case "humanist":
        headingFont = '"Source Serif 4", serif';
        bodyFont = '"Source Sans 3", sans-serif';
        break;
      case "modern":
        headingFont = '"Syne", sans-serif';
        bodyFont = '"Inter", sans-serif';
        break;
    }

    root.style.setProperty("--font-heading", headingFont);
    root.style.setProperty("--font-body", bodyFont);
  }, [config.typography]);

  const isDarkBg = [
    "#0f172a",
    "#1e293b",
    "#18181b",
    "#14532d",
    "#0c4a6e",
    "#7f1d1d",
    "#4c1d95",
    "#44403c",
  ].includes(config.backgroundColor);
  const textColor = isDarkBg ? "#ffffff" : "#111827";

  const getTextureStyle = () => {
    const dotColor = isDarkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";
    const lineColor = isDarkBg ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const scanLineColor = isDarkBg
      ? "rgba(255,255,255,0.04)"
      : "rgba(0,0,0,0.05)";

    switch (config.texture) {
      case "dotted":
        return {
          backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "20px 20px",
        };
      case "technical":
        return {
          backgroundImage: `
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        };
      case "crt":
        return {
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, ${scanLineColor} 2px, ${scanLineColor} 4px)`,
        };
      default:
        return {};
    }
  };

  const selectedJob = jobs.find((j) => j.id === nav.selectedJobId);

  const goHome = () => {
    if (showList) {
      setNav({ view: "list", selectedJobId: null });
    }
  };

  const goToDetail = (id: string) => {
    setNav({ view: "detail", selectedJobId: id });
  };

  const goToApply = () => {
    setNav((prev) => ({ ...prev, view: "apply" }));
  };

  const closeApply = () => {
    setNav((prev) => ({ ...prev, view: "detail" }));
  };

  const handleApplicationSubmit = async (data: ApplicationData) => {
    if (mode === "live" && onApplicationSubmit && nav.selectedJobId) {
      await onApplicationSubmit(nav.selectedJobId, data);
    }
    setNav((prev) => ({ ...prev, view: "success" }));
  };

  const resetFlow = () => {
    if (showList) {
      setNav({ view: "list", selectedJobId: null });
    } else if (jobs.length > 0) {
      setNav({ view: "detail", selectedJobId: jobs[0].id });
    }
  };

  return (
    <div className="@container h-full w-full overflow-hidden relative font-sans text-gray-900 bg-gray-50">
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-colors duration-500"
        style={{
          backgroundColor: config.backgroundColor,
          ...getTextureStyle(),
        }}
      />

      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto z-10"
      >
        <Header config={config} onHomeClick={goHome} />

        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          {nav.view === "list" && showList && (
            <JobListView
              key="list"
              jobs={jobs}
              config={config}
              textColor={textColor}
              isLoading={isLoading}
              onJobClick={goToDetail}
            />
          )}

          {nav.view === "detail" && selectedJob && (
            <JobDetailView
              key="detail"
              job={selectedJob}
              onBack={goHome}
              onApply={goToApply}
              showBackButton={showList}
            />
          )}

          {nav.view === "apply" && selectedJob && (
            <ApplicationFormView
              key="apply"
              job={selectedJob}
              mode={mode}
              onClose={closeApply}
              onSubmit={handleApplicationSubmit}
            />
          )}

          {nav.view === "success" && (
            <SuccessView
              key="success"
              onReset={resetFlow}
              backButtonText={showList ? "Back to Jobs" : "View Job"}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
