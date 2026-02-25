/**
 * Shared types for the Job Board components
 */

// ============================================================================
// SCREENING QUESTIONS (inlined from ajiri lib/db/types/jobs.ts)
// ============================================================================

export type ScreeningQuestionType =
  | "yes_no"
  | "single_select"
  | "multi_select"
  | "short_text"
  | "long_text"
  | "number"
  | "url"
  | "file_upload";

export interface ScreeningQuestion {
  id: string;
  type: ScreeningQuestionType;
  question: string;
  required: boolean;
  isKnockout: boolean;
  knockoutValue?: string;
  options?: string[];
  placeholder?: string;
}

// ============================================================================
// JOB BOARD CONFIG (Styling/Branding)
// ============================================================================

export type BackgroundColor =
  | "#0f172a"
  | "#1e293b"
  | "#18181b"
  | "#14532d"
  | "#0c4a6e"
  | "#7f1d1d"
  | "#4c1d95"
  | "#44403c"
  | "#fafaf9"
  | "#ffffff";

export type TextureType = "none" | "dotted" | "technical" | "crt";

export type TypographyStyle =
  | "editorial"
  | "grotesk"
  | "swiss"
  | "humanist"
  | "modern";

export interface JobBoardConfig {
  logoUrl: string | null;
  logoPosition: "left" | "center";
  copyPosition: "left" | "center";
  headline: string;
  supportingCopy: string;
  subtext: string;
  backgroundColor: BackgroundColor;
  texture: TextureType;
  typography: TypographyStyle;
  useDummyData: boolean;
}

/**
 * Default config used when company hasn't customized their job board
 */
export const DEFAULT_JOB_BOARD_CONFIG: JobBoardConfig = {
  logoUrl: null,
  logoPosition: "left",
  copyPosition: "left",
  headline: "Join Our Team",
  supportingCopy:
    "We're looking for talented people to help us build the future.",
  subtext: "View open positions below",
  backgroundColor: "#ffffff",
  texture: "none",
  typography: "swiss",
  useDummyData: true,
};

// ============================================================================
// JOB (Display Model)
// ============================================================================

/**
 * Location for display
 */
export interface JobLocation {
  city?: string;
  state?: string;
  country?: string;
}

/**
 * Job type for display in the job board components
 * This is a display-focused model, not the raw DB model
 */
export interface Job {
  id: string;
  title: string;
  department?: string;
  location?: string;
  locations?: JobLocation[];
  salary?: string;
  workType?: string;
  description: string;
  screeningQuestions?: ScreeningQuestion[];
  requireCoverLetter?: boolean;
}

// ============================================================================
// NAVIGATION
// ============================================================================

export type ViewState = "list" | "detail" | "apply" | "success";

export interface NavigationState {
  view: ViewState;
  selectedJobId: string | null;
}

// ============================================================================
// JOB BOARD FLOW PROPS
// ============================================================================

export interface JobBoardFlowProps {
  mode: "preview" | "draft" | "live";
  jobs: Job[];
  isLoading?: boolean;
  config: JobBoardConfig;
  initialView?: "list" | "detail";
  initialJobId?: string;
  showList?: boolean;
  onApplicationSubmit?: (jobId: string, data: ApplicationData) => Promise<void>;
}

// ============================================================================
// APPLICATION DATA
// ============================================================================

export interface ApplicationData {
  resumeFile?: File;
  coverLetterFile?: File;
  linkedinUrl?: string;
  answers: Record<string, string | string[]>;
}
