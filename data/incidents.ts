/** Case studies, framed as resolved incidents / postmortems on the homepage. */
export type Incident = {
  id: string;
  sev: string;
  service: string;
  title: string;
  /** Struck-through "before" value; omit when only the outcome matters */
  from?: string;
  to: string;
  unit: string;
  summary: string;
  meta: string;
  href: string;
};

export const incidents: Incident[] = [
  {
    id: "INC-0412",
    sev: "SEV-2",
    service: "flexiloans · billing",
    title: "Nightly billing job overlapping morning ops",
    from: "6 min",
    to: "11 s",
    unit: "runtime · 33× faster",
    summary: "200k active loans, a job that slid from 40s to six minutes, and the boring fix that won it back.",
    meta: "mysql · redis · 12 min read",
    href: "/case-studies/billing",
  },
  {
    id: "INC-0287",
    sev: "COST",
    service: "flexiloans · bureau",
    title: "Credit-bureau pulls bleeding margin",
    to: "₹30L",
    unit: "saved per year · −62% per pull",
    summary: "Swapped an aggregator for a direct CIBIL integration. No compliance incidents, no data regressions.",
    meta: "nestjs · cost engineering · 8 min read",
    href: "/case-studies/cibil",
  },
  {
    id: "CHG-0931",
    sev: "CHANGE",
    service: "techfour · platform",
    title: "23 services, ECS → EKS, six weeks",
    from: "40 min",
    to: "8 min",
    unit: "full platform deploy · zero downtime",
    summary: "Weighted traffic shifting across three environments — and the two near-misses that taught the most.",
    meta: "kubernetes · helm · 10 min read",
    href: "/case-studies/eks-migration",
  },
];
