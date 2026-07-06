export type ExperienceEntry = {
  /** Mono date column, e.g. "2022 — 2025" */
  period: string;
  current?: boolean;
  title: string;
  description: string;
  tags: string[];
};

export const experience: ExperienceEntry[] = [
  {
    period: "Ongoing",
    current: true,
    title: "Open Source — AI Infrastructure",
    description:
      "Building open-source orchestration, evaluation, and memory tooling for LLM agents.",
    tags: ["Agents", "OSS"],
  },
  {
    period: "2025 — Now",
    current: true,
    title: "Senior Software Engineer — Tech Four Solutions",
    description:
      "Backend systems for Spark Minda (automotive / manufacturing): services, integrations, and the AWS plumbing underneath.",
    tags: ["NestJS", "AWS"],
  },
  {
    period: "2022 — 2025",
    title: "Software Engineer — FlexiLoans (NBFC / Digital Lending)",
    description:
      "Core lending services on AWS/EKS: origination, disbursal, and billing at scale. Idempotent pipelines, distributed tracing, production debugging.",
    tags: ["AWS · EKS", "SQS", "Distributed Systems"],
  },
];
