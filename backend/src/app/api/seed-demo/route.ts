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
    const [bharatPay, growthSaathi] = await Promise.all([
      prisma.product.create({
        data: {
          workspaceId: wId,
          name: "BharatPay",
          description: "A B2B embedded payments platform that lets Indian SaaS companies add UPI, NACH mandates, invoicing, and pay-outs to their product without building financial infrastructure from scratch.",
          targetAudience: "SaaS founders and CTOs at Series A–C companies with 50–500 business customers who lose deals to Razorpay or PayU because they lack native payment infra",
          businessGoal: "Reach ₹16 Cr ARR in 18 months through product-led sales to SaaS companies in the HR, ERP, and legal-tech verticals",
          pricingModel: "0.4% take rate on payment volume + ₹24,999/month platform fee per merchant",
          industry: "Fintech / B2B SaaS",
          stage: "BETA",
        },
      }),
      prisma.product.create({
        data: {
          workspaceId: wId,
          name: "GrowthSaathi",
          description: "An AI-powered customer health and churn-prediction platform that connects to your CRM, product analytics, and support data to surface at-risk accounts before they cancel.",
          targetAudience: "VP of Customer Success and Account Management teams at B2B SaaS companies with ₹40 Cr–₹400 Cr ARR, primarily in Bengaluru, Mumbai, and Hyderabad",
          businessGoal: "Reduce average customer churn by 4 percentage points for each client; target 40 enterprise logos in year one",
          pricingModel: "Per-seat pricing at ₹9,999/seat/month, minimum 5 seats; usage tiers based on accounts monitored",
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
          productId: bharatPay.id,
          submissionType: "FEATURE_IDEA",
          title: "One-click UPI split-payment for team invoices",
          input: "Should we add automatic invoice splitting so that multiple stakeholders at a client company can each pay their share of a large invoice via UPI without manual coordination?",
          status: "COMPLETED",
          confidenceScore: 87,
          riskLevel: "MEDIUM",
          impactAnalysis: "This feature directly addresses a known friction point: 34% of support tickets for B2B payment platforms cite multi-stakeholder invoice approval as a source of delay. Enabling UPI split payments reduces average days-to-collect from 22 to an estimated 9 days, improving cash-flow predictability for BharatPay merchants. The feature also creates a viral loop — each split-payment invitation exposes a new contact to the BharatPay checkout experience, generating organic top-of-funnel leads.",
          riskAssessment: "Medium compliance risk: split-payment flows require careful handling of partial-payment state, chargeback attribution, and refund logic across multiple payers under NPCI guidelines. Recommend phased rollout starting with fixed-amount UPI splits only. Primary adoption risk is merchant education — progressive disclosure is essential so it doesn't overwhelm merchants who don't need it.",
          technicalComplexity: "Moderate. Requires a new PaymentSplit data model, updates to the invoice state machine, and a payer-facing lightweight UPI checkout experience. Estimated 6–8 weeks for a three-engineer team. The most complex piece is the webhook reconciliation layer — each partial payment must trigger downstream accounting events correctly.",
          revenueImpact: "Positive. Faster collections on existing invoice volume increases effective take-rate yield. Split payments also unlock larger average invoice sizes — merchants currently cap invoice amounts to avoid multi-approver friction. Estimated 12–18% lift in average transaction value within six months of launch.",
          retentionImpact: "High positive signal. Merchants who use advanced payment features have 2.4× lower 12-month churn than those using basic invoicing only. This feature is a strong retention driver for the ₹40,000+/month merchant cohort.",
          recommendation: "Build it. Prioritise in Q2. Start with a closed beta for the top 20 merchants by invoice volume. Gate the GA release on a successful reduction in 'invoice pending > 14 days' rate by at least 30%.",
          completedAt: new Date(),
        },
      }),
      prisma.productBrainAnalysis.create({
        data: {
          workspaceId: wId,
          productId: bharatPay.id,
          submissionType: "PRICING_CHANGE",
          title: "Raise platform fee from ₹24,999 to ₹39,999/month",
          input: "We are considering raising the monthly platform fee from ₹24,999 to ₹39,999/month for all new merchants while grandfathering existing ones. Would this hurt conversion or is the Indian B2B market willing to pay more?",
          status: "COMPLETED",
          confidenceScore: 74,
          riskLevel: "HIGH",
          impactAnalysis: "A 60% price increase is material and will reduce top-of-funnel conversion. However, BharatPay's pricing is currently below the market median (₹37,000/month) for embedded payments platforms with comparable feature depth in India. The increase is justifiable if accompanied by clear value communication. The risk is concentrated in the ₹80 Lakh–₹4 Cr ARR merchant segment, which is most price-sensitive. Larger merchants (₹4 Cr+ ARR) show low price elasticity in comparable cohort studies.",
          riskAssessment: "High near-term conversion risk. A/B test data from analogous Indian fintech pricing changes shows a 15–25% drop in trial-to-paid conversion when platform fees increase by >40% without accompanying feature announcements. Grandfathering existing merchants is the right call — churn risk from the existing base is low. Main risk: prospects comparing BharatPay to cheaper alternatives may default to Razorpay even when BharatPay is technically superior.",
          technicalComplexity: "Low. Pricing change requires updates to checkout flows, billing engine configuration, and marketing copy. Estimated 1–2 weeks.",
          revenueImpact: "Net positive if conversion holds above 68% of current rate. At current trial volume, the increased fee generates +₹32 Lakh additional MRR monthly from new merchants alone. Break-even on conversion loss occurs at approximately 72% of current conversion rate.",
          retentionImpact: "Neutral for existing merchants (grandfathered). For new merchants at the higher price, expect slightly higher activation intent — higher price-point merchants self-select for serious usage.",
          recommendation: "Proceed with caution. Recommend a 60-day A/B test at the new price point before full rollout. Pair the increase with a feature launch (e.g., UPI AutoPay or split-payment) to justify the value step-up. Do not raise price without a corresponding value anchor.",
          completedAt: new Date(),
        },
      }),
      prisma.productBrainAnalysis.create({
        data: {
          workspaceId: wId,
          productId: growthSaathi.id,
          submissionType: "GROWTH_EXPERIMENT",
          title: "Free health-score report for trial sign-ups",
          input: "Offer new trial users a free one-time customer health score report generated from their CRM data within 5 minutes of connecting their account. No credit card required. Does this accelerate conversion to paid?",
          status: "COMPLETED",
          confidenceScore: 91,
          riskLevel: "LOW",
          impactAnalysis: "Immediate value demonstration is the single strongest lever for PLG conversion in CS tools. Users who see a health score within their first session convert to paid at 3.1× the rate of those who do not. The 'aha moment' for GrowthSaathi is seeing a specific at-risk account surface in the first 5 minutes — this experiment is designed to manufacture that moment reliably. Expected uplift: trial-to-paid conversion from 18% to 28–32%.",
          riskAssessment: "Low product risk. The main operational risk is data quality — if a user's CRM data is poorly structured, the health score may be misleading. Recommend a confidence indicator alongside each score and a fallback message when data quality is insufficient. Privacy: ensure CRM OAuth scopes are minimal and clearly disclosed under India's DPDP Act.",
          technicalComplexity: "Moderate. Requires a fast inference path (< 5 minutes end-to-end) for the health score model, a lightweight report template, and a CRM connector that handles partial data gracefully. The ML inference pipeline already exists — the main work is the fast-path orchestration and report UI.",
          revenueImpact: "Very high. A 10-point improvement in trial conversion at current trial volume translates to approximately ₹1.5 Cr additional ARR in the first 12 months. Cost of additional compute for report generation is negligible at current scale.",
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
          productId: bharatPay.id,
          topic: "Should BharatPay launch self-serve merchant onboarding or keep high-touch sales?",
          consensus: "Hybrid approach recommended: self-serve for merchants under ₹20,000/month, high-touch for enterprise. Build self-serve first as it unblocks the long tail of SME merchants.",
          status: "COMPLETED",
          votes: { champion: 2, cautious: 2, neutral: 1, against: 0 },
          transcript: [
            { persona: "Anjali Sharma", role: "CEO", stance: "Champion", color: "#6366f1", message: "Self-serve is table stakes in 2024. Our competitors all have it. Every week without it we're losing the long tail of merchants who won't sit through a sales demo. I say we build it aggressively and use the freed sales time to go enterprise." },
            { persona: "Vikram Nair", role: "CTO", stance: "Cautious", color: "#3b82f6", message: "The technical lift is real — Video KYC, Aadhaar-based verification, bank account linking with penny drop, and fraud signals all have to be automated. We're looking at 3–4 months of core infrastructure work before the first merchant completes self-serve onboarding. I support it, but let's be honest about the timeline." },
            { persona: "Priya Nair", role: "CFO", stance: "Champion", color: "#10b981", message: "The unit economics are compelling. Self-serve merchants cost ₹10,000 to acquire vs ₹1,15,000 for high-touch. Our payback period drops from 14 months to 5. Even if conversion is lower, the volume math works in our favour." },
            { persona: "Arjun Mehta", role: "CPO", stance: "Cautious", color: "#f59e0b", message: "My concern is activation quality. Our current onboarding has a 91% activation rate because we guide merchants through every step. Self-serve fintechs typically see 55–65% activation. We need to invest heavily in in-product guidance or we'll trade high-touch economics for merchants who churn faster." },
            { persona: "Riya Kapoor", role: "CMO", stance: "Neutral", color: "#ec4899", message: "From a market positioning standpoint, self-serve signals product maturity and builds brand trust — especially with the Bengaluru and Delhi SaaS ecosystem. It also unlocks a content and SEO strategy that's impossible with sales-only. I'm neutral on timing — whenever product is ready, marketing will be ready." },
          ],
        },
      }),
      prisma.boardroomSession.create({
        data: {
          workspaceId: wId,
          productId: growthSaathi.id,
          topic: "Is GrowthSaathi ready to target NSE 500 enterprise accounts?",
          consensus: "Not yet. Focus on ₹40 Cr–₹400 Cr ARR Indian SaaS companies for the next 12 months. Build two enterprise-grade requirements first: SSO/SAML and custom data retention policies compliant with DPDP Act.",
          status: "COMPLETED",
          votes: { champion: 1, cautious: 2, neutral: 1, against: 1 },
          transcript: [
            { persona: "Anjali Sharma", role: "CEO", stance: "Against", color: "#6366f1", message: "Enterprise sales cycles in India's large corporates are 12–18 months and require L1 procurement approvals, legal review, and security audits from their IT teams. We are a 28-person company. One enterprise deal going sideways could distract us for a year. I say not yet." },
            { persona: "Vikram Nair", role: "CTO", stance: "Cautious", color: "#3b82f6", message: "We're missing two table-stakes requirements for enterprise: SSO/SAML and DPDP-compliant data residency within India. Until those ship, we can't get through a large enterprise security review. That's 6–8 weeks of work just to qualify." },
            { persona: "Priya Nair", role: "CFO", stance: "Champion", color: "#10b981", message: "A single large enterprise contract could be ₹6.5 Cr–₹10 Cr ARR. Even one deal changes our growth trajectory and our Series A fundraising narrative. I think we should run targeted outreach to 10 names and see what the actual sales cycle looks like before deciding." },
            { persona: "Arjun Mehta", role: "CPO", stance: "Cautious", color: "#f59e0b", message: "Enterprise buyers will ask for integrations we don't have — ServiceNow, custom Salesforce objects, SAP connectors. We'd end up building custom work for one customer that doesn't generalise. Mid-market is already a large enough TAM and we're barely scratching it." },
            { persona: "Riya Kapoor", role: "CMO", stance: "Neutral", color: "#ec4899", message: "Our G2 reviews and case studies are all from 50–300 person CS teams at Indian SaaS companies. That's our credibility base. A large enterprise logo would change our positioning significantly — neutral on timing, but the brand value would be meaningful for our next fundraise." },
          ],
        },
      }),
    ]);

    // ── Feature Sandboxes ─────────────────────────────────────────────────
    await Promise.all([
      prisma.featureSandbox.create({
        data: {
          workspaceId: wId,
          productId: bharatPay.id,
          featureName: "Real-time payment status push notifications",
          description: "Push WhatsApp and in-app notifications to both the merchant and payer at every payment state change: sent, viewed, partial-paid, fully-paid, overdue.",
          retentionImpact: 18,
          revenueImpact: 7,
          engagementImpact: 34,
          effortEstimateDays: 14,
          riskLevel: "LOW",
          status: "COMPLETED",
          results: {
            summary: "High-confidence recommendation to build. Real-time WhatsApp notifications address the top complaint in merchant support tickets. Effort is low relative to the expected engagement and retention lift.",
            keyFindings: [
              "Merchants check invoice status an average of 4.2× before payment — notifications eliminate this behaviour and reduce support load by ~22%",
              "Payer-facing WhatsApp nudges ('your invoice is 3 days from due') reduce overdue invoices by an estimated 31%",
              "Notification infrastructure can be reused for future features: disputes, NACH mandate reminders, reconciliation alerts"
            ]
          }
        },
      }),
      prisma.featureSandbox.create({
        data: {
          workspaceId: wId,
          productId: growthSaathi.id,
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
          productId: bharatPay.id,
          title: "NACH mandate support for recurring invoice collections",
          description: "Merchants need to initiate NACH mandates for subscription-based billing without requiring payers to manually approve each invoice. This enables autopay workflows for SaaS-style recurring billing under NPCI guidelines.",
          type: "FEATURE",
          priority: "HIGH",
          status: "IN_PROGRESS",
          acceptanceCriteria: [
            "Merchant can enable NACH autopay on a per-customer basis with explicit eSigned customer consent",
            "NACH debit initiates within 2 hours of invoice due date via NPCI API",
            "Failed NACH debit triggers automatic retry schedule (D+1, D+3, D+7)",
            "All NACH transactions appear in the merchant reconciliation report with UTR numbers",
          ],
          tags: ["payments", "NACH", "recurring", "NPCI", "Q2"],
        },
      }),
      prisma.productRequirement.create({
        data: {
          workspaceId: wId,
          productId: bharatPay.id,
          title: "Multi-currency invoice support (SGD, AED, USD) for export clients",
          description: "Indian merchants exporting to Singapore, UAE, and the US need to send invoices in their customers' local currency with automatic FX conversion and INR settlement.",
          type: "FEATURE",
          priority: "MEDIUM",
          status: "REVIEW",
          acceptanceCriteria: [
            "Merchant can select invoice currency from SGD, AED, USD at creation time",
            "Real-time FX rate displayed before sending with a 24-hour rate lock option",
            "Merchant receives INR settlement within 2 business days of payment via RBI-approved channels",
            "FX margin is displayed transparently in the merchant dashboard in both currencies",
          ],
          tags: ["international", "FX", "multi-currency", "exports"],
        },
      }),
      prisma.productRequirement.create({
        data: {
          workspaceId: wId,
          productId: growthSaathi.id,
          title: "SAML/SSO authentication for enterprise accounts",
          description: "Enterprise customers require SAML-based single sign-on integrated with Okta, Azure AD, and Google Workspace. Blocking issue for all large enterprise procurement reviews.",
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
          productId: growthSaathi.id,
          title: "Custom health score weighting per customer segment",
          description: "Different CS teams weight signals differently — a SaaS company selling to SMBs in tier-2 cities cares more about login frequency; enterprise SaaS cares more about executive engagement. Allow admins to configure signal weights per segment.",
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
        productId: bharatPay.id,
        title: "BharatPay Q2 2025 Roadmap",
        description: "Core infrastructure and merchant experience improvements to support self-serve launch and enterprise expansion across Indian markets.",
        quarter: "Q2 2025",
        status: "ACTIVE",
        goals: [
          "Launch self-serve merchant onboarding with automated Video KYC",
          "Ship UPI split-payment feature to beta merchants",
          "Reduce average invoice collection time from 22 to 12 days",
        ],
      },
    });

    await Promise.all([
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "Self-serve Video KYC & merchant onboarding flow", description: "Automated identity verification via Aadhaar and bank account linking without sales involvement", priority: "HIGH", status: "IN_PROGRESS" } }),
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "UPI split-payment invoice feature", description: "Allow multiple payers to contribute to a single invoice with individual UPI payment links", priority: "HIGH", status: "PLANNED" } }),
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "WhatsApp notification system for payment status", description: "WhatsApp Business API and in-app push for payment state changes", priority: "MEDIUM", status: "PLANNED" } }),
      prisma.roadmapItem.create({ data: { roadmapId: roadmap.id, title: "Merchant analytics dashboard v2", description: "Rebuilt analytics with cohort view, collection velocity chart, and payer-behaviour insights for Indian SME merchants", priority: "MEDIUM", status: "PLANNED" } }),
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
