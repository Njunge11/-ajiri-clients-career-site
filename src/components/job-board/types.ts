/**
 * Shared types for the Job Board components
 */

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
// JOB (API Response Model)
// ============================================================================

export interface JobLocation {
  id: string;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  status: string;
  description?: string | null;
  departmentName: string | null;
  jobFunctionName?: string | null;
  employmentTypeName: string | null;
  experienceLevelName?: string | null;
  workTypeName: string | null;
  locations: JobLocation[];
  currency: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  payPeriod: string | null;
  showSalary: boolean;
  publishedAt: string;
  expiresAt?: string | null;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// JOB FACETS (filter options from API)
// ============================================================================

export interface FacetOption {
  label: string;
  value: string;
}

export interface JobFacets {
  departments: FacetOption[];
  workTypes: FacetOption[];
  locations: FacetOption[];
}

// ============================================================================
// JOB FILTERS (URL search params)
// ============================================================================

export interface JobFiltersParams {
  search?: string;
  department?: string;
  workType?: string;
  location?: string;
  page?: number;
  pageSize?: number;
}

// ============================================================================
// APPLICATION FORM (from /jobs/[id]/application-form endpoint)
// ============================================================================

export interface ScreeningQuestion {
  id: string;
  type: string;
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ApplicationForm {
  jobId: string;
  jobTitle: string;
  requireCoverLetter: boolean;
  screeningQuestions: ScreeningQuestion[];
}

// ============================================================================
// APPLICATION DATA
// ============================================================================

export interface ApplicationData {
  resumeFile?: File;
  coverLetterFile?: File;
  answers: Record<string, string | string[]>;
}
