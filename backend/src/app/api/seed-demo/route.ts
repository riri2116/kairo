import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await req.json();
    const { workspaceSlug } = body;
    if (!workspaceSlug) {
      return NextResponse.json({ success: false, error: "workspaceSlug required" }, { status: 400 });
    }

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);
    const wId = workspace.id;

    // Idempotent: skip if already seeded
    const existing = await prisma.product.count({ where: { workspaceId: wId, deletedAt: null } });
    if (existing > 0) {
      return NextResponse.json({ success: true, skipped: true, message: "Already seeded" });
    }

    // ── Products ─────────────────────────────────────────────────────────
    const [novaPay, pulseAI] = await Promise.all([
      prisma.product.create({
        data: {
          workspaceId: wId,
          name: "NovaPay",
          description: "A B2B embedded payments platform that lets SaaS companies add invoicing, pay-outs, and spend management to their product without building financial infrastructure.",
          targetAudience: "SaaS founders and CTOs at Series A–C companies with 50–500 business customers who lose deals to Stripe or Bill.com",
          businessGoal: "Reach $2M ARR in 18 months through product-led sales to SaaS companies in the HR, project-management, and legal-tech verticals",
          pricingModel: "0.4% take rate on payment volume + $299/month platform fee per merchant",
          industry: "Fintech / B2B SaaS",
          stage: "BETA",
        },
      }),
      prisma.product.create({
        data: {
          workspaceId: wId,
          name: "PulseAI",
          description: "An AI-powered customer health and churn-prediction platform that connects to your CRM, product analytics, and support data to surface at-risk accounts before they cancel.",
          targetAudience: "VP of Customer Success and Account Management teams at B2B SaaS companies with $5M–$50M ARR",
          businessGoal: "Reduce average customer churn by 4 percentage points for each client; target 40 enterprise logos in year one",
          pricingModel: "Per-seat pricing at $120/seat/month, minimum 5 seats; usage tiers based on accounts monitored",
          industry: "Customer Success / SaaS Analytics",
          stage: "LAUNCHED",
        },
      }),
    ]);

    // ── Brain Analyses ────────────────────────────────────────────────────
    await Promise.all([
      prisma.productBrainAnalysis.create({
        data: {
          workspaceId: wId,
          productId: novaPay.id,
          submissionType: "FEATURE_IDEA",
          title: "One-click split-payment for team invoices",
          input: "Should we add automatic invoice splitting so that multiple stakeholders at a client company can each pay their share of a large invoice without manual coordination?",
          status: "COMPLETED",
          confidenceScore: 87,
          riskLevel: "MEDIUM",
          impactAnalysis: "This feature directly addresses a known friction point: 34% of support tickets for B2B payment platforms cite multi-stakeholder invoice approval as a source of delay. Enabling split payments reduces average days-to-collect from 22 to an estimated 9 days, improving cash-flow predictability for NovaPay merchants. The feature also creates a viral loop — each split-payment invitation exposes a new contact to the NovaPay checkout experience, creating organic top-of-funnel leads for the merchant-side product.",
          riskAssessment: "Medium financial compliance risk: split-payment flows require careful handling of partial-payment state, chargeback attribution, and refund logic across multiple payers. Recommend phased rollout starting with fixed-amount splits only. The primary adoption risk is merchant education — split-payment UX needs progressive disclosure so it doesn't overwhelm merchants who don't need it.",
          technicalComplexity: "Moderate. Requires a new PaymentSplit data model, updates to the invoice state machine, and a payer-facing lightweight checkout experience. Estimated 6–8 weeks for a three-engineer team. The most complex piece is the webhook reconciliation layer — each partial payment must trigger downstream accounting events correctly.",
          revenueImpact: "Positive. Faster collections on existing invoice volume increases effective take-rate yield. Split payments also unlock larger average invoice sizes — merchants currently cap invoice amounts to avoid multi-approver friction. Estimated 12–18% lift in average transaction value within six months of launch.",
          retentionImpact: "High positive signal. Merchants who use advanced payment features have 2.4× lower 12-month churn than those using basic invoicing only. This feature is a strong retention driver for the $500+/month merchant cohort.",
          recommendation: "Build it. Prioritise in Q2. Start with a closed beta for the top 20 merchants by invoice volume. Gate the GA release on a successful reduction in 'invoice pending > 14 days' rate by at least 30%.",
          completedAt: new Date(),
        },
      }),
      prisma.productBrainAnalysis.create({
        data: {
          workspaceId: wId,
          productId: novaPay.id,
          submissionType: "PRICING_CHANGE",
          title: "Raise platform fee from $299 to $499/month",
          input: "We are considering raising the monthly platform fee from $299 to $499/month for all new merchants while grandfathering existing ones. Would this hurt conversion or is the market willing to pay more?",
          status: "COMPLETED",
          confidenceScore: 74,
          riskLevel: "HIGH",
          impactAnalysis: "A 67% price increase is material and will reduce top-of-funnel conversion. However, NovaPay's pricing is currently below the market median ($450/month) for embedded payments platforms with comparable feature depth. The increase is justifiable if accompanied by clear value communication. The risk is concentrated in the $10k–$50k ARR merchant segment, which is most price-sensitive. Enterprise merchants ($50k+ ARR) show low price elasticity in comparable cohort studies.",
          riskAssessment: "High near-term conversion risk. A/B test data from analogous fintech pricing changes shows a 15–25% drop in trial-to-paid conversion when platform fees increase by >40% without accompanying feature announcements. Grandfathering existing merchants is the right call — churn risk from existing base is low. Main risk: prospects comparing NovaPay to cheaper alternatives may default to Stripe even when NovaPay is technically superior.",
          technicalComplexity: "Low. Pricing change requires updates to checkout flows, billing engine configuration, and marketing copy. Estimated 1–2 weeks.",
          revenueImpact: "Net positive if conversion holds above 68% of current rate. At current trial volume, the increased fee generates +$38k additional MRR monthly from new merchants alone. Break-even on conversion loss occurs at approximately 72% of current conversion rate.",
          retentionImpact: "Neutral for existing merchants (grandfathered). For new merchants at the higher price, expect slightly higher activation intent — higher price-point merchants self-select for serious usage.",
          recommendation: "Proceed with caution. Recommend a 60-day A/B test at the new price point before full rollout. Pair the increase with a feature launch (e.g., advanced analytics or the split-payment feature) to justify the value step-up. Do not raise price without a corresponding value anchor.",
          completedAt: new Date(),
        },
      }),
      prisma.productBrainAnalysis.create({
        data: {
          workspaceId: wId,
          productId: pulseAI.id,
          submissionType: "GROWTH_EXPERIMENT",
          title: "Free health-score report for trial sign-ups",
          input: "Offer new trial users a free one-time customer health score report generated from their CRM data within 5 minutes of connecting their account. No credit card required. Does this accelerate conversion to paid?",
          status: "COMPLETED",
          confidenceScore: 91,
          riskLevel: "LOW",
          impactAnalysis: "Immediate value demonstration is the single strongest lever for PLG conversion in CS tools. Users who see a health score within their first session convert to paid at 3.1× the rate of those who do not. The 'aha moment' for PulseAI is seeing a specific at-risk account surface in the first 5 minutes — this experiment is designed to manufacture that moment reliably. Expected uplift: trial-to-paid conversion from 18% to 28–32%.",
          riskAssessment: "Low product risk. The main operational risk is data quality — if a user's CRM data is poorly structured, the health score may be misleading and create a negative first impression. Recommend a confidence indicator alongside each score and a fallback message when data quality is insufficient. Privacy: ensure CRM OAuth scopes are minimal and clearly disclosed.",
          technicalComplexity: "Moderate. Requires a fast inference path (< 5 minutes end-to-end) for the health score model, a lightweight report template, and a CRM connector that can handle partial data gracefully. The ML inference pipeline already exists — the main work is the fast-path orchestration and the report UI.",
          revenueImpact: "Very high. A 10-point improvement in trial conversion at current trial volume translates to approximately $180k additional ARR in the first 12 months. Cost of additional compute for report generation is negligible at current scale.",
          retentionImpact: "Strong positive. Users who receive the free report and convert to paid have 40% lower 6-month churn than those who converted without it — the value anchoring effect persists into the paid relationship.",
          recommendation: "Run it immediately. This is the highest-confidence, lowest-risk growth experiment in the current pipeline. Set a 30-day conversion-rate target of 26%+ as the success metric. If it hits, make the instant health score the default trial experience permanently.",
          completedAt: new Date(),
        },
      }),
    ]);

    // ── Boardroom Sessions ────────────────────────────────────────────────
    await Promise.all([
      prisma.boardroomSession.create({
        data: {
          workspaceId: wId,
          productId: novaPay.id,
          topic: "Should NovaPay launch a self-serve merchant onboarding flow or keep high-touch sales?",
          consensus: "Hybrid approach recommended: self-serve for sub-$500/month merchants, high-touch for enterprise. Build self-serve first as it unblocks the long tail.",
          status: "COMPLETED",
          votes: { champion: 2, cautious: 2, neutral: 1, against: 0 },
          transcript: [
            { persona: "Sarah Chen", role: "CEO", stance: "Champion", color: "#6366f1", message: "Self-serve is table stakes in 2024. Our competitors all have it. Every week without it we're losing the long tail of merchants who won't answer a sales call. I say we build it aggressively and use the freed sales time to go enterprise." },
            { persona: "Marcus Reid", role: "CTO", stance: "Cautious", color: "#3b82f6", message: "The technical lift is real — KYC verification, document handling, banking integration, and fraud signals all have to be automated. We're looking at 3–4 months of core infrastructure work before the first merchant completes self-serve onboarding. I support it, but we need to be honest about the timeline." },
            { persona: "Priya Nair", role: "CFO", stance: "Champion", color: "#10b981", message: "The unit economics are compelling. Self-serve merchants cost $120 to acquire vs $1,400 for high-touch. Our payback period drops from 14 months to 5. Even if conversion is lower, the volume math works in our favour." },
            { persona: "James Okafor", role: "CPO", stance: "Cautious", color: "#f59e0b", message: "My concern is activation quality. Our current onboarding has a 91% activation rate because we hold merchants' hands. Self-serve fintechs typically see 55–65% activation. We need to invest heavily in in-product guidance or we'll trade high-touch economics for low-quality merchants who churn faster." },
            { persona: "Elena Torres", role: "CMO", stance: "Neutral", color: "#ec4899", message: "From a market positioning standpoint, self-serve signals product maturity and builds brand trust. It also unlocks a content and SEO strategy that's impossible with sales-only. I'm neutral on timing — whenever product is ready, marketing will be ready." },
          ],
        },
      }),
      prisma.boardroomSession.create({
        data: {
          workspaceId: wId,
          productId: pulseAI.id,
          topic: "Is PulseAI ready to target Fortune 500 enterprise accounts?",
          consensus: "Not yet. Focus on $5M–$50M ARR SaaS companies for the next 12 months. Build two enterprise-grade requirements first: SSO/SAML and custom data retention policies.",
          status: "COMPLETED",
          votes: { champion: 1, cautious: 2, neutral: 1, against: 1 },
          transcript: [
            { persona: "Sarah Chen", role: "CEO", stance: "Against", color: "#6366f1", message: "Fortune 500 sales cycles are 9–18 months and require procurement processes, legal review, and security audits that would consume our entire team. We are a 28-person company. One enterprise deal going sideways could distract us for a year. I say not yet." },
            { persona: "Marcus Reid", role: "CTO", stance: "Cautious", color: "#3b82f6", message: "We're missing two table-stakes requirements for enterprise: SSO/SAML and custom data retention/residency policies. Until those ship, we can't even get through a Fortune 500 security review. That's 6–8 weeks of work just to qualify." },
            { persona: "Priya Nair", role: "CFO", stance: "Champion", color: "#10b981", message: "A single Fortune 500 contract could be $800k–$1.2M ARR. Even one deal changes our growth trajectory and our fundraising narrative. I think we should run a targeted outreach to 10 names and see what the sales cycle actually looks like before deciding." },
            { persona: "James Okafor", role: "CPO", stance: "Cautious", color: "#f59e0b", message: "Enterprise buyers will ask for integrations we don't have — ServiceNow, custom Salesforce objects, Workday. We'd end up building custom work for one customer that doesn't generalise. Mid-market is already a large enough TAM and we're barely scratching it." },
            { persona: "Elena Torres", role: "CMO", stance: "Neutral", color: "#ec4899", message: "Our G2 reviews and case studies are all from 50–300 person CS teams. That's our credibility base. Using a Fortune 500 logo would change our positioning significantly. Neutral on timing, but the brand value of one household name would be meaningful." },
          ],
        },
      }),
    ]);

    // ── Feature Sandboxes ─────────────────────────────────────────────────
    await Promise.all([
      prisma.featureSandbox.create({
        data: {
          workspaceId: wId,
          productId: novaPay.id,
          featureName: "Real-time payment status push notifications",
          description: "Push SMS and in-app notifications to both the merchant and payer at every payment state change: sent, viewed, partial-paid, fully-paid, overdue.",
          retentionImpact: 18,
          revenueImpact: 7,
          engagementImpact: 34,
          effortEstimateDays: 14,
          riskLevel: "LOW",
          status: "COMPLETED",
          results: {
            summary: "High-confidence recommendation to build. Real-time notifications address the top complaint in merchant support tickets. Effort is low relative to expected engagement and retention lift.",
            keyFindings: [
              "Merchants check invoice status an average of 4.2× before payment — notifications eliminate this behaviour and reduce support load by ~22%",
              "Payer-facing notifications ('your invoice is 3 days from due') reduce overdue invoices by an estimated 31%",
              "In-app notification infrastructure can be reused for future features (disputes, reconciliation alerts)"
            ]
          }
        },
      }),
      prisma.featureSandbox.create({
        data: {
          workspaceId: wId,
          productId: pulseAI.id,
          featureName: "Slack integration for health score alerts",
          description: "Post daily health score summaries and at-risk account alerts directly to a configurable Slack channel so CS teams see signals in their existing workflow.",
          retentionImpact: 24,
          revenueImpact: 11,
          engagementImpact: 47,
          effortEstimateDays: 10,
          riskLevel: "LOW",
          status: "COMPLETED",
          results: {
            summary: "Strong build signal. Slack is where CS teams live. Bringing alerts to Slack closes the loop between signal and action. High engagement lift expected with very low engineering effort.",
            keyFindings: [
              "CS teams that receive alerts in Slack respond to at-risk accounts 2.8× faster than those checking dashboards manually",
              "Slack integration is the #1 requested feature in exit interviews with churned trial users",
              "Expected 47% lift in daily active usage once Slack becomes the primary notification channel"
            ]
          }
        },
      }),
    ]);

    // ── Requirements ──────────────────────────────────────────────────────
    await Promise.all([
      prisma.productRequirement.create({
        data: {
          workspaceId: wId,
          productId: novaPay.id,
          title: "ACH pull payment support for recurring invoices",
          description: "Merchants need to initiate ACH pull payments for subscription-based billing without requiring payers to manually approve each invoice. This enables autopay workflows for SaaS-style billing.",
          type: "FEATURE",
          priority: "HIGH",
          status: "IN_PROGRESS",
          acceptanceCriteria: [
            "Merchant can enable autopay on a per-customer basis with explicit customer consent",
            "ACH pull initiates within 2 hours of invoice due date",
            "Failed ACH pull triggers automatic retry schedule (D+1, D+3, D+7)",
            "All ACH transactions appear in the merchant reconciliation report",
          ],
          tags: ["payments", "ACH", "recurring", "Q2"],
        },
      }),
      prisma.productRequirement.create({
        data: {
          workspaceId: wId,
          productId: novaPay.id,
          title: "Multi-currency invoice support (EUR, GBP, CAD)",
          description: "International merchants need to send invoices in their customers' local currency with automatic FX conversion and settlement in USD.",
          type: "FEATURE",
          priority: "MEDIUM",
          status: "REVIEW",
          acceptanceCriteria: [
            "Merchant can select invoice currency from EUR, GBP, CAD at creation time",
            "Real-time FX rate displayed before sending with a 24-hour lock option",
            "Merchant receives settlement in USD within 2 business days of payment",
            "FX margin is displayed transparently in the merchant dashboard",
          ],
          tags: ["international", "FX", "multi-currency"],
        },
      }),
      prisma.productRequirement.create({
        data: {
          workspaceId: wId,
          productId: pulseAI.id,
          title: "SAML/SSO authentication for enterprise accounts",
          description: "Enterprise customers require SAML-based single sign-on integrated with Okta, Azure AD, and Google Workspace. Blocking issue for all Fortune 500 procurement reviews.",
          type: "TECHNICAL_DEBT",
          priority: "CRITICAL",
          status: "APPROVED",
          acceptanceCriteria: [
            "Support SAML 2.0 IdP-initiated and SP-initiated flows",
            "Admin can configure SSO in-app without contacting support",
            "JIT provisioning: new users auto-created on first SSO login with configurable role defaults",
            "Fall-back to password auth remains available as configurable option",
          ],
          tags: ["enterprise", "security", "SSO", "SAML"],
        },
      }),
      prisma.productRequirement.create({
        data: {
          workspaceId: wId,
          productId: pulseAI.id,
          title: "Custom health score weighting per customer segment",
          description: "Different CS teams weight signals differently — a SaaS company selling to SMBs cares more about login frequency; enterprise SaaS cares more about executive engagement. Allow admins to configure signal weights per segment.",
          type: "IMPROVEMENT",
          priority: "HIGH",
          status: "DRAFT",
          acceptanceCriteria: [
            "Admin can create named scoring models with custom signal weights",
            "Each customer account can be assigned to a scoring model",
            "Weight changes recalculate historical scores retroactively",
            "A/B comparison view shows health score distribution under different models",
          ],
          tags: ["health-score", "customisation", "enterprise"],
        },
      }),
    ]);

    // ── Roadmap ───────────────────────────────────────────────────────────
    const roadmap = await prisma.roadmap.create({
      data: {
        workspaceId: wId,
        productId: novaPay.id,
        title: "NovaPay Q2 2025 Roadmap",
        description: "Core infrastructure and merchant experience improvements to support self-serve launch and enterprise expansion.",
        quarter: "Q2 2025",
        status: "ACTIVE",
        goals: [
          "Launch self-serve merchant onboarding with automated KYC",
          "Ship split-payment feature to beta merchants",
          "Reduce average invoice collection time from 22 to 12 days",
        ],
      },
    });

    await Promise.all([
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "Self-serve KYC & merchant onboarding flow", description: "Automated identity verification and bank account linking without sales involvement", priority: "HIGH", status: "IN_PROGRESS" } }),
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "Split-payment invoice feature", description: "Allow multiple payers to contribute to a single invoice with individual payment links", priority: "HIGH", status: "PLANNED" } }),
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "Real-time notification system", description: "SMS and in-app push for payment status changes", priority: "MEDIUM", status: "PLANNED" } }),
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "Merchant analytics dashboard v2", description: "Rebuilt analytics with cohort view, collection velocity chart, and payer-behaviour insights", priority: "MEDIUM", status: "PLANNED" } }),
    ]);

    return NextResponse.json({
      success: true,
      seeded: {
        products: 2,
        brainAnalyses: 3,
        boardroomSessions: 2,
        sandboxes: 2,
        requirements: 4,
        roadmaps: 1,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
