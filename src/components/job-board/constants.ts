/**
 * Shared constants for the Job Board components
 */

import { BackgroundColor, Job, JobBoardConfig } from "./types";

// ============================================================================
// BACKGROUND COLORS
// ============================================================================

export const BACKGROUND_COLORS: { name: string; value: BackgroundColor }[] = [
  { name: "Navy", value: "#0f172a" },
  { name: "Slate", value: "#1e293b" },
  { name: "Charcoal", value: "#18181b" },
  { name: "Forest", value: "#14532d" },
  { name: "Ocean", value: "#0c4a6e" },
  { name: "Burgundy", value: "#7f1d1d" },
  { name: "Purple", value: "#4c1d95" },
  { name: "Warm Gray", value: "#44403c" },
  { name: "Off-White", value: "#fafaf9" },
  { name: "White", value: "#ffffff" },
];

// ============================================================================
// INITIAL CONFIG (for job board customization)
// ============================================================================

export const INITIAL_CONFIG: JobBoardConfig = {
  logoUrl: null,
  logoPosition: "left",
  copyPosition: "left",
  headline: "Join the Future of Design",
  supportingCopy:
    "We are a collective of thinkers, dreamers, and doers building the next generation of digital experiences.",
  subtext: "EST. 2024 — ZURICH",
  backgroundColor: "#18181b",
  texture: "technical",
  typography: "swiss",
  useDummyData: true,
};

// ============================================================================
// SAMPLE JOBS (for preview mode)
// ============================================================================

export const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Nairobi, Kenya",
    salary: "KES 250,000 - 400,000/month",
    workType: "Hybrid",
    description: `## About the Role

The Senior Software Engineer is responsible for designing and building scalable backend services that power our core product. This role sits within Platform Engineering and reports to the Engineering Manager.

## Core Responsibilities

- Design and implement backend services using Go and Python that handle millions of daily requests
- Lead technical architecture decisions for new product features
- Conduct code reviews and mentor junior engineers on best practices
- Collaborate with Product and Design to translate requirements into technical solutions

## Required Qualifications

- 5+ years building production software systems
- Strong proficiency in Go, Python, or similar backend languages
- Experience with distributed systems, microservices, and event-driven architecture
- Familiarity with AWS or GCP, Kubernetes, and infrastructure-as-code

## Compensation & Benefits

KES 250,000 – 400,000 per month, based on experience

## Location

Nairobi, Kenya — Hybrid (3 days in office)`,
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Dubai, UAE",
    salary: "AED 25,000 - 35,000/month",
    workType: "Hybrid",
    description: `## About the Role

The Product Designer owns end-to-end design for key product areas, from discovery through delivery.

## Core Responsibilities

- Lead design for assigned product areas from research to final handoff
- Conduct user research, synthesize findings, and translate insights into design decisions
- Create wireframes, prototypes, and high-fidelity designs in Figma

## Required Qualifications

- 3+ years of experience in product design, preferably B2B or SaaS
- Strong portfolio demonstrating user-centered design process
- Expert-level Figma skills

## Location

Dubai, UAE — Hybrid (2 days remote)`,
  },
  {
    id: "3",
    title: "Engineering Manager",
    department: "Engineering",
    location: "Cape Town, South Africa",
    workType: "Hybrid",
    description: `## About the Role

The Engineering Manager leads the Payments team, responsible for infrastructure that processes millions in transactions monthly.

## Core Responsibilities

- Hire, mentor, and develop a team of 6-8 engineers
- Define technical roadmap in partnership with Product leadership
- Remove blockers and create an environment where engineers do their best work

## Required Qualifications

- 2+ years of engineering management experience
- Strong technical background with hands-on coding experience
- Experience with payments, fintech, or regulated industries

## Location

Cape Town, South Africa — Hybrid (flexible schedule)`,
  },
  {
    id: "4",
    title: "Data Analyst",
    department: "Data & Analytics",
    location: "Remote (Africa)",
    salary: "USD 40,000 - 60,000/year",
    workType: "Remote",
    description: `## About the Role

The Data Analyst surfaces insights that drive product decisions and business strategy.

## Core Responsibilities

- Build and maintain dashboards and reports using Looker and Metabase
- Write SQL queries to analyze product usage, funnel conversion, and customer behavior

## Required Qualifications

- 2+ years of experience in data analytics or business intelligence
- Advanced SQL skills
- Experience with BI tools such as Looker, Tableau, or Metabase

## Location

Remote — Africa-based candidates preferred`,
  },
];

// ============================================================================
// SAMPLE SCREENING QUESTIONS (for preview mode)
// ============================================================================

export const SAMPLE_SCREENING_QUESTIONS = [
  {
    id: "q1",
    type: "yes_no" as const,
    question: "Are you legally authorized to work in this country?",
    required: true,
    isKnockout: false,
  },
  {
    id: "q2",
    type: "single_select" as const,
    question: "What is your highest level of education?",
    required: true,
    isKnockout: false,
    options: [
      "High School",
      "Bachelor's Degree",
      "Master's Degree",
      "PhD",
      "Other",
    ],
  },
  {
    id: "q3",
    type: "multi_select" as const,
    question: "Which programming languages are you proficient in?",
    required: false,
    isKnockout: false,
    options: ["JavaScript", "Python", "Go", "Rust", "Java", "C++"],
  },
  {
    id: "q4",
    type: "number" as const,
    question: "How many years of relevant experience do you have?",
    required: true,
    isKnockout: false,
    placeholder: "Enter years of experience",
  },
  {
    id: "q5",
    type: "short_text" as const,
    question: "What is your current job title?",
    required: false,
    isKnockout: false,
    placeholder: "e.g. Senior Software Engineer",
  },
  {
    id: "q6",
    type: "url" as const,
    question: "Link to your portfolio or GitHub profile",
    required: false,
    isKnockout: false,
    placeholder: "https://github.com/...",
  },
  {
    id: "q7",
    type: "long_text" as const,
    question:
      "Describe a challenging project you worked on and how you overcame obstacles.",
    required: true,
    isKnockout: false,
    placeholder: "Share your experience...",
  },
];
