"use client";

import { useEffect, useMemo } from "react";
import { StateContext, ActionsContext } from "./context";
import type { JobBoardConfig } from "./types";

const DARK_BACKGROUNDS = [
  "#0f172a",
  "#1e293b",
  "#18181b",
  "#14532d",
  "#0c4a6e",
  "#7f1d1d",
  "#4c1d95",
  "#44403c",
];

export function Root({
  config,
  slug,
  children,
}: {
  config: JobBoardConfig;
  slug: string;
  children: React.ReactNode;
}) {
  const isDarkBg = DARK_BACKGROUNDS.includes(config.backgroundColor);
  const textColor = isDarkBg ? "#ffffff" : "#111827";

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

  const state = useMemo(
    () => ({ config, textColor, isDarkBg, slug }),
    [config, textColor, isDarkBg, slug],
  );

  const actions = useMemo(() => ({}) as Record<string, never>, []);

  return (
    <ActionsContext value={actions}>
      <StateContext value={state}>{children}</StateContext>
    </ActionsContext>
  );
}
