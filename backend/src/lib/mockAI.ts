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
      impactAnalysis: "This product concept targets an underserved segment with strong pull from early adopters in tier-1 and tier-2 Indian markets. The combination of vernacular-first workflows and intuitive onboarding creates a compound value proposition that increases both breadth and depth of adoption. Market timing is favourable given the current expansion of internet users beyond metros, and the TAM is expanding by approximately 28% year-on-year.",
      riskAssessment: "Primary risk is competitive commoditisation within 12–18 months as incumbents ship similar features. Secondary risk is data quality dependency — if the underlying data pipeline is unreliable, AI output degrades rapidly. Regulatory exposure is low for now but warrants a review of data handling practices ahead of any compliance review under India's DPDP Act.",
      technicalComplexity: "Medium-high complexity. Core infrastructure requires a vector store, an async job queue, and a fine-tuning pipeline. Estimated engineering lift is 3–5 senior engineers over 10–14 weeks for MVP. Key dependencies include third-party LLM APIs (swap risk: moderate) and a reliable data ingestion layer.",
      revenueImpact: "Projected to contribute ₹1.5 Cr–₹2 Cr ARR within the first 12 months assuming a freemium-to-paid conversion rate of 4–6%. Expansion revenue potential is high — accounts that adopt this feature show 40% higher NRR in comparable Indian SaaS products. Payback period estimated at 8–11 months.",
      retentionImpact: "Early cohort data from analogous products shows 22–30 percentage point improvement in D30 retention for users who engage with this feature at least once in their first week. The feature creates a habit loop that drives weekly active usage and reduces voluntary churn by an estimated 18%.",
      recommendation: "GO — but phase the rollout. Launch a private beta with 200 design-partner accounts to validate the core workflow, collect structured feedback, and harden reliability before GA. Prioritise a strong empty-state experience and guided onboarding to drive first-week activation.",
      confidenceScore: 74,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "The idea addresses a genuine workflow pain point validated by multiple user interviews across Bengaluru, Mumbai, and Hyderabad teams. Adoption will likely be broad but shallow initially — the stickiness depends heavily on the quality of the AI-generated output. Products in adjacent categories have seen 35–50% increase in weekly sessions when this type of feature ships.",
      riskAssessment: "Execution risk is the dominant concern: the feature requires cross-functional alignment between product, ML, and data engineering teams that historically operate on different timelines. There is also hallucination risk in AI output that could erode user trust if not carefully tuned and tested. A robust feedback loop is essential from day one.",
      technicalComplexity: "The underlying ML model can be sourced from an existing API provider, reducing upfront complexity. The hard engineering problems are streaming UX, graceful degradation when the model is slow or unavailable, and prompt versioning. An experienced team can reach a shippable MVP in 8–12 weeks.",
      revenueImpact: "Conservative estimate: ₹75 Lakh–₹1.2 Cr incremental ARR in year one driven primarily by reduced churn and improved upgrade conversion. Mid-case scenario adds ₹50 Lakh in expansion MRR from power users upgrading to access unlimited usage. Net revenue impact becomes material by month 7.",
      retentionImpact: "Users who activate this feature in week 1 show a 15–20pp higher 60-day retention rate. The feature is particularly effective for users who previously dropped off after the initial value discovery moment — it creates a clear reason to return daily.",
      recommendation: "GO with a focused scope. Define a tight v1 that solves one job-to-be-done exceptionally well rather than shipping a broad feature with mediocre quality. Set a clear success metric — e.g. 40% of new users engage with the feature within 7 days — and tie the GA launch decision to that threshold.",
      confidenceScore: 68,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "Strong strategic alignment with the current product direction and existing user mental models — particularly for the Indian SME and startup segments. The feature lowers the barrier to value for new users while giving power users a faster path to their most critical workflow. This dual-impact profile is rare and valuable — it simultaneously improves activation and long-term engagement.",
      riskAssessment: "The principal risk is over-engineering: there is a temptation to build a comprehensive system when a focused MVP would generate 80% of the learning at 20% of the cost. There is also a dependency on LLM API vendors whose pricing and reliability can fluctuate materially, introducing supply-chain risk for Indian pricing in rupee terms.",
      technicalComplexity: "Moderate. A well-scoped v1 can be built by 2–3 engineers in 6–8 weeks using existing API primitives. The complexity escalates significantly if real-time streaming, offline support, or custom model training enters the scope. Recommend starting with synchronous batch processing and optimising later based on usage patterns.",
      revenueImpact: "This type of feature consistently lifts trial-to-paid conversion by 6–12pp when prominently featured in the onboarding sequence. At current funnel volumes, that translates to ₹1 Cr–₹1.6 Cr of additional closed ARR annually. There is also a PLG upsell vector worth exploring — usage-based pricing on AI credits.",
      retentionImpact: "Expected to reduce 90-day churn by 12–18% by creating a clear continuing value signal. The feature functions as a habit anchor — users who interact with it more than twice in their first two weeks show 3.2× higher LTV in comparable cohort analyses.",
      recommendation: "ITERATE — the core idea is strong but the current scope is too broad for a single sprint. Recommend narrowing to the single highest-value sub-use-case, shipping it with exceptional polish, measuring adoption, and expanding based on observed usage patterns rather than assumptions.",
      confidenceScore: 81,
      riskLevel: "LOW",
    },
  ],
  FEATURE_IDEA: [
    {
      impactAnalysis: "This feature fills a meaningful gap in the current product surface. User research across Indian product teams consistently surfaces this as a top-3 friction point, and addressing it would improve task completion rates by an estimated 25–40%. The feature aligns well with the platform's positioning and won't require significant re-architecture.",
      riskAssessment: "Low-to-medium risk overall. The primary concern is scope creep — the feature has natural adjacencies that could balloon scope if not carefully bounded. Secondary risk is the edge-case handling: power users will test boundary conditions aggressively and the feature must degrade gracefully to avoid trust damage.",
      technicalComplexity: "This is a 2–3 week engineering task for a senior developer with good context on the codebase. The main technical debt to address first is the data model, which will need a minor migration. No new infrastructure dependencies required. Recommend adding comprehensive error boundaries and telemetry from the start.",
      revenueImpact: "Indirect revenue impact through retention rather than direct monetisation. Improved task completion rates correlate strongly with NPS and renewal intent. At scale, a 25% improvement in completion rates for this workflow translates to 4–7pp improvement in gross retention, worth approximately ₹65 Lakh–₹1 Cr ARR preserved annually.",
      retentionImpact: "Users who successfully complete this workflow are 2.8× more likely to renew in year 2. Improving the feature will activate a cohort of stalled users — typically 10–15% of registered accounts — who signed up with this use case in mind but couldn't complete the setup. Re-activating this cohort represents significant incremental value.",
      recommendation: "GO — prioritise this in the next sprint. The effort-to-impact ratio is highly favourable. Suggest shipping an 80% solution quickly and iterating based on instrumented usage data rather than waiting for a 'perfect' implementation.",
      confidenceScore: 83,
      riskLevel: "LOW",
    },
    {
      impactAnalysis: "The feature addresses a real workflow need but may cannibalize usage of adjacent features that currently drive engagement metrics. Net impact is positive but requires careful UX design to ensure it complements rather than replaces the existing flows. User testing with 5–8 participants before shipping is strongly recommended.",
      riskAssessment: "Medium risk driven by UX complexity. The feature introduces a new interaction pattern that users will need to learn, and onboarding for the feature is as important as the feature itself. There is also a moderate A/B testing risk — initial metrics may look flat because the test group needs time to discover and learn the feature.",
      technicalComplexity: "Moderate-to-high. The feature requires changes across multiple layers of the stack — data model, API, and frontend state management. Budget 4–6 weeks for a senior full-stack engineer including code review cycles. Key integration points with the existing notification and activity feed systems need careful attention.",
      revenueImpact: "This feature has meaningful upgrade potential — it is a natural candidate for a Pro-tier exclusive that drives freemium-to-paid conversion. Pricing analysis suggests 8–14% of free tier users would upgrade if this feature were gated. At current conversion economics, that is ₹1.2 Cr–₹1.8 Cr of incremental ARR.",
      retentionImpact: "Short-term, the feature may slightly disrupt retention metrics as users adapt to the new pattern. Long-term (90+ days), it is expected to improve D90 retention by 12–18pp by making the product more essential to daily workflows. Monitor the 7-day activation metric closely as an early signal.",
      recommendation: "GO with a phased approach. Ship to 20% of users first, monitor 7-day activation rate as the primary success metric (target: >30% of exposed users engage within 7 days), then roll out fully if the threshold is met within 3 weeks.",
      confidenceScore: 71,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "High-impact feature with broad applicability across user segments — particularly relevant for Indian product teams managing multiple stakeholders across time zones and languages. This addresses both the 'getting started' friction for new users and the 'scaling up' friction for power users. The feature is likely to generate strong word-of-mouth if the execution quality is high.",
      riskAssessment: "The main risk is setting incorrect user expectations. If the feature's output quality is variable — even occasionally — it will damage trust disproportionately. Reliability engineering must be prioritised equally with feature development. Plan for a 2-week hardening phase after initial development.",
      technicalComplexity: "Well-defined scope with clear technical requirements. An experienced engineer can implement the backend in 2 weeks and the frontend in 1 week. The main complexity is in the edge cases and error states, which should be designed and tested explicitly. Recommend pair programming for the core logic.",
      revenueImpact: "Direct monetisation opportunity through usage-based pricing. Conservative model: ₹250–₹650 per user per month in additional revenue from users who exceed a free tier threshold. At 1,000 active users, this generates ₹30 Lakh–₹78 Lakh ARR. Addressable market expands 3× as the user base grows.",
      retentionImpact: "Expected to improve weekly active usage by 20–30% for the target user segment. The feature creates a daily touchpoint that compounds over time — users who form the habit in week 2 show 40% higher 6-month retention versus those who don't. This is the strongest retention signal in the analysis.",
      recommendation: "GO — this is a well-scoped, high-confidence feature. Prioritise it as the lead item in the next sprint. Success criteria: 35% of active users engage with the feature within 30 days of launch, and D30 retention for adopters is at least 15pp higher than non-adopters.",
      confidenceScore: 87,
      riskLevel: "LOW",
    },
  ],
  PRICING_CHANGE: [
    {
      impactAnalysis: "This pricing change targets the mid-market Indian SaaS segment that is currently undermonetised relative to the value they extract from the product. The change aligns price with value delivered and reduces the cognitive load of the buying decision. Comparable Indian SaaS transitions of this type show net-positive ARR impact within 6–9 months.",
      riskAssessment: "Short-term churn risk is real but manageable with a proper grandfather period of 3–6 months for existing customers. The primary risk is a negative PR cycle if the change is perceived as predatory — transparent communication and a clear value narrative are essential. Internal resistance from the sales team (who may lose lower ACV deals) should be proactively addressed.",
      technicalComplexity: "Moderate billing system changes required. If using Razorpay or Chargebee, the migration to new price objects requires careful handling of proration, trial periods, and webhook updates. Allow 3–4 weeks for engineering, including testing with edge cases like annual billing, coupons, and enterprise custom contracts.",
      revenueImpact: "Modelled net ARR impact: ₹1.5 Cr–₹2.3 Cr in year 1, with the uplift split roughly 60% from existing account upgrades and 40% from improved new logo conversion. The change reduces discounting pressure significantly, which improves gross margin by 3–5pp. Full ROI realised by month 8 after launch.",
      retentionImpact: "Expect a temporary 5–8% increase in churn in months 1–2 post-announcement. This resolves by month 4 as the value narrative is internalized. Long-term, the cleaner pricing structure improves retention by reducing confusion-driven churn, estimated at 2–4pp improvement in annual gross retention.",
      recommendation: "GO — execute with a 60-day advance notice to existing customers, a clear value communication campaign, and a locked-in grandfather rate for annual plan subscribers. Set a board-level metric: net ARR change at 90 days post-rollout should be ≥ ₹42 Lakh to validate the hypothesis.",
      confidenceScore: 72,
      riskLevel: "MEDIUM",
    },
    {
      impactAnalysis: "This pricing restructuring simplifies the tier architecture from 4 plans to 2, which reduces decision fatigue and improves conversion from free to paid — particularly for the Indian SME buyer who is already unfamiliar with SaaS subscription models. The consolidation also enables a cleaner upsell path and reduces support ticket volume related to plan confusion.",
      riskAssessment: "The primary risk is feature displacement: users currently on the middle tiers may find themselves either over- or under-served by the new structure. Detailed cohort analysis is needed before launch. A 30-day free migration period for affected accounts mitigates churn risk. Risk of gaming (users downgrading during the window) is estimated at 3–5% of affected ARR.",
      technicalComplexity: "High engineering complexity due to legacy entitlement logic spread across the codebase. A full audit of feature flags, API rate limits, and billing webhooks is required before the migration. Estimated 5–7 weeks of engineering time including QA, with a dedicated 2-week freeze on other billing-related changes during the migration window.",
      revenueImpact: "NPV of the pricing change over 24 months is estimated at ₹2.7 Cr–₹4 Cr driven primarily by ARPU expansion in the consolidated Pro tier. The change reduces annual plan discount depth from an average of 23% to 15%, generating significant margin improvement. New logo ACV is expected to increase by 18–24%.",
      retentionImpact: "Simplified pricing typically reduces involuntary churn (failed payments + confusion cancellations) by 15–20%. The new structure also enables better win-back campaigns as the upgrade path is clearer. Model conservatively projects 3pp improvement in logo retention at 12 months.",
      recommendation: "ITERATE — the direction is right but the migration plan needs more detail before execution. Specifically, define the entitlement mapping for every existing plan permutation, model the exact ARR impact for each cohort, and run a 2-week internal simulation before communicating to customers.",
      confidenceScore: 65,
      riskLevel: "HIGH",
    },
  ],
  GROWTH_EXPERIMENT: [
    {
      impactAnalysis: "This experiment targets the acquisition-to-activation funnel, where the product currently loses approximately 65% of signups before they experience core value. If the hypothesis is correct, it could improve activation rate by 15–25pp, which at current traffic levels would generate 300–500 additional activated users per month across tier-1 and tier-2 Indian cities.",
      riskAssessment: "A/B testing risk is primarily around statistical power — the experiment needs at least 2,000 users per variant to achieve 80% power at the target effect size. At current traffic, this means a 4–6 week run time before data is actionable. Risk of false positives is elevated if the test is stopped early.",
      technicalComplexity: "Low-to-moderate. The experiment requires implementing a feature flag, writing variant logic for the onboarding flow, and instrumenting activation events in the analytics pipeline. An experienced engineer can ship the infrastructure in 3–5 days. The harder work is defining precise success metrics and ensuring logging is airtight.",
      revenueImpact: "A 20pp improvement in activation rate at current acquisition costs translates to a 20% reduction in effective CAC, worth ₹33 Lakh–₹58 Lakh in annual marketing efficiency. Additionally, each incremental activated user contributes an average of ₹28,000 in first-year revenue, making the total experiment value ₹84 Lakh–₹1.4 Cr at the upper bound of the effect range.",
      retentionImpact: "Activated users show 3.5× higher 30-day retention than users who never reach the activation milestone. Improving activation is one of the highest-leverage retention levers available. If the experiment succeeds, D30 retention for new cohorts could improve by 18–26pp, compounding significantly over 12 months.",
      recommendation: "GO — run this as a rigorous A/B test with pre-registered success criteria. Primary metric: 7-day activation rate. Secondary metrics: D14 retention, first-session duration. Set a minimum run time of 3 weeks regardless of interim results. Automate the winner rollout to reduce cycle time.",
      confidenceScore: 78,
      riskLevel: "LOW",
    },
    {
      impactAnalysis: "The experiment tests a high-leverage hypothesis about referral virality in the core product loop. Viral coefficient improvements are highly non-linear — small improvements in K-factor (e.g. from 0.3 to 0.5) can meaningfully compress CAC and extend organic reach. The product has the right usage pattern to support a referral mechanic if the incentive structure is correctly calibrated for the Indian market.",
      riskAssessment: "Medium-high risk of incentive abuse and gaming, particularly if the reward is monetary. Recommend a non-cash reward (feature credits, extended trial, co-branding opportunity) that has high perceived value to legitimate users but low ROI for gamers. Legal review for referral mechanics must be completed given RBI guidelines on incentive-based referrals in fintech contexts.",
      technicalComplexity: "The referral tracking and attribution system is the hard part — reliable attribution across devices and sessions requires careful implementation. Budget 3–4 weeks for a senior engineer including the attribution logic, reward fulfillment API, fraud detection rules, and analytics instrumentation. Do not underestimate this.",
      revenueImpact: "If K-factor reaches 0.4 (conservative), organic growth supplements paid acquisition by 35–40%, reducing annual marketing spend by ₹1 Cr–₹1.5 Cr. At K = 0.6 (optimistic), the economics are transformative — CAC drops below ₹4,000 for organically acquired users. Even partial success generates strong ROI.",
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
  { name: "Anjali Sharma", role: "CEO" },
  { name: "Vikram Nair", role: "CTO" },
  { name: "Priya Iyer", role: "Head of Product" },
  { name: "Rohit Gupta", role: "CFO" },
  { name: "Neha Kapoor", role: "Head of Growth" },
];

const PERSONA_VOICES: Record<string, Record<"CHAMPION"|"CAUTIOUS"|"NEUTRAL"|"AGAINST", string[]>> = {
  CEO: {
    CHAMPION: [
      "This directly supports our Q3 north star metric and I'm fully behind it. The strategic timing is right, the market is ready, and we have the capabilities to execute well. I'd move fast on this.",
      "From a strategic standpoint, this is exactly the kind of differentiated move that creates durable competitive advantage in the Indian market. We should allocate resources and treat this as a top-three priority.",
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
      "From a pure engineering standpoint, I can build either version. The question is really a product and business decision. What I can say is the estimated timelines are achievable if scope is locked before we start.",
      "The technical risks are manageable either way. I'd recommend we prototype the hardest piece first — a 2-day spike would tell us definitively whether our assumptions hold.",
    ],
    AGAINST: [
      "I have serious concerns about the technical feasibility within the proposed timeline. We have three engineers on leave next month and two critical bug fixes that have to ship first. I'd push this to Q3.",
      "The proposed implementation conflicts with the infrastructure migration we're already mid-way through. Attempting both simultaneously creates significant risk of production instability.",
    ],
  },
  "Head of Product": {
    CHAMPION: [
      "Every user research session in the last two quarters has surfaced this as a top-3 pain point. We have a clear signal. The question isn't whether to build it — it's how quickly we can get a high-quality version in front of users.",
      "This directly addresses the activation drop-off we've been tracking since launch. I've been advocating for this for two quarters. I'm fully behind it and ready to define the spec this week.",
    ],
    CAUTIOUS: [
      "The user need is real, but I want to make sure we're solving it the right way. The first three solutions that come to mind are probably not the right ones. I'd want to run one more round of discovery before we commit to a direction.",
      "I support building this, but I'm worried about the edge cases we haven't designed for yet. The core happy path is simple — but 30% of our users are going to hit an edge case in month one and we need to be ready.",
    ],
    NEUTRAL: [
      "I see the user need clearly. My uncertainty is around prioritisation — there are two other features with equally strong user signal that we've been deprioritising. I want to make sure we're making this trade-off explicitly.",
      "Directionally yes, but I think the framing needs more work before we build. The way we've described the problem conflates two distinct user needs that might need two different solutions.",
    ],
    AGAINST: [
      "I've looked at the user research carefully and I'm not convinced this solves the actual problem. What users say they want and what would actually change their behaviour are different things. I'd want to test the assumption before we build.",
      "This feels like a solution in search of a problem. The support tickets we're seeing are a symptom — the root cause is an onboarding gap that we should fix first. Building this feature on top of a broken foundation won't work.",
    ],
  },
  CFO: {
    CHAMPION: [
      "The unit economics are compelling. The payback period is under 6 months at conservative estimates and the ARR contribution is meaningful at our current scale. I'm supportive — this is a good use of engineering resources.",
      "From a financial standpoint, the risk-adjusted return on this investment is strong. Even in the downside scenario, the cost is contained and the upside is significant. I'd prioritise this.",
    ],
    CAUTIOUS: [
      "The revenue model assumptions need more stress-testing before I'm fully comfortable. The conversion rate estimate looks optimistic based on our historical cohort data. I'd want to model a downside scenario at 60% of the projected conversion.",
      "I support the investment but I want tighter financial controls around it — a clear spend envelope and a 60-day checkpoint where we evaluate whether the leading indicators are trending in the right direction before we continue.",
    ],
    NEUTRAL: [
      "The financial case is reasonable but not overwhelming. This is a bet on user behaviour change, which is hard to underwrite. I'd want to see a smaller proof-of-concept that validates the core assumption before we commit the full investment.",
      "From a pure ROI standpoint this is marginal at current projections. I'd be more comfortable if we could reduce the engineering cost estimate or increase the revenue projection with more data. Neither is impossible.",
    ],
    AGAINST: [
      "The projected payback period of 14+ months is too long given our current runway situation. We should be prioritising features with a payback period under 6 months right now. I'd defer this to our next funding cycle.",
      "The financial assumptions here are too optimistic. We've consistently overestimated conversion on new features by 30–40%. When I apply our actual historical conversion rates, the economics don't work.",
    ],
  },
  "Head of Growth": {
    CHAMPION: [
      "This is one of the highest-leverage growth levers we have right now. The activation-to-retention correlation is strong in our data and anything that improves first-week engagement compounds significantly over 12 months. I'd fast-track this.",
      "From a growth standpoint, this directly addresses the top-of-funnel drop-off we've been trying to fix for two quarters. The expected lift is conservative — I think we'll beat the projections. Full support.",
    ],
    CAUTIOUS: [
      "The growth hypothesis is sound but I want to make sure we instrument this properly from day one. I've seen too many features where we shipped without the right analytics and couldn't tell whether it was working. Measurement plan first, then build.",
      "I support the direction but I'm worried about the sequencing. If we ship this before fixing the onboarding email sequence, we're bringing activated users into a retention environment that isn't ready for them. Let's fix the downstream first.",
    ],
    NEUTRAL: [
      "The growth case is reasonable. My honest view is that the impact is probably smaller than projected in the short term — these things take 2–3 months to compound in the data. I'd support it as a long-term bet, not a quick win.",
      "I can see this working, but I can also see us spending 6 weeks building something that moves the metric by 2pp instead of 15pp. I'd want to do a cheaper test of the hypothesis before committing to the full build.",
    ],
    AGAINST: [
      "I don't think this is the right growth lever right now. Our biggest constraint is top-of-funnel volume, not activation. Building activation features when we don't have enough users to test them is premature optimisation.",
      "The growth model doesn't account for the cannibalisation effect — this feature will reduce usage of the adjacent feature that currently drives our engagement metrics. The net impact may be neutral or negative.",
    ],
  },
};

function getVoice(role: string, stance: "CHAMPION"|"CAUTIOUS"|"NEUTRAL"|"AGAINST", seed: string): string {
  const voices = PERSONA_VOICES[role]?.[stance] ?? [`I'm ${stance.toLowerCase()} on this. Let's review the data before committing.`];
  return pick(seed + role + stance, voices);
}

export function mockBoardroom(topic: string, productName: string): BoardroomResult {
  const seed = `${topic}:${productName}`;
  const stances: Array<"CHAMPION"|"CAUTIOUS"|"NEUTRAL"|"AGAINST"> = ["CHAMPION", "CAUTIOUS", "NEUTRAL", "AGAINST", "CAUTIOUS"];
  const shuffledStances = [...stances].sort((a, b) => strHash(seed + a) - strHash(seed + b));

  const transcript: BoardroomPersona[] = PERSONAS.map((p, i) => ({
    name: p.name,
    role: p.role,
    stance: shuffledStances[i],
    message: getVoice(p.role, shuffledStances[i], seed + i),
  }));

  const counts = { champion: 0, cautious: 0, neutral: 0, against: 0 };
  transcript.forEach(t => { counts[t.stance.toLowerCase() as keyof typeof counts]++; });

  const dominant = transcript.filter(t => t.stance === "CHAMPION").length >= 2
    ? "The team sees clear value in moving forward with a scoped approach."
    : transcript.filter(t => t.stance === "AGAINST").length >= 2
    ? "The team has significant reservations — further validation is recommended before committing."
    : "The team is divided. A time-boxed experiment is recommended to resolve the key uncertainty.";

  return {
    summary: `The boardroom reviewed: "${topic}"`,
    consensus: dominant,
    transcript,
    votes: counts,
  };
}

// ─── Emotion Simulator ────────────────────────────────────────────────────────

export interface EmotionStage {
  stage: string;
  emotion: string;
  score: number;
  note: string;
}

export function mockEmotionSimulation(productName: string, persona: string): EmotionStage[] {
  const seed = `${productName}:${persona}`;
  const stages = ["Discovery", "Sign-up", "First run", "First value", "Habit formed"];
  const emotions = [
    ["Curious", "Excited", "Hopeful"],
    ["Confused", "Overwhelmed", "Uncertain"],
    ["Engaged", "Learning", "Focused"],
    ["Delighted", "Confident", "Satisfied"],
    ["Reliant", "Loyal", "Advocate"],
  ];
  const notes = [
    ["Found via referral", "Saw an ad", "Organic search"],
    ["Too many fields", "Unclear value prop", "Long onboarding"],
    ["Well guided", "Slight confusion on step 2", "Needed help"],
    ["Core insight lands", "Value is clear", "Aha moment hit"],
    ["Uses daily", "Integrated into workflow", "Recommended to team"],
  ];

  return stages.map((stage, i) => ({
    stage,
    emotion: pick(seed + stage, emotions[i]),
    score: inRange(seed + stage + i, 40, 95),
    note: pick(seed + stage + "note", notes[i]),
  }));
}

// ─── Feature Sandbox ──────────────────────────────────────────────────────────

export interface SandboxResult {
  retentionImpact: number;
  revenueImpact: number;
  engagementImpact: number;
  effortEstimateDays: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  keyFindings: string[];
}

export function mockSandboxAnalysis(featureName: string, description: string): SandboxResult {
  const seed = `${featureName}:${description}`;
  return {
    retentionImpact: inRange(seed + "ret", 5, 35),
    revenueImpact: inRange(seed + "rev", 3, 25),
    engagementImpact: inRange(seed + "eng", 10, 55),
    effortEstimateDays: inRange(seed + "eff", 5, 30),
    riskLevel: pick(seed + "risk", ["LOW", "LOW", "MEDIUM", "HIGH"] as const),
    summary: pick(seed + "sum", [
      "Strong build signal. The effort-to-impact ratio is favourable and the user need is validated by support data.",
      "Moderate confidence. The feature addresses a real need but the implementation complexity is higher than it first appears.",
      "High-confidence recommendation to build. This directly addresses the top friction point in the current user journey.",
    ]),
    keyFindings: pickN(seed + "find", [
      "Users who complete this workflow show 2.4× higher 90-day retention",
      "Support ticket volume related to this gap would drop by an estimated 28%",
      "The feature creates a natural upsell moment — users who engage are 40% more likely to upgrade",
      "Adjacent features can share the same infrastructure, reducing future build costs",
      "Power users are the primary beneficiaries but the feature improves discovery for all segments",
    ], 3),
  };
}
