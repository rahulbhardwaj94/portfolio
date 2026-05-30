"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GamificationProvider } from "@/components/gamification/GamificationContext";
import { GamificationUI } from "@/components/gamification/GamificationUI";
import { Reveal } from "@/components/case-study/Reveal";
import { ReadingProgress } from "@/components/case-study/ReadingProgress";
import { DeepDiverTracker } from "@/components/case-study/DeepDiverTracker";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";

// ─── Service counter ──────────────────────────────────────────────────────────

function ServiceCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(0);

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
    const target = 23;
    const duration = 1800;
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [started]);

  return (
    <div ref={ref} className="outcome mono">
      <div className="label">OUTCOME · SERVICES MIGRATED</div>
      <div className="from-to" style={{ justifyContent: "center" }}>
        <div className="num to">{display}</div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, marginLeft: 16 }}>
          <span style={{ fontSize: "clamp(18px, 2vw, 24px)", color: "var(--accent)", fontFamily: "var(--font-jetbrains), monospace" }}>microservices</span>
          <span style={{ fontSize: "clamp(14px, 1.5vw, 18px)", color: "var(--dim)", fontFamily: "var(--font-jetbrains), monospace" }}>ECS → EKS</span>
        </div>
      </div>
      <div className="sub">
        6 weeks · zero customer-visible incidents · −22% infra cost · deployment time −80%
      </div>
    </div>
  );
}

// ─── Page content ─────────────────────────────────────────────────────────────

function EKSContent() {
  return (
    <article className="article">
      <header>
        <div className="eyebrow">
          <span className="num">03 / war story</span> · infrastructure
        </div>
        <h1 className="headline">
          <span className="accent">23 services</span>,
          <br />
          ECS to EKS,
          <br />
          <span className="accent">zero downtime</span>.
        </h1>
        <p className="lede">
          When the platform team at Spark Minda decided to migrate from AWS ECS to EKS, the timeline
          was six weeks and the constraint was absolute: <strong>no customer-visible incidents</strong>.
          We were running 23 microservices across three environments, most of them stateful enough to
          care deeply about how traffic shifted. This is how we did it — and the two near-misses that
          taught us more than the successes.
        </p>
        <div className="meta-row mono">
          <div><span className="k">company</span>&nbsp;<span className="v">Tech Four Solutions / Spark Minda</span></div>
          <div><span className="k">stack</span>&nbsp;<span className="v">Kubernetes · Helm · AWS ALB · GitHub Actions</span></div>
          <div><span className="k">duration</span>&nbsp;<span className="v">6 weeks</span></div>
          <div><span className="k">read</span>&nbsp;<span className="v">10 min</span></div>
        </div>
      </header>

      {/* CHAPTER 01 — THE PROBLEM */}
      <section className="chapter" id="problem">
        <Reveal>
          <div className="chapter-num">CHAPTER 01 — THE PROBLEM</div>
          <h2>ECS was fine. Until it wasn&apos;t.</h2>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Eighteen months earlier, we had five services and ECS was perfect: simple task
            definitions, ALB target groups, CloudWatch for metrics. The operational overhead was low
            and the learning curve was flat. This is the right call at that scale.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p>
            By the time I joined, we had 23 services and three problems that ECS couldn&apos;t solve
            cleanly:
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="statlines">
            <div className="statline bad">
              <div className="lbl">Memory hogging</div>
              <div className="val">3×</div>
              <div className="delta" style={{ color: "var(--red)" }}>restarts/week on a noisy neighbour</div>
            </div>
            <div className="statline bad">
              <div className="lbl">Deploy time</div>
              <div className="val">40 min</div>
              <div className="delta" style={{ color: "var(--red)" }}>sequential ECS updates</div>
            </div>
            <div className="statline bad">
              <div className="lbl">Scaling lag</div>
              <div className="val">&gt;8 min</div>
              <div className="delta" style={{ color: "var(--red)" }}>ECS service autoscaling latency</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            ECS&apos;s task placement was cluster-level: you could set CPU/memory reservations per
            task definition, but tasks from different services shared the same EC2 instances with no
            hard isolation guarantees. One memory-leaking service — and we had one — could starve
            neighbors during peak traffic.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p>
            More critically: compliance. Spark Minda&apos;s data handling requirements called for
            service-to-service mTLS. ECS could do this with App Mesh, but the operational complexity
            of App Mesh at 23 services was significant. Linkerd on Kubernetes was a much cleaner
            story.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <p className="muted">
            The decision to migrate was made at the architecture level. My job was to make sure the
            migration didn&apos;t become an incident.
          </p>
        </Reveal>
      </section>

      {/* CHAPTER 02 — THE INVESTIGATION */}
      <section className="chapter" id="investigation">
        <Reveal>
          <div className="chapter-num">CHAPTER 02 — THE PLANNING</div>
          <h2>Map the blast radius before you touch anything.</h2>
        </Reveal>
        <Reveal delay={60}>
          <p>
            The first two weeks weren&apos;t migration. They were documentation. I drew the full
            service dependency graph, identified the critical path (8 services that, if they went
            down, immediately affected end-users), and classified the remaining 15 as auxiliary
            (internal tooling, monitoring, ETL — degraded but not outage).
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="diagram">
            <svg viewBox="0 0 620 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
              <text x="20" y="22" fill="#6B6B6B" fontSize="11" fontFamily="monospace">SERVICE DEPENDENCY LAYERS</text>
              {/* Layer 3 — Infra */}
              <text x="20" y="46" fill="#6B6B6B" fontSize="10" fontFamily="monospace">Layer 1 — infra services (migrate first)</text>
              <rect x="20" y="54" width="90" height="26" rx="4" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.4)" />
              <text x="65" y="71" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">config-svc</text>
              <rect x="120" y="54" width="90" height="26" rx="4" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.4)" />
              <text x="165" y="71" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">auth-svc</text>
              <rect x="220" y="54" width="90" height="26" rx="4" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.4)" />
              <text x="265" y="71" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">event-bus</text>
              <rect x="320" y="54" width="90" height="26" rx="4" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.4)" />
              <text x="365" y="71" textAnchor="middle" fill="#14B8A6" fontSize="10" fontFamily="monospace">notif-svc</text>
              {/* Layer 2 — Business logic */}
              <text x="20" y="104" fill="#6B6B6B" fontSize="10" fontFamily="monospace">Layer 2 — business services (migrate second)</text>
              <rect x="20" y="112" width="90" height="26" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
              <text x="65" y="129" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">plant-api</text>
              <rect x="120" y="112" width="90" height="26" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
              <text x="165" y="129" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">iot-ingest</text>
              <rect x="220" y="112" width="90" height="26" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
              <text x="265" y="129" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">analytics</text>
              <rect x="320" y="112" width="90" height="26" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
              <text x="365" y="129" textAnchor="middle" fill="#FAFAFA" fontSize="10" fontFamily="monospace">report-gen</text>
              <text x="430" y="129" fill="#6B6B6B" fontSize="10" fontFamily="monospace">+ 11 more…</text>
              {/* Layer 1 — API gateways */}
              <text x="20" y="162" fill="#6B6B6B" fontSize="10" fontFamily="monospace">Layer 3 — API gateways (migrate last)</text>
              <rect x="20" y="170" width="130" height="26" rx="4" fill="rgba(230,180,80,0.1)" stroke="rgba(230,180,80,0.3)" />
              <text x="85" y="187" textAnchor="middle" fill="#E6B450" fontSize="10" fontFamily="monospace">public-api-gateway</text>
              <rect x="160" y="170" width="130" height="26" rx="4" fill="rgba(230,180,80,0.1)" stroke="rgba(230,180,80,0.3)" />
              <text x="225" y="187" textAnchor="middle" fill="#E6B450" fontSize="10" fontFamily="monospace">internal-api-gateway</text>
            </svg>
            <div className="diagram-cap">
              Migration order: infra → business services → API gateways. Each layer only migrates after the layer below it is stable.
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            The three services we didn&apos;t migrate in dependency order the first time? They
            became the two near-misses. Lesson noted.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p>
            The core mechanism for zero-downtime was <strong>ALB weighted target groups</strong>.
            AWS Application Load Balancer lets you point a single listener rule at multiple target
            groups with explicit weights. During migration, ECS tasks and EKS pods are both
            registered as separate target groups behind the same ALB:
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="code">
            <div className="code-head">
              <span className="mono">alb-weighted-routing.tf (Terraform excerpt)</span>
            </div>
            <div className="code-body">
              <pre>{`resource "aws_lb_listener_rule" "plant_api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type = "forward"
    forward {
      target_group {
        arn    = aws_lb_target_group.plant_api_ecs.arn
        weight = 95  # ← start here
      }
      target_group {
        arn    = aws_lb_target_group.plant_api_eks.arn
        weight = 5   # ← grow this to 100 over days
      }
    }
  }

  condition {
    path_pattern { values = ["/api/v1/plant/*"] }
  }
}`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            Each service moved from 5% EKS traffic to 100% over 3–5 days, monitored by a CloudWatch
            dashboard comparing error rates, p99 latency, and SQS queue depths between the two
            target groups. If anything diverged, we flipped the weight back to 100% ECS in under 30
            seconds.
          </p>
        </Reveal>
      </section>

      {/* CHAPTER 03 — THE FIX */}
      <section className="chapter" id="fix">
        <Reveal>
          <div className="chapter-num">CHAPTER 03 — THE EXECUTION</div>
          <h2>Helm charts, HPA, and the one service that fought back.</h2>
        </Reveal>
        <Reveal delay={60}>
          <p>
            Every service got a Helm chart. Rather than 23 independent charts, I built a{" "}
            <strong>library chart</strong> — a shared template with the 90% common between services
            (deployment, service, HPA, PodDisruptionBudget, configmap), and per-service{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>values.yaml</span> files for
            the 10% that differed (image, resource limits, replica counts, env vars).
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="code">
            <div className="code-head">
              <span className="mono">charts/plant-api/values.yaml</span>
            </div>
            <div className="code-body">
              <pre>{`image:
  repository: <account>.dkr.ecr.ap-south-1.amazonaws.com/plant-api
  tag: "latest"

resources:
  limits:
    cpu: "500m"
    memory: "512Mi"
  requests:
    cpu: "100m"
    memory: "256Mi"

hpa:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 65

podDisruptionBudget:
  enabled: true
  minAvailable: 1  # never go below 1 pod during rolling update

livenessProbe:
  path: /health/live
  initialDelaySeconds: 15
readinessProbe:
  path: /health/ready
  initialDelaySeconds: 5`}
              </pre>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p>
            <strong>The service that fought back.</strong> The IoT ingestion service received ~8,000
            MQTT events/second from factory floor sensors. During its weighted migration at 50% EKS,
            we noticed the EKS pods had a 2× higher message processing latency than the ECS tasks.
            Same code. Same image.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p>
            Root cause: the EKS cluster used a different VPC subnet than ECS. The IoT broker
            (MSK/Kafka) had security group rules that allowed the ECS subnet but not the EKS subnet.
            Traffic was routing through a NAT gateway instead of the VPC endpoint, adding ~40ms
            round-trip. The fix was a security group rule, not a code change. But the investigation
            took six hours I hadn&apos;t budgeted.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="pull">
            The migration itself was fine. The near-misses were all networking. Always audit
            security group rules against your new subnet ranges before you shift traffic.
            <span className="by">— lesson from week 3</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p>
            <strong>Linkerd.</strong> We injected the Linkerd sidecar at the namespace level,
            meaning every pod in the{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>production</span> namespace
            automatically got the proxy. mTLS between services happened transparently. The compliance
            requirement was satisfied without a single line of application code change.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="code">
            <div className="code-head">
              <span className="mono">namespace annotation (kubectl apply)</span>
            </div>
            <div className="code-body">
              <pre>{`apiVersion: v1
kind: Namespace
metadata:
  name: production
  annotations:
    linkerd.io/inject: enabled  # all pods here get mTLS proxy
    # service-to-service traffic is now mutually authenticated
    # with zero application code changes`}
              </pre>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CHAPTER 04 — THE OUTCOME */}
      <section className="chapter" id="outcome">
        <Reveal>
          <div className="chapter-num">CHAPTER 04 — THE OUTCOME</div>
          <h2>Six weeks. Zero incidents.</h2>
        </Reveal>
        <Reveal delay={60}>
          <ServiceCounter />
        </Reveal>
        <Reveal delay={100}>
          <div className="statlines">
            <div className="statline">
              <div className="lbl">Deploy time</div>
              <div className="val" style={{ color: "var(--accent)" }}>8 min</div>
              <div className="delta">down from 40 min (parallel Helm)</div>
            </div>
            <div className="statline">
              <div className="lbl">Infra cost</div>
              <div className="val" style={{ color: "var(--accent)" }}>−22%</div>
              <div className="delta">spot instances + better packing</div>
            </div>
            <div className="statline">
              <div className="lbl">Memory incidents</div>
              <div className="val" style={{ color: "var(--accent)" }}>0</div>
              <div className="delta">resource limits fixed the hogging</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="muted">
            The memory-hogging service that had been restarting three times a week? Kubernetes
            enforced its memory limit and restarted only that pod, not its neighbors. The problem
            didn&apos;t disappear — the service still had a leak — but it was contained. We fixed
            the leak separately the following sprint. Previously it was masking the symptom with
            scheduled restarts.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p className="muted">
            The CI/CD pipeline update (GitHub Actions → ECR → EKS via Helm) also unlocked parallel
            service deployments. On ECS, rolling updates were sequential to avoid cluster resource
            contention. On EKS with proper resource requests, we deploy all 23 services in parallel.
            A full platform deploy went from 40 minutes to 8.
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
                <div className="t">Write the rollback runbook before the first service moves.</div>
                <div className="d">
                  We wrote ours at the start of week 2, after already migrating two services. That
                  was lucky — we needed it in week 3. A rollback plan should exist before the first
                  traffic shift, not after. 30 seconds to flip weights back only works if you
                  already have the Terraform command ready to run.
                </div>
              </div>
            </div>
            <div className="ref-row">
              <div className="n">02</div>
              <div>
                <div className="t">
                  Audit every security group and VPC endpoint before touching traffic.
                </div>
                <div className="d">
                  The IoT latency issue cost six hours because we hadn&apos;t systematically audited
                  which MSK/RDS/ElastiCache security groups were tied to ECS task subnets. Build a
                  spreadsheet: every downstream dependency, its security group, which subnets it
                  allows. Do this in week 1, not when a service is half-migrated.
                </div>
              </div>
            </div>
            <div className="ref-row">
              <div className="n">03</div>
              <div>
                <div className="t">The library Helm chart was the right call. Do it immediately.</div>
                <div className="d">
                  I built the library chart after the second service and spent two days retrofitting
                  the first two. If I had started with the library pattern — a base chart with
                  overridable values — those two days would have been zero. For any migration
                  involving more than 5 services, template everything from day one.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal delay={60}>
        <div className="cta">
          <Link href="/case-studies/billing">
            <div className="kicker">← previous</div>
            <div className="label">6:00 → 0:11 · a billing job autopsy</div>
            <div className="arrow">↖</div>
          </Link>
          <a href="mailto:rhlbhrdwj3@gmail.com">
            <div className="kicker">get in touch</div>
            <div className="label">Let&apos;s work on your infra.</div>
            <div className="arrow">→</div>
          </a>
        </div>
      </Reveal>
    </article>
  );
}

export default function EKSCaseStudyPage() {
  return (
    <GamificationProvider>
      <ReadingProgress />
      <CaseStudyNav chapterNum="03" chapterLabel="eks migration" />
      <EKSContent />
      <DeepDiverTracker />
      <GamificationUI />
    </GamificationProvider>
  );
}
