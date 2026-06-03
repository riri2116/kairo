/**
 * Mock AI engine — realistic deterministic responses for demo mode.
 * Picks variants based on a simple string hash for natural variety.
 */

// ─── Utilities ────────────────────────────────────────────────────────────────

function strHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(seed: string, arr: T[]): T {
  return arr[strHash(seed) % arr.length];
}

function pickN<T>(seed: string, arr: T[], n: number): T[] {
  const h = strHash(seed);
  const shuffled = [...arr].sort((a, b) => strHash(seed + String(a)) - strHash(seed + String(b)));
  return shuffled.slice(0, Math.min(n, arr.length));
}

function inRange(seed: string, min: number, max: number): number {
  return min + (strHash(seed) % (max - min + 1));
}

// ─── Product Brain ────────────────────────────────────────────────────────────

export type BrainSubmissionType =
  | "PRODUCT_IDEA"
  | "FEATURE_IDEA"
  | "PRICING_CHANGE"
  | "GROWTH_EXPERIMENT";

export interface BrainAnalysisResult {
  impactAnalysis: string;
  riskAssessment: string;
  technicalComplexity: string;
  revenueImpact: string;
  retentionImpact: string;
  recommendation: string;
  confidenceScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

const BRAIN_VARIANTS: Record<BrainSubmissionType, BrainAnalysisResult[]> = {
  PRODUCT_IDEA: [
    {
      impactAnalysis: "This product concept targets an underserved segment with strong pull from early adopters. The combination of AI-assisted workflows and intuitive onboarding creates a compound value proposition that increases both breadth and depth of adoption. Market timing is favorable given the current AI adoption curve, and the TAM is expanding by approximately 28% YoY.",
      riskAssessment: "Primary risk is competitive commoditization within 12–18 months as incumbents ship similar features. Secondary risk is data quality dependency — if the underlying data pipeline is unreliable, AI output degrades rapidly. Regulatory exposure is low for now but warrants a review of data handling practices ahead of any EU expansion.",
      technicalComplexity: "Medium-high complexity. Core infrastructure requires a vector store, an async job queue, and a fine-tuning pipeline. Estimated engineering lift is 3–5 senior engineers over 10–14 weeks for MVP. Key dependencies include third-party LLM APIs (swap risk: moderate) and a reliable data ingestion layer.",
      revenueImpact: "Projected to contribute $180K–$240K ARR within the first 12 months assuming a freemium-to-paid conversion rate of 4–6%. Expansion revenue potential is high — accounts that adopt this feature show 40% higher NRR in comparable products. Payback period estimated at 8–11 months.",
      retentionImpact: "Early cohort data from analogous products shows 22–30 percentage point improvement in D30 retention for users who engage with this feature at least once in their first week. The feature creates a habit loop that drives weekly active usage and reduces voluntary churn by an estimated 18%.",
      recommendation: "GO — but phase the rollout. Launch a private beta with 200 design-partner accounts to validate the core workflow, collect structured feedback, and harden reliability before GA. Prioritize a strong empty-state experience and guided onboarding to drive first-week activation.",
      confidenceScore: 74,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "The idea addresses a genuine workflow pain point validated by multiple user interviews. Adoption will likely be broad but shallow initially — the stickiness depends heavily on the quality of the AI-generated output. Products in adjacent categories have seen 35–50% increase in weekly sessions when this type of feature ships.",
      riskAssessment: "Execution risk is the dominant concern: the feature requires cross-functional alignment between product, ML, and data engineering teams that historically operate on different timelines. There is also hallucination risk in AI output that could erode user trust if not carefully tuned and tested. A robust feedback loop is essential from day one.",
      technicalComplexity: "The underlying ML model can be sourced from an existing API provider, reducing upfront complexity. The hard engineering problems are streaming UX, graceful degradation when the model is slow or unavailable, and prompt versioning. An experienced team can reach a shippable MVP in 8–12 weeks.",
      revenueImpact: "Conservative estimate: $90K–$140K incremental ARR in year one driven primarily by reduced churn and improved upgrade conversion. Mid-case scenario adds $60K in expansion MRR from power users upgrading to access unlimited usage. Net revenue impact becomes material by month 7.",
      retentionImpact: "Users who activate this feature in week 1 show a 15–20pp higher 60-day retention rate. The feature is particularly effective for users who previously dropped off after the initial value discovery moment — it creates a clear reason to return daily.",
      recommendation: "GO with a focused scope. Define a tight v1 that solves one job-to-be-done exceptionally well rather than shipping a broad feature with mediocre quality. Set a clear success metric — e.g. 40% of new users engage with the feature within 7 days — and tie the GA launch decision to that threshold.",
      confidenceScore: 68,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "Strong strategic alignment with the current product direction and existing user mental models. The feature lowers the barrier to value for new users while giving power users a faster path to their most critical workflow. This dual-impact profile is rare and valuable — it simultaneously improves activation and long-term engagement.",
      riskAssessment: "The principal risk is over-engineering: there is a temptation to build a comprehensive system when a focused MVP would generate 80% of the learning at 20% of the cost. There is also a dependency on OpenAI or similar API vendors whose pricing and reliability can fluctuate materially, introducing supply-chain risk.",
      technicalComplexity: "Moderate. A well-scoped v1 can be built by 2–3 engineers in 6–8 weeks using existing API primitives. The complexity escalates significantly if real-time streaming, offline support, or custom model training enters the scope. Recommend starting with synchronous batch processing and optimizing later based on usage patterns.",
      revenueImpact: "This type of feature consistently lifts trial-to-paid conversion by 6–12pp when it's prominently featured in the onboarding sequence. At current funnel volumes, that translates to $120K–$200K of additional closed ARR annually. There is also a PLG upsell vector worth exploring — usage-based pricing on AI credits.",
      retentionImpact: "Expected to reduce 90-day churn by 12–18% by creating a clear continuing value signal. The feature functions as a habit anchor — users who interact with it more than twice in their first two weeks show 3.2× higher LTV in comparable cohort analyses.",
      recommendation: "ITERATE — the core idea is strong but the current scope is too broad for a single sprint. Recommend narrowing to the single highest-value sub-use-case, shipping it with exceptional polish, measuring adoption, and expanding based on observed usage patterns rather than assumptions.",
      confidenceScore: 81,
      riskLevel: "LOW",
    },
  ],
  FEATURE_IDEA: [
    {
      impactAnalysis: "This feature fills a meaningful gap in the current product surface. User research consistently surfaces this as a top-3 friction point, and addressing it would improve task completion rates by an estimated 25–40%. The feature aligns well with the platform's positioning and won't require significant re-architecture.",
      riskAssessment: "Low-to-medium risk overall. The primary concern is scope creep — the feature has natural adjacencies that could balloon scope if not carefully bounded. Secondary risk is the edge-case handling: power users will test boundary conditions aggressively and the feature must degrade gracefully to avoid trust damage.",
      technicalComplexity: "This is a 2–3 week engineering task for a senior developer with good context on the codebase. The main technical debt to address first is the data model, which will need a minor migration. No new infrastructure dependencies required. Recommend adding comprehensive error boundaries and telemetry from the start.",
      revenueImpact: "Indirect revenue impact through retention rather than direct monetization. Improved task completion rates correlate strongly with NPS and renewal intent. At scale, a 25% improvement in completion rates for this workflow translates to 4–7pp improvement in gross retention, worth approximately $80K–$120K ARR preserved annually.",
      retentionImpact: "Users who successfully complete this workflow are 2.8× more likely to renew in year 2. Improving the feature will activate a cohort of stalled users — typically 10–15% of registered accounts — who signed up with this use case in mind but couldn't complete the setup. Re-activating this cohort represents significant incremental value.",
      recommendation: "GO — prioritize this in the next sprint. The effort-to-impact ratio is highly favorable. Suggest shipping an 80% solution quickly and iterating based on instrumented usage data rather than waiting for a 'perfect' implementation.",
      confidenceScore: 83,
      riskLevel: "LOW",
    },
    {
      impactAnalysis: "The feature addresses a real workflow need but may cannibalize usage of adjacent features that currently drive engagement metrics. Net impact is positive but requires careful UX design to ensure it complements rather than replaces the existing flows. User testing with 5–8 participants before shipping is strongly recommended.",
      riskAssessment: "Medium risk driven by UX complexity. The feature introduces a new interaction pattern that users will need to learn, and onboarding for the feature is as important as the feature itself. There is also a moderate A/B testing risk — initial metrics may look flat because the test group needs time to discover and learn the feature.",
      technicalComplexity: "Moderate-to-high. The feature requires changes across multiple layers of the stack — data model, API, and frontend state management. Budget 4–6 weeks for a senior full-stack engineer including code review cycles. Key integration points with the existing notification and activity feed systems need careful attention.",
      revenueImpact: "This feature has meaningful upgrade potential — it is a natural candidate for a Pro-tier exclusive that drives freemium-to-paid conversion. Pricing analysis suggests 8–14% of free tier users would upgrade if this feature were gated. At current conversion economics, that is $140K–$220K of incremental ARR.",
      retentionImpact: "Short-term, the feature may slightly disrupt retention metrics as users adapt to the new pattern. Long-term (90+ days), it is expected to improve D90 retention by 12–18pp by making the product more essential to daily workflows. Monitor the 7-day activation metric closely as an early signal.",
      recommendation: "GO with a phased approach. Ship to 20% of users first, monitor 7-day activation rate as the primary success metric (target: >30% of exposed users engage within 7 days), then roll out fully if the threshold is met within 3 weeks.",
      confidenceScore: 71,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "High-impact feature with broad applicability across user segments. This addresses both the 'getting started' friction for new users and the 'scaling up' friction for power users — a dual-value profile that is uncommon and valuable. The feature is likely to generate strong word-of-mouth if the execution quality is high.",
      riskAssessment: "The main risk is setting incorrect user expectations. If the feature's output quality is variable — even occasionally — it will damage trust disproportionately. Reliability engineering must be prioritized equally with feature development. Plan for a 2-week hardening phase after initial development.",
      technicalComplexity: "Well-defined scope with clear technical requirements. An experienced engineer can implement the backend in 2 weeks and the frontend in 1 week. The main complexity is in the edge cases and error states, which should be designed and tested explicitly. Recommend pair programming for the core logic.",
      revenueImpact: "Direct monetization opportunity through usage-based pricing. Conservative model: $3–8 per user per month in additional revenue from users who exceed a free tier threshold. At 1,000 active users, this generates $36K–$96K ARR. Addressable market expands 3× as the user base grows.",
      retentionImpact: "Expected to improve weekly active usage by 20–30% for the target user segment. The feature creates a daily touchpoint that compounds over time — users who form the habit in week 2 show 40% higher 6-month retention versus those who don't. This is the strongest retention signal in the analysis.",
      recommendation: "GO — this is a well-scoped, high-confidence feature. Prioritize it as the lead item in the next sprint. Success criteria: 35% of active users engage with the feature within 30 days of launch, and D30 retention for adopters is at least 15pp higher than non-adopters.",
      confidenceScore: 87,
      riskLevel: "LOW",
    },
  ],
  PRICING_CHANGE: [
    {
      impactAnalysis: "This pricing change targets the mid-market segment that is currently undermonetized relative to the value they extract from the product. The change aligns price with value delivered and reduces the cognitive load of the buying decision. Comparable SaaS transitions of this type show net-positive ARR impact within 6–9 months.",
      riskAssessment: "Short-term churn risk is real but manageable with a proper grandfather period of 3–6 months for existing customers. The primary risk is a negative PR cycle if the change is perceived as predatory — transparent communication and a clear value narrative are essential. Internal resistance from the sales team (who may lose lower ACV deals) should be proactively addressed.",
      technicalComplexity: "Moderate billing system changes required. If using Stripe, the migration to new price objects requires careful handling of proration, trial periods, and webhook updates. Allow 3–4 weeks for engineering, including testing with edge cases like annual billing, coupons, and enterprise custom contracts.",
      revenueImpact: "Modeled net ARR impact: +$180K–$280K in year 1, with the uplift split roughly 60% from existing account upgrades and 40% from improved new logo conversion. The change reduces discounting pressure significantly, which improves gross margin by 3–5pp. Full ROI realized by month 8 after launch.",
      retentionImpact: "Expect a temporary 5–8% increase in churn in months 1–2 post-announcement. This resolves by month 4 as the value narrative is internalized. Long-term, the cleaner pricing structure improves retention by reducing confusion-driven churn, estimated at 2–4pp improvement in annual gross retention.",
      recommendation: "GO — execute with a 60-day advance notice to existing customers, a clear value communication campaign, and a locked-in grandfather rate for annual plan subscribers. Set a board-level metric: net ARR change at 90 days post-rollout should be ≥ +$50K to validate the hypothesis.",
      confidenceScore: 72,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "This pricing restructuring simplifies the tier architecture from 4 plans to 2, which reduces decision fatigue and improves conversion from free to paid. The consolidation also enables a cleaner upsell path and reduces support ticket volume related to plan confusion. Qualitative research consistently validates customer preference for simpler pricing.",
      riskAssessment: "The primary risk is feature displacement: users currently on the middle tiers may find themselves either over- or under-served by the new structure. Detailed cohort analysis is needed before launch. A 30-day free migration period for affected accounts mitigates churn risk. Risk of gaming (users downgrading during the window) is estimated at 3–5% of affected ARR.",
      technicalComplexity: "High engineering complexity due to legacy entitlement logic spread across the codebase. A full audit of feature flags, API rate limits, and billing webhooks is required before the migration. Estimated 5–7 weeks of engineering time including QA, with a dedicated 2-week freeze on other billing-related changes during the migration window.",
      revenueImpact: "NPV of the pricing change over 24 months is estimated at $320K–$480K driven primarily by ARPU expansion in the consolidated Pro tier. The change reduces annual plan discount depth from an average of 23% to 15%, generating significant margin improvement. New logo ACV is expected to increase by 18–24%.",
      retentionImpact: "Simplified pricing typically reduces involuntary churn (failed payments + confusion cancellations) by 15–20%. The new structure also enables better win-back campaigns as the upgrade path is clearer. Model conservatively projects 3pp improvement in logo retention at 12 months.",
      recommendation: "ITERATE — the direction is right but the migration plan needs more detail before execution. Specifically, define the entitlement mapping for every existing plan permutation, model the exact ARR impact for each cohort, and run a 2-week internal simulation before communicating to customers.",
      confidenceScore: 65,
      riskLevel: "HIGH",
    },
  ],
  GROWTH_EXPERIMENT: [
    {
      impactAnalysis: "This experiment targets the acquisition-to-activation funnel, where the product currently loses approximately 65% of signups before they experience core value. If the hypothesis is correct, it could improve activation rate by 15–25pp, which at current traffic levels would generate 300–500 additional activated users per month.",
      riskAssessment: "A/B testing risk is primarily around statistical power — the experiment needs at least 2,000 users per variant to achieve 80% power at the target effect size. At current traffic, this means a 4–6 week run time before data is actionable. Risk of false positives is elevated if the test is stopped early.",
      technicalComplexity: "Low-to-moderate. The experiment requires implementing a feature flag, writing variant logic for the onboarding flow, and instrumenting activation events in the analytics pipeline. An experienced engineer can ship the infrastructure in 3–5 days. The harder work is defining precise success metrics and ensuring logging is airtight.",
      revenueImpact: "A 20pp improvement in activation rate at current acquisition costs translates to a 20% reduction in effective CAC, worth $40K–$70K in annual marketing efficiency. Additionally, each incremental activated user contributes an average of $340 in first-year revenue, making the total experiment value $102K–$170K at the upper bound of the effect range.",
      retentionImpact: "Activated users show 3.5× higher 30-day retention than users who never reach the activation milestone. Improving activation is one of the highest-leverage retention levers available. If the experiment succeeds, D30 retention for new cohorts could improve by 18–26pp, compounding significantly over 12 months.",
      recommendation: "GO — run this as a rigorous A/B test with pre-registered success criteria. Primary metric: 7-day activation rate. Secondary metrics: D14 retention, first-session duration. Set a minimum run time of 3 weeks regardless of interim results. Automate the winner rollout to reduce cycle time.",
      confidenceScore: 78,
      riskLevel: "LOW",
    },
    {
      impactAnalysis: "The experiment tests a high-leverage hypothesis about referral virality in the core product loop. Viral coefficient improvements are highly non-linear — small improvements in K-factor (e.g. from 0.3 to 0.5) can meaningfully compress CAC and extend organic reach. The product has the right usage pattern to support a referral mechanic if the incentive structure is correctly calibrated.",
      riskAssessment: "Medium-high risk of incentive abuse and gaming, particularly if the reward is monetary. Recommend a non-cash reward (feature credits, extended trial, co-branding opportunity) that has high perceived value to legitimate users but low ROI for gamers. The legal review for referral mechanics must be completed before launch.",
      technicalComplexity: "The referral tracking and attribution system is the hard part — reliable attribution across devices and sessions requires careful implementation. Budget 3–4 weeks for a senior engineer including the attribution logic, reward fulfillment API, fraud detection rules, and analytics instrumentation. Do not underestimate this.",
      revenueImpact: "If K-factor reaches 0.4 (conservative), organic growth supplements paid acquisition by 35–40%, reducing annual marketing spend by $120K–$180K. At K = 0.6 (optimistic), the economics are transformative — CAC drops below $50 for organically acquired users. Even partial success generates strong ROI.",
      retentionImpact: "Referred users typically show 20–35% higher retention than paid acquisition cohorts, driven by social proof and higher intent. The referral mechanic also increases engagement of the referring user — they are more likely to advocate and less likely to churn while their referral is active.",
      recommendation: "GO with careful guardrails. Define explicit fraud detection rules before launch, start with a closed beta of 500 users to stress-test the attribution system, and set a 30-day review point with a clear decision framework for scaling or pausing.",
      confidenceScore: 62,
      riskLevel: "HIGH",
    },
  ],
};

export function mockBrainAnalysis(
  type: BrainSubmissionType,
  title: string,
  input: string
): BrainAnalysisResult {
  const seed = `${type}:${title}:${input}`;
  const variants = BRAIN_VARIANTS[type];
  return pick(seed, variants);
}

// ─── AI Boardroom ─────────────────────────────────────────────────────────────

export interface BoardroomPersona {
  name: string;
  role: string;
  stance: "CHAMPION" | "CAUTIOUS" | "NEUTRAL" | "AGAINST";
  message: string;
}

export interface BoardroomResult {
  summary: string;
  consensus: string;
  transcript: BoardroomPersona[];
  votes: { champion: number; cautious: number; neutral: number; against: number };
}

const PERSONAS = [
  { name: "Alexandra Chen", role: "CEO" },
  { name: "Marcus Reid", role: "CTO" },
  { name: "Priya Sharma", role: "Head of Product" },
  { name: "David Park", role: "CFO" },
  { name: "Sophie Turner", role: "Head of Growth" },
];

const PERSONA_VOICES: Record<string, Record<"CHAMPION"|"CAUTIOUS"|"NEUTRAL"|"AGAINST", string[]>> = {
  CEO: {
    CHAMPION: [
      "This directly supports our Q3 north star metric and I'm fully behind it. The strategic timing is right, the market is ready, and we have the capabilities to execute well. I'd move fast on this.",
      "From a strategic standpoint, this is exactly the kind of differentiated move that creates durable competitive advantage. We should allocate resources to this and treat it as a top-three priority.",
    ],
    CAUTIOUS: [
      "The strategic case is compelling but I want to make sure we're not overextending. We need to sequence this carefully against our existing roadmap commitments and ensure we have the bandwidth to do it well.",
      "I like the direction but I'm concerned about our capacity to execute at the level of quality this deserves. A half-baked version could hurt us more than help. Let's be disciplined about scope.",
    ],
    NEUTRAL: [
      "I see merit in both directions. My instinct is to gather one more round of customer data before committing fully. Can we run a lightweight validation in the next two weeks?",
      "This is a close call for me. The opportunity is real but so is the cost. I'd want to see a more detailed resource plan before making a final call.",
    ],
    AGAINST: [
      "I'm not convinced the timing is right. We have too many things in flight and adding this risks diluting focus on what's already working. I'd table this for next quarter.",
      "The strategic case needs more work. We're solving for a symptom here rather than the root cause. I'd prefer we fix the foundation first.",
    ],
  },
  CTO: {
    CHAMPION: [
      "From a technical standpoint, this is well within our capabilities and we have most of the infrastructure in place. The implementation is straightforward if we scope it correctly. I'm confident the team can ship this in one sprint cycle.",
      "The architecture supports this naturally — we've already built the primitives we'd need. I see this as a 3-week project with low technical debt and good test coverage if we approach it correctly.",
    ],
    CAUTIOUS: [
      "I support the idea but I want to flag that the data migration is more complex than it looks. We'll need to freeze certain parts of the pipeline during the transition and coordinate carefully with the data team.",
      "The technical complexity is medium-high, not low as estimated. We're touching the auth layer, the billing system, and the core data model simultaneously — that's a high-risk combination that needs careful sequencing.",
    ],
    NEUTRAL: [
      "It's technically feasible but the effort estimate is optimistic. I'd add a 40% buffer and ensure we have explicit rollback plans before touching production data.",
      "I can build this, but I'd strongly prefer we resolve the technical debt in the core module first. Building on a shaky foundation increases risk significantly.",
    ],
    AGAINST: [
      "This is not a good time technically. We're mid-migration on the database and adding scope right now would create significant instability. I'd push this to Q4 when we have a cleaner foundation.",
      "I have real concerns about the reliability of this approach at scale. We've seen similar architectures fail under load at other companies I've worked at. We need a proper load test before committing.",
    ],
  },
  "Head of Product": {
    CHAMPION: [
      "Users have been asking for this directly in three consecutive quarterly surveys. The activation data backs it up — this is the single highest-leverage thing we can do to improve the new user experience this quarter.",
      "This solves a genuine, validated user pain point and it fits cleanly into the existing mental model. We don't need to re-educate users — they'll intuitively know what to do with it. I'm fully behind it.",
    ],
    CAUTIOUS: [
      "I love the intent but the proposed UX adds two new screens to the critical onboarding path. Every additional step in onboarding costs us roughly 8% activation. We need to design this more carefully before shipping.",
      "The user research is mixed. Power users want this, but our fastest-growing segment — SMBs — hasn't validated it in interviews. I want to run a concept test with 10 SMB users before we commit.",
    ],
    NEUTRAL: [
      "I see the value but I'm not sure this is the right moment. We just shipped three features in the last sprint and users are still adapting. Adding more surface area before we close the loop on recent launches concerns me.",
      "There are two user stories competing for the same design space here. Until we resolve that conflict, building on top of the ambiguity will create UX debt we'll spend a year untangling.",
    ],
    AGAINST: [
      "The user research doesn't support this investment right now. Our top churned customer reasons are around reliability and speed — not features. I'd redirect this effort to fixing P1 bugs before shipping new capability.",
      "This is a solution in search of a problem. Our best users don't need this, and our struggling users need better onboarding, not more features. I vote to pause.",
    ],
  },
  CFO: {
    CHAMPION: [
      "The unit economics are compelling. The LTV uplift from improved retention more than justifies the engineering cost within two quarters. I've modeled three scenarios and all three are positive. Let's do it.",
      "At the estimated ARR impact, the payback period is under 6 months even with conservative assumptions. This easily clears our investment threshold and I support prioritizing it.",
    ],
    CAUTIOUS: [
      "The revenue model has a lot of assumptions baked in. I'd want to stress-test the conversion rate assumptions in particular — if they're 30% lower than projected, the payback period stretches to 14 months, which changes the calculus.",
      "I'm supportive in principle, but I want to make sure we're not adding headcount cost that won't be offset by the revenue for 18+ months. Can we get a more detailed build-or-buy analysis?",
    ],
    NEUTRAL: [
      "Financially, this is roughly breakeven on an 18-month horizon with significant variance. I wouldn't block it but I also wouldn't allocate additional resources to it beyond what's already budgeted.",
      "The numbers work but just barely. If we're going to do this, we should find a way to reduce the upfront engineering investment by 20–30% to improve the risk-adjusted return.",
    ],
    AGAINST: [
      "I can't support this at the current estimated cost. The revenue projection relies on assumptions that are 2–3 standard deviations more optimistic than our historical actuals. I'd need to see a revised, more conservative model before approving the budget.",
      "Our burn is elevated right now and I'm not comfortable approving discretionary spend on this when we have higher-ROI initiatives in the queue. Let's revisit next quarter when the cash position is stronger.",
    ],
  },
  "Head of Growth": {
    CHAMPION: [
      "This is a PLG motion I've been pushing for two quarters. The virality coefficient on this type of feature is well-documented and I have comps from three similar products that show 30–50% organic growth acceleration. Let's ship it.",
      "From a growth perspective, this fills the biggest gap in our funnel. The activation-to-expansion rate would improve significantly and that's where we're most under-indexed compared to benchmarks. Full support.",
    ],
    CAUTIOUS: [
      "I love the growth potential but we need to instrument this properly before launch or we'll be flying blind. I've seen too many growth experiments fail because we couldn't measure what was working. Analytics-first, then launch.",
      "The channel economics need more scrutiny. We're assuming a certain organic amplification effect but if it doesn't materialize, the paid CAC implications are significant. I'd run a 2-week closed beta first.",
    ],
    NEUTRAL: [
      "Growth-wise, this is a long-term bet. The impact won't show up in the next 90 days — it's a 6-month compound effect. That's fine, but leadership needs to be aligned on the timeline before we commit resources.",
      "I've seen this work in some markets and not in others. Our segment is a bit different from the comps I usually cite. Let's validate the assumption that our users have the right sharing behaviors before building the whole system.",
    ],
    AGAINST: [
      "The viral loop hypothesis doesn't hold up when I look at our user behavior data. Our users are in a professional context where sharing like this just doesn't happen at the rates the model assumes. We'd be building infrastructure for a growth channel that won't perform.",
      "We have three higher-confidence growth levers we haven't fully exploited yet. I'd prioritize those before investing in something with this much uncertainty in the activation model.",
    ],
  },
};

const STANCES: Array<"CHAMPION" | "CAUTIOUS" | "NEUTRAL" | "AGAINST"> = [
  "CHAMPION", "CAUTIOUS", "NEUTRAL", "AGAINST",
];

const CONSENSUS_TEMPLATES = [
  "Proceed with a focused MVP. Define tight success criteria before the full rollout.",
  "Greenlight with conditions. Requires a pilot program and explicit go/no-go review at 30 days.",
  "Approved for a time-boxed experiment. Ship to 20% of users and evaluate primary metrics in 3 weeks.",
  "Move forward but reduce initial scope by 40%. Re-evaluate expansion after hitting initial adoption target.",
  "Defer 6 weeks and address open risks first. Reconvene with a revised resource plan and updated user research.",
  "No consensus. Requires additional user data and a revised financial model before a second vote.",
];

const SUMMARY_TEMPLATES = [
  "The boardroom reached a split decision after substantive debate across strategic, financial, and user-centric perspectives. The majority position favors a cautious forward motion with explicit guardrails.",
  "After reviewing the strategic fit, technical feasibility, and financial projections, the board reached a conditional approval with specific milestones required for continued investment.",
  "The board surfaced significant disagreement on timing and resource allocation. A modified proposal with reduced scope received broader support and is the recommended path forward.",
  "Strong consensus emerged around the core value proposition, with productive debate on execution approach. The board aligned on a phased rollout with clear stage-gate criteria.",
];

export function mockBoardroomSession(topic: string, question: string): BoardroomResult {
  const seed = `${topic}:${question}`;

  // Assign stances to personas using deterministic selection
  const assignments: Array<{ persona: typeof PERSONAS[0]; stance: typeof STANCES[0] }> = PERSONAS.map((p, i) => {
    const pSeed = `${seed}:${p.name}:${i}`;
    const stanceWeights = [2, 2, 1, 1]; // champion, cautious, neutral, against
    const weightedStances: typeof STANCES[0][] = [];
    STANCES.forEach((s, si) => { for (let w = 0; w < stanceWeights[si]; w++) weightedStances.push(s); });
    return { persona: p, stance: pick(pSeed, weightedStances) };
  });

  const transcript: BoardroomPersona[] = assignments.map(({ persona, stance }) => {
    const voicePool = PERSONA_VOICES[persona.role]?.[stance] ?? ["I support moving this initiative forward based on the available evidence."];
    return {
      name: persona.name,
      role: persona.role,
      stance,
      message: pick(`${seed}:${persona.name}:message`, voicePool),
    };
  });

  const votes = transcript.reduce(
    (acc, p) => {
      const key = p.stance.toLowerCase() as keyof typeof acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    { champion: 0, cautious: 0, neutral: 0, against: 0 }
  );

  return {
    summary: pick(seed + ":summary", SUMMARY_TEMPLATES),
    consensus: pick(seed + ":consensus", CONSENSUS_TEMPLATES),
    transcript,
    votes,
  };
}

// ─── Competitor Intelligence ──────────────────────────────────────────────────

export interface CompetitorResult {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  score: number;
}

const STRENGTH_POOL = [
  "Large, established user base with strong network effects and high switching costs",
  "Best-in-class mobile experience with 4.8★ App Store rating across 200K+ reviews",
  "Deep enterprise integrations (Salesforce, Jira, Slack) that make removal expensive",
  "Aggressive freemium funnel driving viral top-of-funnel growth at near-zero CAC",
  "Strong brand recognition in the category with >60% unaided awareness in target segment",
  "Highly active developer community with 1,200+ public API integrations",
  "Significant R&D investment in AI capabilities — filed 14 patents in the last 18 months",
  "Strong PLG motion with product-qualified lead conversion rate of ~8%",
  "Robust offline functionality with conflict-free sync — a major differentiator for field teams",
  "Competitive pricing with transparent tier structure that minimizes sales friction",
];

const WEAKNESS_POOL = [
  "Dated UI last significantly redesigned in 2019 — increasingly losing deals to modern alternatives",
  "Weak mobile application — rated 2.9★ on Android with frequent crash reports in recent reviews",
  "Slow product velocity with major releases shipping only twice per year",
  "Complex pricing with 6 tiers creates significant confusion and extends the sales cycle",
  "No native AI capabilities — relies entirely on third-party integrations that are unreliable",
  "Customer support rated poorly with median first response time exceeding 48 hours",
  "Data export functionality is intentionally limited, creating compliance issues for enterprise prospects",
  "Onboarding requires significant professional services investment — average time-to-value is 6+ weeks",
  "High churn in the SMB segment (>30% annual) indicating poor product-market fit outside enterprise",
  "Security posture lacks SOC2 Type II certification, blocking deals with financial services companies",
];

const OPPORTUNITY_POOL = [
  "Expand into adjacent workflow areas (e.g. analytics, reporting) where users currently switch to other tools",
  "International expansion — less than 15% of revenue is non-English-speaking markets despite strong global demand signals",
  "API-first strategy could unlock a developer ecosystem and platform revenue stream worth 2–3× current ARR",
  "AI native rebuild of the core product surface — the window to lead this transition is 12–18 months",
  "Partner channel is underdeveloped — only 12 active resellers vs. competitors with 200+ partner ecosystems",
  "Vertical-specific editions (healthcare, legal, education) could command significant premium pricing",
  "Usage-based pricing model would better align price to value and remove the expansion revenue ceiling",
];

const THREAT_POOL = [
  "Well-funded new entrant raised $45M Series B last quarter and is directly targeting the same ICP",
  "Platform risk: deep dependency on a single cloud provider whose pricing has increased 3× in 24 months",
  "AI-native competitors are redefining category expectations in ways that make the current product feel legacy",
  "Regulatory changes in the EU (specifically the AI Act) could require significant compliance investment by 2025",
  "Key enterprise customers are consolidating vendors — the trend toward platform buying reduces standalone tool renewal",
  "Open-source alternative gaining traction in the developer community could erode the prosumer and SMB segment",
];

export function mockCompetitorAnalysis(name: string, url?: string): CompetitorResult {
  const seed = `${name}:${url ?? ""}`;
  const score = inRange(seed + ":score", 38, 84);
  return {
    strengths:    pickN(seed + ":s", STRENGTH_POOL, inRange(seed + ":sc", 3, 5)),
    weaknesses:   pickN(seed + ":w", WEAKNESS_POOL, inRange(seed + ":wc", 3, 4)),
    opportunities: pickN(seed + ":o", OPPORTUNITY_POOL, inRange(seed + ":oc", 3, 4)),
    threats:      pickN(seed + ":t", THREAT_POOL, inRange(seed + ":tc", 2, 3)),
    score,
  };
}

// ─── Feature Sandbox ──────────────────────────────────────────────────────────

export interface SandboxResult {
  retentionImpact: number;
  revenueImpact: number;
  engagementImpact: number;
  effortEstimateDays: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  parameters: {
    targetSegment: string;
    adoptionRate: number;
    timeToValue: string;
    confidenceInterval: string;
  };
  results: {
    projectedDAU: string;
    projectedMRR: string;
    breakEvenWeeks: number;
    successProbability: number;
  };
}

const SANDBOX_SUMMARIES = [
  "Model converges on moderate positive impact with meaningful uncertainty in the adoption rate assumption. The retention signal is the most confident estimate; revenue impact has wider confidence intervals.",
  "Strong positive signal across all three impact dimensions. The engagement improvement is particularly notable and likely to compound over time as the feature becomes part of the daily workflow.",
  "Mixed signal. The retention impact is positive but the engineering effort estimate suggests a poor effort-to-impact ratio versus alternatives currently in the queue. Recommend a lean experiment first.",
  "Simulation indicates high-confidence retention and engagement lift with moderate revenue impact. The critical variable is time-to-activation — if users don't engage with the feature in their first week, the modeled impact doesn't materialize.",
  "The model shows above-average impact with below-average implementation risk. This is a favorable combination. The main uncertainty is market timing — the window for differentiation may be 6–9 months before competitors ship similar capabilities.",
];

const TARGET_SEGMENTS = ["New users (0–30 days)", "Power users (>10 sessions/month)", "SMB accounts", "Enterprise teams", "Churned users (win-back)", "Mobile-first users"];
const TIME_TO_VALUE = ["3–5 days", "1–2 weeks", "Same session", "2–4 weeks", "First session"];
const CI_TEMPLATES = ["±6.2pp at 90% confidence", "±4.8pp at 85% confidence", "±9.1pp at 80% confidence", "±3.4pp at 95% confidence"];

export function mockFeatureSandbox(featureName: string, description?: string): SandboxResult {
  const seed = `${featureName}:${description ?? ""}`;
  const retention   = inRange(seed + ":ret", 6, 34);
  const revenue     = inRange(seed + ":rev", 4, 28);
  const engagement  = inRange(seed + ":eng", 9, 46);
  const effort      = inRange(seed + ":eff", 7, 56);
  const riskOptions: Array<"LOW" | "MEDIUM" | "HIGH"> = ["LOW", "LOW", "MEDIUM", "MEDIUM", "HIGH"];
  const riskLevel   = pick(seed + ":risk", riskOptions);
  const adoption    = inRange(seed + ":adopt", 22, 68);

  return {
    retentionImpact:    retention,
    revenueImpact:      revenue,
    engagementImpact:   engagement,
    effortEstimateDays: effort,
    riskLevel,
    summary: pick(seed + ":sum", SANDBOX_SUMMARIES),
    parameters: {
      targetSegment:      pick(seed + ":seg",  TARGET_SEGMENTS),
      adoptionRate:       adoption,
      timeToValue:        pick(seed + ":ttv",  TIME_TO_VALUE),
      confidenceInterval: pick(seed + ":ci",   CI_TEMPLATES),
    },
    results: {
      projectedDAU:        `+${inRange(seed + ":dau", 8, 32)}%`,
      projectedMRR:        `+$${(inRange(seed + ":mrr", 4, 22) * 1000).toLocaleString()}`,
      breakEvenWeeks:      inRange(seed + ":bew", 6, 24),
      successProbability:  inRange(seed + ":sp",  55, 89),
    },
  };
}
