/**
 * Shared constants for the Job Board components
 */

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
