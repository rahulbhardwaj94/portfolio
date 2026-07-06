export type Skill = {
  label: string;
  /** Accented pills get the cyan glow treatment. */
  accent?: boolean;
};

export const skills: Skill[] = [
  { label: "Distributed Systems", accent: true },
  { label: "AWS · EKS" },
  { label: "LLM Orchestration", accent: true },
  { label: "NestJS · TypeScript" },
  { label: "Node.js" },
  { label: "RAG · pgvector", accent: true },
  { label: "MCP" },
  { label: "Redis · SQS" },
];

export const about = {
  eyebrow: "02 — About",
  heading: "Distributed-systems instincts, pointed at agents.",
  paragraphs: [
    "I build the unglamorous parts of software that matter most under load — queues, idempotency, retries, tracing, and the AWS plumbing that keeps a lending platform correct at scale.",
    "Agents have the same problems in a new costume: partial failure, observability, evaluation, cost. So I build the infrastructure layer — orchestration, memory, audit, governance — that makes LLM systems behave like production software, not demos.",
  ],
};
