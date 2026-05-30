"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GamificationProvider } from "@/components/gamification/GamificationContext";
import { GamificationUI } from "@/components/gamification/GamificationUI";
import { Reveal } from "@/components/case-study/Reveal";
import { ReadingProgress } from "@/components/case-study/ReadingProgress";
import { DeepDiverTracker } from "@/components/case-study/DeepDiverTracker";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";

// ─── Animated rupee counter ───────────────────────────────────────────────────

function RupeeCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState("₹0");

  const target = 3000000; // ₹30,00,000

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2600;
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      // Format as ₹XX,XX,XXX (Indian numbering)
      const formatted = current.toLocaleString("en-IN");
      setDisplay(`₹${formatted}`);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [started]);

  return (
    <div ref={ref} className="outcome mono">
      <div className="label">OUTCOME · ANNUAL SAVINGS</div>
      <div className="from-to">
        <div className="num from">₹0</div>
        <div className="arr">→</div>
        <div className="num to">{display}</div>
      </div>
      <div className="sub">
        saved per year · same SLA · no compliance incidents · same data quality
      </div>
    </div>
  );
}

// ─── Page content ─────────────────────────────────────────────────────────────

function CIBILContent() {
  return (
    <article className="article">
      <header>
        <div className="eyebrow">
          <span className="num">01 / war story</span> · cost engineering
        </div>
        <h1 className="headline">
          How I saved <span className="accent">₹30 lakhs</span>
          <br />a year with one
          <br />
          <span className="accent">API swap</span>.
        </h1>
        <p className="lede">
          At FlexiLoans, credit bureau pulls were our second-largest API cost — after SMS. We were
          routing every CIBIL check through an aggregator that charged a premium we&apos;d stopped
          questioning. It took one cost-review spreadsheet and three weeks of integration work to{" "}
          <strong>cut the per-pull cost by 62%</strong> and reclaim ₹30 lakhs a year. No compliance
          incidents. No data quality regressions. Just a quieter finance team.
        </p>
        <div className="meta-row mono">
          <div><span className="k">company</span>&nbsp;<span className="v">FlexiLoans · NBFC</span></div>
          <div><span className="k">stack</span>&nbsp;<span className="v">NestJS · TypeScript · Redis · MySQL</span></div>
          <div><span className="k">duration</span>&nbsp;<span className="v">~3 weeks</span></div>
          <div><span className="k">read</span>&nbsp;<span className="v">8 min</span></div>
        </div>
      </header>

      {/* CHAPTER 01 — THE PROBLEM */}
      <section className="chapter" id="problem">
        <Reveal>
          <div className="chapter-num">CHAPTER 01 — THE PROBLEM</div>
          <h2>₹62 per pull. Nobody had done the math.</h2>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Every loan application at FlexiLoans triggered at minimum two CIBIL bureau pulls: one
            at pre-screening (soft pull, no inquiry) and one at disbursement (hard pull, creates
            an inquiry record). Loan renewals added another. Fraud checks, KYC refreshes, and
            portfolio monitoring added more. By the time I joined, we were doing roughly{" "}
            <strong>48,000 bureau pulls per month</strong>.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p>
            We were routing all of this through an aggregator — a middleware company that abstracts
            CIBIL, Experian, and CRIF behind a single normalized API. Aggregators are genuinely
            useful for smaller players: they handle bureau certification, parse the bureau&apos;s
            XML responses, normalize fields, and absorb the compliance overhead. For an early-stage
            NBFC, the convenience premium is worth it.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <p>
            FlexiLoans was no longer early-stage. During a quarterly infra cost review, I pulled
            the API cost breakdown out of curiosity. Bureau pulls were{" "}
            <span className="mono" style={{ color: "var(--text)" }}>₹62 per call</span>. The
            direct CIBIL API rate for authorized NBFCs was{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>₹23.50</span>.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="statlines">
            <div className="statline bad">
              <div className="lbl">Current cost/pull</div>
              <div className="val">₹62</div>
              <div className="delta" style={{ color: "var(--red)" }}>aggregator rate</div>
            </div>
            <div className="statline bad">
              <div className="lbl">Monthly volume</div>
              <div className="val">48k</div>
              <div className="delta" style={{ color: "var(--red)" }}>+15% YoY growth</div>
            </div>
            <div className="statline bad">
              <div className="lbl">Annual cost</div>
              <div className="val">₹35.7L</div>
              <div className="delta" style={{ color: "var(--red)" }}>and climbing</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="muted">
            The direct CIBIL rate would cost ₹13.5L/year on the same volume. The delta was
            ₹22L. Add in the deduplication optimization I was already planning, and the number
            grew to ₹30L. That math goes to a VP. The VP says do it.
          </p>
        </Reveal>
      </section>

      {/* CHAPTER 02 — THE INVESTIGATION */}
      <section className="chapter" id="investigation">
        <Reveal>
          <div className="chapter-num">CHAPTER 02 — THE INVESTIGATION</div>
          <h2>Eight call sites. Three surprises.</h2>
        </Reveal>
        <Reveal delay={60}>
          <p>
            Before writing a line of code, I mapped every place in the codebase that called the
            aggregator. I expected maybe four or five. I found eight — and one of them was calling
            the same bureau report twice within a 24-hour window on the same PAN.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="logs mono">
            <div><span className="ok">[audit]</span> found 8 call sites to bureau aggregator</div>
            <div><span className="ok">[audit]</span> loan/pre-screen.service.ts:142 — soft pull</div>
            <div><span className="ok">[audit]</span> loan/disbursement.service.ts:87 — hard pull</div>
            <div><span className="ok">[audit]</span> renewal/eligibility.service.ts:203 — refresh</div>
            <div><span className="warn">[audit]</span> fraud/kyc-verify.service.ts:61 — hard pull</div>
            <div><span className="warn">[audit]</span> fraud/re-kyc.service.ts:44 — DUPLICATE: same PAN, same day as kyc-verify</div>
            <div><span className="ok">[audit]</span> monitoring/portfolio-health.ts:318 — batch (monthly)</div>
            <div><span className="ok">[audit]</span> monitoring/early-warning.ts:94 — triggered pull</div>
            <div><span className="ok">[audit]</span> ops/manual-refresh.controller.ts:29 — agent-initiated</div>
            <div style={{ marginTop: 8 }}><span style={{ color: "var(--accent)" }}>[summary]</span> ~14% of pulls are unnecessary duplicates within 24h window</div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            The duplicate was introduced during a fraud stack refactor six months earlier. Two
            services were independently doing KYC verification on the same event, both calling the
            bureau. No one had noticed because the cost was invisible in the aggregate.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p>
            Beyond dedup, the real integration challenge was the CIBIL direct API itself. The
            aggregator had been giving us a clean, normalized JSON response. CIBIL&apos;s direct API
            returns a dense XML payload — the CREDIT VISION format — with nested structures that
            require careful parsing:
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="code">
            <div className="code-head">
              <span className="mono">cibil-response.sample.xml (truncated)</span>
              <span className="mono" style={{ color: "var(--muted)" }}>// what CIBIL actually sends</span>
            </div>
            <div className="code-body">
              <pre>{`<INProfileResponse>
  <Header>
    <ReportDate>09-2024</ReportDate>
    <MemberReferenceNumber>FXL-20240918-001</MemberReferenceNumber>
  </Header>
  <Current-Application>
    <Current-Application-Details>
      <Current-Applicant-Details>
        <InquiryPurpose>07</InquiryPurpose>  <!-- 07 = personal loan -->
      </Current-Applicant-Details>
    </Current-Application-Details>
  </Current-Application>
  <SCORE>
    <BureauScore>742</BureauScore>      <!-- -1 = no score (thin file) -->
    <BureauScoreConfidLevel>H</BureauScoreConfidLevel>
  </SCORE>
  <CAIS_Account>
    <CAIS_Account_DETAILS>   <!-- repeats per tradeline -->
      <Account_Status>11</Account_Status>  <!-- lookup table, 11 = active -->
      <Credit_Limit_Amount>500000</Credit_Limit_Amount>
      <Current_Balance>180000</Current_Balance>
      ...`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            The aggregator was abstracting all of this into{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>bureauScore</span>,{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>activeTradelines</span>, and
            a handful of normalized fields. I had to reverse-engineer which fields our downstream
            credit models actually consumed, then build a parser that produced the same shape.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="pull">
            The aggregator wasn&apos;t doing magic. It was doing XML parsing and field mapping. We
            were paying ₹38.50 per call for a function that took a senior engineer 3 days to
            replicate.
            <span className="by">— the actual cost of convenience</span>
          </div>
        </Reveal>
      </section>

      {/* CHAPTER 03 — THE FIX */}
      <section className="chapter" id="fix">
        <Reveal>
          <div className="chapter-num">CHAPTER 03 — THE FIX</div>
          <h2>An interface, a cache, and a feature flag.</h2>
        </Reveal>
        <Reveal delay={60}>
          <p>
            The architecture decision was straightforward: don&apos;t rip out the aggregator on day
            one. Build an abstraction layer with two implementations, run both behind a feature flag,
            and migrate traffic incrementally. If the direct integration has data quality issues, flip
            the flag and the aggregator is back.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="code">
            <div className="code-head">
              <span className="mono">src/bureau/bureau.interface.ts</span>
            </div>
            <div className="code-body">
              <pre>{`export interface BureauReport {
  pan: string;
  bureauScore: number | null;  // null = thin file (< 6 months history)
  activeTradelines: number;
  overdueAccounts: number;
  highCreditAmount: number;
  enquiriesLast6Months: number;
  reportFetchedAt: Date;
  rawRef: string;              // bureau reference for audit trail
}

export interface IBureauClient {
  fetchReport(pan: string, purpose: BureauPurpose): Promise<BureauReport>;
}

// Two implementations:
// AggregatorBureauClient  — existing, delegates to vendor
// CIBILDirectClient       — new, calls bureau directly`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            <strong>The cache layer.</strong> Before routing to either client, we check Redis for
            a cached report. Same PAN + same purpose within 24 hours = serve the cache. This alone
            eliminated ~14% of pulls (the duplicate KYC calls I found during the audit), saving
            roughly ₹8L/year independently of the vendor swap.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="code">
            <div className="code-head">
              <span className="mono">src/bureau/bureau.service.ts</span>
            </div>
            <div className="code-body">
              <pre>{`async fetchReport(pan: string, purpose: BureauPurpose): Promise<BureauReport> {
  const cacheKey = \`bureau:\${pan}:\${purpose}\`;
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);  // cache hit — ₹0

  const client = this.featureFlags.isEnabled('cibil_direct')
    ? this.cibilDirectClient
    : this.aggregatorClient;

  const report = await client.fetchReport(pan, purpose);

  // Cache for 23h (bureaus allow same-day same-purpose re-use)
  await this.redis.set(cacheKey, JSON.stringify(report), 'EX', 82800);
  return report;
}`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            <strong>The rollout.</strong> We ran the direct client at 5% of traffic for the first
            week, comparing bureau scores against the aggregator&apos;s response on the same PAN.
            Parity was 99.7% (the 0.3% delta was rounding differences in the score model, which the
            bureau confirmed as acceptable). We ramped to 100% over three weeks.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="diagram">
            <svg viewBox="0 0 600 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
              <text x="20" y="24" fill="#6B6B6B" fontSize="11" fontFamily="monospace">ROLLOUT TIMELINE — 3 WEEKS</text>
              {/* Week bars */}
              <rect x="20" y="36" width="160" height="28" rx="4" fill="rgba(20,184,166,0.15)" stroke="rgba(20,184,166,0.3)" />
              <text x="100" y="55" textAnchor="middle" fill="#14B8A6" fontSize="11" fontFamily="monospace">Week 1: 5% direct</text>
              <rect x="200" y="36" width="160" height="28" rx="4" fill="rgba(20,184,166,0.25)" stroke="rgba(20,184,166,0.4)" />
              <text x="280" y="55" textAnchor="middle" fill="#14B8A6" fontSize="11" fontFamily="monospace">Week 2: 50% direct</text>
              <rect x="380" y="36" width="160" height="28" rx="4" fill="rgba(20,184,166,0.4)" stroke="rgba(20,184,166,0.6)" />
              <text x="460" y="55" textAnchor="middle" fill="#14B8A6" fontSize="11" fontFamily="monospace">Week 3: 100% direct</text>
              {/* Metrics */}
              <text x="20" y="96" fill="#6B6B6B" fontSize="10" fontFamily="monospace">score parity</text>
              <text x="100" y="96" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">99.6%</text>
              <text x="280" y="96" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">99.7%</text>
              <text x="460" y="96" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">99.8% ✓</text>
              <text x="20" y="116" fill="#6B6B6B" fontSize="10" fontFamily="monospace">incidents</text>
              <text x="100" y="116" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace">0</text>
              <text x="280" y="116" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace">0</text>
              <text x="460" y="116" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace">0</text>
              <text x="20" y="136" fill="#6B6B6B" fontSize="10" fontFamily="monospace">cost/pull</text>
              <text x="100" y="136" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">₹60.1</text>
              <text x="280" y="136" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">₹42.7</text>
              <text x="460" y="136" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">₹23.5</text>
            </svg>
            <div className="diagram-cap">
              Feature-flagged rollout over 3 weeks · score parity monitored daily · zero incidents
            </div>
          </div>
        </Reveal>
      </section>

      {/* CHAPTER 04 — THE OUTCOME */}
      <section className="chapter" id="outcome">
        <Reveal>
          <div className="chapter-num">CHAPTER 04 — THE OUTCOME</div>
          <h2>The math was always there.</h2>
        </Reveal>
        <Reveal delay={60}>
          <RupeeCounter />
        </Reveal>
        <Reveal delay={100}>
          <div className="statlines">
            <div className="statline">
              <div className="lbl">Cost per pull</div>
              <div className="val" style={{ color: "var(--accent)" }}>₹23.5</div>
              <div className="delta">down from ₹62</div>
            </div>
            <div className="statline">
              <div className="lbl">Duplicate pulls</div>
              <div className="val" style={{ color: "var(--accent)" }}>−14%</div>
              <div className="delta">cache layer saved ₹8L/yr extra</div>
            </div>
            <div className="statline">
              <div className="lbl">Score parity</div>
              <div className="val" style={{ color: "var(--accent)" }}>99.8%</div>
              <div className="delta">bureau confirmed acceptable</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="muted">
            Total savings landed at ₹30L/year — the ₹22L from the vendor swap plus ₹8L from
            deduplication. The finance team now has a line item that goes down every year instead of
            up. The credit models got more consistent data (one less normalization layer). The ops
            team can see raw CIBIL reference numbers in audit logs for the first time.
          </p>
        </Reveal>
      </section>

      {/* CHAPTER 05 — REFLECTION */}
      <section className="chapter" id="reflection">
        <Reveal>
          <div className="chapter-num">CHAPTER 05 — REFLECTION</div>
          <h2>What I&apos;d do differently.</h2>
        </Reveal>
        <Reveal delay={60}>
          <div className="reflect">
            <div className="ref-row">
              <div className="n">01</div>
              <div>
                <div className="t">Do the cost audit on day one, not year two.</div>
                <div className="d">
                  The aggregator contract was never reviewed after the original procurement. At a
                  startup, vendor costs that seem trivial at 500 loans/month become material at
                  50,000. Build a cost-per-call dashboard early and check it quarterly.
                </div>
              </div>
            </div>
            <div className="ref-row">
              <div className="n">02</div>
              <div>
                <div className="t">Map every call site before you start coding.</div>
                <div className="d">
                  I expected 4–5 call sites and found 8, including a duplicate that no one knew
                  about. This is always the pattern: the system is messier than the design doc.
                  Grep first. Then plan.
                </div>
              </div>
            </div>
            <div className="ref-row">
              <div className="n">03</div>
              <div>
                <div className="t">The interface abstraction paid for itself in week 1.</div>
                <div className="d">
                  Because the two implementations hid behind an interface, we could run both
                  simultaneously, compare results, and flip between them in &lt;30 seconds. If I
                  had migrated in-place (modifying the existing client), rollback would have been a
                  deploy. Always build the escape hatch before you need it.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal delay={60}>
        <div className="cta">
          <Link href="/">
            <div className="kicker">← home</div>
            <div className="label">Back to portfolio</div>
            <div className="arrow">↖</div>
          </Link>
          <Link href="/case-studies/billing">
            <div className="kicker">next →</div>
            <div className="label">6:00 → 0:11 · a billing job autopsy</div>
            <div className="arrow">↗</div>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}

export default function CIBILCaseStudyPage() {
  return (
    <GamificationProvider>
      <ReadingProgress />
      <CaseStudyNav chapterNum="01" chapterLabel="cibil" />
      <CIBILContent />
      <DeepDiverTracker />
      <GamificationUI />
    </GamificationProvider>
  );
}
