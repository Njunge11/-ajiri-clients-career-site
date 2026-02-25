"use client";

import { createContext, useContext } from "react";
import type { JobBoardConfig } from "./types";

type JobBoardState = {
  config: JobBoardConfig;
  textColor: string;
  isDarkBg: boolean;
  slug: string;
};

type JobBoardActions = Record<string, never>;

const StateContext = createContext<JobBoardState | null>(null);
const ActionsContext = createContext<JobBoardActions | null>(null);

export function useJobBoardState() {
  const ctx = useContext(StateContext);
  if (!ctx)
    throw new Error("useJobBoardState must be used within JobBoard.Root");
  return ctx;
}

export function useJobBoardActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx)
    throw new Error("useJobBoardActions must be used within JobBoard.Root");
  return ctx;
}

export { StateContext, ActionsContext };
