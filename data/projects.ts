export type Project = {
  slug: string;
  name: string;
  /** Small mono label above the card title, e.g. "CLI · npm" */
  eyebrow: string;
  blurb: string;
  tags: string[];
  links: { github?: string; demo?: string };
  /**
   * Optional verified number shown large on the card
   * (e.g. { value: "3k+", label: "downloads" }). Leave unset until verified.
   */
  metric?: { value: string; label: string };
  /** Optional mono accent line, e.g. "sha256 · append-only" */
  detail?: string;
  featured?: boolean;
};

const gh = (repo: string) => `https://github.com/rahulbhardwaj94/${repo}`;

export const projects: Project[] = [
  {
    slug: "agentrie",
    name: "agentrie",
    eyebrow: "Featured · Open Source",
    blurb:
      "A multi-agent orchestration framework with end-to-end W3C traceparent propagation and an LLM-as-judge evaluation layer — so agent runs are observable, reproducible, and gradeable.",
    tags: ["TypeScript", "OpenTelemetry", "LLM-as-Judge"],
    links: { github: gh("agentrie") },
    featured: true,
  },
  {
    slug: "inspecto",
    name: "inspecto",
    eyebrow: "CLI · npm",
    blurb:
      "Grades your AI coding sessions from the terminal and flags where the model drifted.",
    tags: ["Node", "CLI"],
    links: { github: gh("inspecto") },
    // metric: { value: "…", label: "downloads" }, // fill in real npm downloads
  },
  {
    slug: "traceglass",
    name: "traceglass",
    eyebrow: "Library · Audit",
    blurb:
      "Tamper-evident, hash-chained audit logger for AI agents — every action is verifiable after the fact.",
    tags: ["SHA-256", "Append-only"],
    links: { github: gh("traceglass") },
    detail: "sha256 · append-only",
  },
  {
    slug: "gradelee",
    name: "gradelee",
    eyebrow: "Serverless · AWS",
    blurb:
      "Serverless AI grader on Lambda + CDK with a swappable model provider behind one interface.",
    tags: ["Lambda", "CDK", "TypeScript"],
    links: { github: gh("gradelee") },
  },
  {
    slug: "memory-os",
    name: "memory-os",
    eyebrow: "Retrieval · MCP",
    blurb:
      "A pgvector-backed memory vault exposed over MCP — durable RAG retrieval any agent can query.",
    tags: ["pgvector", "MCP", "RAG"],
    links: { github: gh("memory-os") },
  },
  {
    slug: "veto",
    name: "veto",
    eyebrow: "Plugin · FinOps",
    blurb:
      "An AI cost-governor plugin that caps and routes spend per agent before the bill surprises you — backed by a heavy test suite.",
    tags: ["TypeScript", "Plugin API"],
    links: { github: gh("veto") },
  },
];

/** Feature highlights shown on the featured card in place of unverified metrics. */
export const featuredHighlights = [
  { value: "W3C", label: "traceparent spans" },
  { value: "LLM", label: "as-judge evals" },
  { value: "Multi", label: "agent orchestration" },
];
