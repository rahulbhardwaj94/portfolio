"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GamificationProvider } from "@/components/gamification/GamificationContext";
import { GamificationUI } from "@/components/gamification/GamificationUI";
import { Reveal } from "@/components/case-study/Reveal";
import { ReadingProgress } from "@/components/case-study/ReadingProgress";
import { DeepDiverTracker } from "@/components/case-study/DeepDiverTracker";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";

// ─── Animated time counter ────────────────────────────────────────────────────

function TimeCounter({ from, to }: { from: string; to: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(from);

  const parse = (t: string) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };

  const fmt = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

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
    const fromSecs = parse(from);
    const toSecs = parse(to);
    const duration = 2400;
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(fromSecs - (fromSecs - toSecs) * ease);
      setDisplay(fmt(current));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [started, from, to]);

  return (
    <div ref={ref} className="outcome mono">
      <div className="label">OUTCOME · RESPONSE TIME</div>
      <div className="from-to">
        <div className="num from">{from}</div>
        <div className="arr">→</div>
        <div className="num to">{display}</div>
      </div>
      <div className="sub">33× faster · zero schema migrations · same hardware</div>
    </div>
  );
}

// ─── Page content ─────────────────────────────────────────────────────────────

function BillingContent() {
  return (
    <article className="article">
      <header>
        <div className="eyebrow">
          <span className="num">02 / war story</span> · production performance
        </div>
        <h1 className="headline">
          From <span className="accent">6 minutes</span>
          <br />
          to <span className="accent">11 seconds</span>.
        </h1>
        <p className="lede">
          A nightly billing job at a fintech with 200k active loans had quietly slid from{" "}
          <strong>40 seconds</strong> to <strong>six minutes</strong> over a year of growth. Nobody
          noticed until the day it started overlapping with morning operations. This is the autopsy —
          what broke, how I found it, and the boring fix that returned <strong>33×</strong>.
        </p>
        <div className="meta-row mono">
          <div><span className="k">company</span>&nbsp;<span className="v">FlexiLoans · NBFC</span></div>
          <div><span className="k">stack</span>&nbsp;<span className="v">NestJS · MongoDB · Redis · SQS</span></div>
          <div><span className="k">duration</span>&nbsp;<span className="v">~3 days</span></div>
          <div><span className="k">read</span>&nbsp;<span className="v">12 min</span></div>
        </div>
      </header>

      {/* CHAPTER 01 — THE PROBLEM */}
      <section className="chapter" id="problem">
        <Reveal>
          <div className="chapter-num">CHAPTER 01 — THE PROBLEM</div>
          <h2>The job was slow. Then it was late.</h2>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Every night at 02:00 IST a single cron handler woke up, pulled every active loan, and
            computed interest accrued, late fees, and principal allocation for the day. It pushed
            events to SQS, updated MongoDB, and posted ledger entries to MySQL. When I joined the
            team it ran in about 90 seconds.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p>
            A year later, with the portfolio at <strong>~200,000 active loans</strong>, it took six
            minutes on a clean run and twelve on a bad one. The first time it overlapped with the
            07:00 ops desk login, a teammate paged me at 06:48 with one message:{" "}
            <span className="mono" style={{ color: "var(--text)" }}>
              &quot;billing is still running. our agents are seeing stale balances.&quot;
            </span>
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="statlines">
            <div className="statline bad">
              <div className="lbl">P95 runtime</div>
              <div className="val">6:08</div>
              <div className="delta" style={{ color: "var(--red)" }}>+580% vs baseline</div>
            </div>
            <div className="statline bad">
              <div className="lbl">DB CPU at peak</div>
              <div className="val">78%</div>
              <div className="delta" style={{ color: "var(--red)" }}>primary saturating</div>
            </div>
            <div className="statline bad">
              <div className="lbl">Pages last 30d</div>
              <div className="val">11</div>
              <div className="delta" style={{ color: "var(--red)" }}>all on this job</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="muted">
            Agents quoting wrong balances meant disputed collections, retried bank pulls, and a hard
            cap on how many customers we could service before compliance escalated. &quot;Make the
            job faster&quot; became a P1.
          </p>
        </Reveal>
      </section>

      {/* CHAPTER 02 — THE INVESTIGATION */}
      <section className="chapter" id="investigation">
        <Reveal>
          <div className="chapter-num">CHAPTER 02 — THE INVESTIGATION</div>
          <h2>Telemetry first. Theories second.</h2>
        </Reveal>
        <Reveal delay={60}>
          <p>
            The first thing I didn&apos;t do was open the code. I opened CloudWatch and Mongo Atlas
            and asked one question: <strong>where is the time going?</strong> A six-minute job is
            usually 80% waiting on something.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p>
            I added a{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>
              @Timed()
            </span>{" "}
            decorator on every method and piped histograms to CloudWatch. The first run came back
            ugly:
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="logs mono">
            <div><span className="ts">02:00:01.214</span>&nbsp;&nbsp;<span className="ok">[bill]</span>&nbsp; loaded 198,412 active loans in 312ms</div>
            <div><span className="ts">02:00:01.546</span>&nbsp;&nbsp;<span className="ok">[bill]</span>&nbsp; fanning out to 200k tasks · concurrency=200</div>
            <div><span className="ts">02:00:34.811</span>&nbsp;&nbsp;<span className="warn">[bill]</span>&nbsp; P95 task latency rising · queue depth 12,400</div>
            <div><span className="ts">02:01:48.330</span>&nbsp;&nbsp;<span className="warn">[bill]</span>&nbsp; redis MGET p99 = 184ms <span className="ts">(huh)</span></div>
            <div><span className="ts">02:02:11.902</span>&nbsp;&nbsp;<span className="err">[bill]</span>&nbsp; mongo cursor timeout on findOne(loans) · retry</div>
            <div><span className="ts">02:04:09.107</span>&nbsp;&nbsp;<span className="err">[bill]</span>&nbsp; IOPS exhausted on rate-tier collection</div>
            <div><span className="ts">02:05:22.880</span>&nbsp;&nbsp;<span className="warn">[bill]</span>&nbsp; catching up · 14k tasks remaining</div>
            <div><span className="ts">02:06:08.341</span>&nbsp;&nbsp;<span className="ok">[bill]</span>&nbsp; done · 198,412 ok · 0 failed · <span style={{ color: "var(--red)" }}>368.1s</span></div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Three signals jumped out: Redis MGET was unreasonably slow, MongoDB was hot, and the
            concurrency knob was lying. I dropped into the code:
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="code">
            <div className="code-head">
              <span className="mono">src/billing/run-cycle.service.ts</span>
              <span className="mono" style={{ color: "var(--red)" }}>// before</span>
            </div>
            <div className="code-body">
              <pre>{`for (const loan of loans) {           // 200k iterations
  const tier  = await redis.get(\`rate:tier:\${loan.product}\`);
  const rate  = await redis.get(\`rate:val:\${tier}\`);
  const hist  = await billRepo.findHistory(loan._id);
  const ledger = await ledgerRepo.openFor(loan._id);
  // ...10 more awaits, all sequential
  await computeAndPost(loan, tier, rate, hist, ledger);
}`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            200k loans × ~12 awaits each = <strong className="mono">~2.4 million</strong>{" "}
            sequential I/O round-trips. The{" "}
            <span className="mono" style={{ color: "var(--text)" }}>
              concurrency=200
            </span>{" "}
            setting? It was on the SQS publisher, not the compute loop. The loop was serial.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p>
            The biggest single offender: a query MongoDB couldn&apos;t index. Every loan hit a
            full collection scan:
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="code">
            <div className="code-head">
              <span className="mono">billing-history.repository.ts</span>
              <span className="mono" style={{ color: "var(--red)" }}>// ⚠ COLLSCAN 200k docs</span>
            </div>
            <div className="code-body">
              <pre>{`return this.model.findOne({
  loanId: loanId,
  cycleDate: { $gte: startOfDay, $lte: endOfDay },
  status: "PENDING",
}).exec();
// No compound index on (loanId, cycleDate, status).
// 200k loans × full scan = scanning the universe.`}
              </pre>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="pull">
            The concurrency flag was on the wrong thing. The loop was serial. And the database was
            doing a full collection scan 200,000 times.
            <span className="by">— three bugs, one slow job</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="diagram">
            <svg viewBox="0 0 640 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
              <text x="20" y="28" fill="#6B6B6B" fontSize="11" fontFamily="monospace">BEFORE — serial, 2.4M round-trips</text>
              <rect x="20" y="40" width="80" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
              <text x="60" y="62" textAnchor="middle" fill="#FAFAFA" fontSize="11" fontFamily="monospace">loan[n]</text>
              <path d="M100 58 L140 58" stroke="#6B6B6B" strokeWidth="1.5" />
              <rect x="140" y="40" width="60" height="36" rx="6" fill="rgba(255,77,77,0.08)" stroke="rgba(255,77,77,0.25)" />
              <text x="170" y="62" textAnchor="middle" fill="#FF7B7B" fontSize="10" fontFamily="monospace">redis×2</text>
              <path d="M200 58 L240 58" stroke="#6B6B6B" strokeWidth="1.5" />
              <rect x="240" y="40" width="60" height="36" rx="6" fill="rgba(255,77,77,0.08)" stroke="rgba(255,77,77,0.25)" />
              <text x="270" y="62" textAnchor="middle" fill="#FF7B7B" fontSize="10" fontFamily="monospace">scan×1</text>
              <path d="M300 58 L340 58" stroke="#6B6B6B" strokeWidth="1.5" />
              <rect x="340" y="40" width="60" height="36" rx="6" fill="rgba(255,77,77,0.04)" stroke="rgba(255,77,77,0.15)" />
              <text x="370" y="62" textAnchor="middle" fill="#FF7B7B" fontSize="10" fontFamily="monospace">mysql×2</text>
              <text x="430" y="62" fill="#FF4D4D" fontSize="11" fontFamily="monospace">→ 368s</text>
              <text x="20" y="120" fill="#6B6B6B" fontSize="11" fontFamily="monospace">AFTER — batched + pipelined + indexed</text>
              <rect x="20" y="132" width="100" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
              <text x="70" y="154" textAnchor="middle" fill="#FAFAFA" fontSize="11" fontFamily="monospace">chunk×500</text>
              <path d="M120 150 L160 150" stroke="rgba(20,184,166,0.5)" strokeWidth="1.5" />
              <rect x="160" y="132" width="80" height="36" rx="6" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.3)" />
              <text x="200" y="154" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">MGET batch</text>
              <path d="M240 150 L280 150" stroke="rgba(20,184,166,0.5)" strokeWidth="1.5" />
              <rect x="280" y="132" width="80" height="36" rx="6" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.3)" />
              <text x="320" y="154" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">idx scan</text>
              <path d="M360 150 L400 150" stroke="rgba(20,184,166,0.5)" strokeWidth="1.5" />
              <rect x="400" y="132" width="80" height="36" rx="6" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.3)" />
              <text x="440" y="154" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">bulk write</text>
              <text x="500" y="154" fill="#14B8A6" fontSize="11" fontFamily="monospace">→ 11s</text>
            </svg>
            <div className="diagram-cap">
              Before: 2.4M sequential round-trips · After: chunked MGET pipeline + compound index
            </div>
          </div>
        </Reveal>
      </section>

      {/* CHAPTER 03 — THE FIX */}
      <section className="chapter" id="fix">
        <Reveal>
          <div className="chapter-num">CHAPTER 03 — THE FIX</div>
          <h2>Three boring changes. One satisfying deploy.</h2>
        </Reveal>
        <Reveal delay={60}>
          <p>
            None of the fixes were clever. Production bugs usually aren&apos;t mysteries — they&apos;re
            obvious in hindsight once you have the telemetry.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p>
            <strong>Fix 1: Redis pipeline.</strong> Instead of two sequential{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>GET</span> calls per loan, I
            batched all rate lookups upfront with{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>MGET</span>. Unique product
            types: ~12. Total Redis round-trips for 200k loans: 2.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="code">
            <div className="code-head">
              <span className="mono">src/billing/run-cycle.service.ts</span>
              <span className="mono" style={{ color: "var(--accent)" }}>// after</span>
            </div>
            <div className="code-body">
              <pre>{`// Hoist rate lookups out of the loop entirely
const products = [...new Set(loans.map(l => l.product))];
const tiers = await redis.mget(...products.map(p => \`rate:tier:\${p}\`));
const rateMap = await buildRateMap(redis, tiers);

// Now the loop touches no I/O for rates
for (const loan of loans) {
  const rate = rateMap.get(loan.product); // O(1) map lookup
  ...
}`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            <strong>Fix 2: Compound index on billing history.</strong> One migration, background
            build, zero downtime. The query went from a 200k-doc COLLSCAN to a single IXSCAN.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="code">
            <div className="code-head">
              <span className="mono">migrations/20240318-billing-index.ts</span>
            </div>
            <div className="code-body">
              <pre>{`await db.collection("billing_history").createIndex(
  { loanId: 1, cycleDate: 1, status: 1 },
  { background: true, name: "billing_lookup_idx" }
);
// COLLSCAN (200k docs) → IXSCAN (1 doc). Mongo Atlas confirmed
// query execution time dropped from ~420ms to 0.3ms per loan.`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            <strong>Fix 3: Real concurrency.</strong> Moved the concurrency control to the compute
            loop using{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>p-limit</span> with a
            concurrency of 50. With all I/O removed from the hot path, throughput jumped from ~550
            loans/sec to ~18,000 loans/sec.
          </p>
        </Reveal>
      </section>

      {/* CHAPTER 04 — THE OUTCOME */}
      <section className="chapter" id="outcome">
        <Reveal>
          <div className="chapter-num">CHAPTER 04 — THE OUTCOME</div>
          <h2>Numbers that don&apos;t lie.</h2>
        </Reveal>
        <Reveal delay={60}>
          <TimeCounter from="6:08" to="0:11" />
        </Reveal>
        <Reveal delay={100}>
          <div className="statlines">
            <div className="statline">
              <div className="lbl">Throughput</div>
              <div className="val" style={{ color: "var(--accent)" }}>18k/s</div>
              <div className="delta">loans/sec vs 550 before</div>
            </div>
            <div className="statline">
              <div className="lbl">DB CPU peak</div>
              <div className="val" style={{ color: "var(--accent)" }}>4%</div>
              <div className="delta">down from 78%</div>
            </div>
            <div className="statline">
              <div className="lbl">Pages since</div>
              <div className="val" style={{ color: "var(--accent)" }}>0</div>
              <div className="delta">on this job</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="muted">
            The job finishes at 02:11 IST. The ops desk logs in at 07:00. There&apos;s four hours
            and forty-nine minutes of margin where there used to be a race condition.
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
                <div className="t">Add the index before the first 100k loans, not after 200k.</div>
                <div className="d">
                  The compound index should have been in the schema from day one. If you&apos;re
                  building a per-entity history collection, the query pattern is obvious — index it
                  upfront.
                </div>
              </div>
            </div>
            <div className="ref-row">
              <div className="n">02</div>
              <div>
                <div className="t">Instrument the cron job the same day it ships.</div>
                <div className="d">
                  We had no per-phase timing for a job that ran 365 nights/year. A{" "}
                  <span className="mono" style={{ fontSize: 13 }}>@Timed()</span> decorator is 4
                  lines. It would have caught the drift at 50k loans, not 200k.
                </div>
              </div>
            </div>
            <div className="ref-row">
              <div className="n">03</div>
              <div>
                <div className="t">Never trust a concurrency knob you didn&apos;t write yourself.</div>
                <div className="d">
                  The existing code had{" "}
                  <span className="mono" style={{ fontSize: 13 }}>concurrency: 200</span>. That
                  number gave everyone false confidence. Audit what the flag actually controls before
                  you cite it as a defence.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal delay={60}>
        <div className="cta">
          <Link href="/case-studies/cibil">
            <div className="kicker">← previous</div>
            <div className="label">₹30L saved with one integration</div>
            <div className="arrow">↖</div>
          </Link>
          <Link href="/case-studies/eks-migration">
            <div className="kicker">next →</div>
            <div className="label">20+ services, ECS → EKS, zero downtime</div>
            <div className="arrow">↗</div>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}

export default function BillingCaseStudyPage() {
  return (
    <GamificationProvider>
      <ReadingProgress />
      <CaseStudyNav chapterNum="02" chapterLabel="billing" />
      <BillingContent />
      <DeepDiverTracker />
      <GamificationUI />
    </GamificationProvider>
  );
}
