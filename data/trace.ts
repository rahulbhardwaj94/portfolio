/**
 * The career trace rendered as a waterfall in the hero.
 *
 * Times are decimal years (2022.5 = mid-2022). `end: null` means the span is
 * still open and runs to "now". Child spans (case studies, flagship OSS) are
 * placed inside their parent — adjust start/end to the real months.
 */
export type TraceSpan = {
  id: string;
  /** Service-style name shown in the label column, e.g. "flexiloans" */
  service: string;
  /** Operation name, e.g. "lending-platform" */
  op: string;
  depth: number;
  start: number;
  end: number | null;
  /** Text printed on / beside the bar — a duration or an outcome */
  note: string;
  /** Optional shorter note for narrow screens */
  shortNote?: string;
  /** Outcome spans get the bright phosphor treatment */
  highlight?: boolean;
  href?: string;
};

export const traceMeta = {
  traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
  axisStart: 2022,
  axisEnd: 2027,
  ticks: [2022, 2023, 2024, 2025, 2026],
};

export const trace: TraceSpan[] = [
  { id: "root", service: "rahul", op: "career", depth: 0, start: 2022, end: null, note: "status OK" },
  { id: "flexi", service: "flexiloans", op: "lending-platform", depth: 1, start: 2022, end: 2025, note: "3y · NBFC" },
  {
    id: "cibil",
    service: "flexiloans",
    op: "bureau.swap",
    depth: 2,
    start: 2023.2,
    end: 2023.45,
    note: "₹30L/yr saved",
    highlight: true,
    href: "/case-studies/cibil",
  },
  {
    id: "billing",
    service: "flexiloans",
    op: "billing.nightly",
    depth: 2,
    start: 2024.1,
    end: 2024.3,
    note: "6 min → 11 s",
    shortNote: "33× faster",
    highlight: true,
    href: "/case-studies/billing",
  },
  { id: "techfour", service: "techfour", op: "spark-minda", depth: 1, start: 2025, end: null, note: "senior swe" },
  {
    id: "eks",
    service: "techfour",
    op: "ecs→eks",
    depth: 2,
    start: 2025.3,
    end: 2025.45,
    note: "23 svc · 0 downtime",
    shortNote: "0 downtime",
    highlight: true,
    href: "/case-studies/eks-migration",
  },
  { id: "oss", service: "oss", op: "agent-infra", depth: 1, start: 2025.5, end: null, note: "orchestration · evals · audit" },
  { id: "agentrie", service: "oss", op: "agentrie", depth: 2, start: 2025.9, end: null, note: "W3C traceparent", href: "#work" },
];
