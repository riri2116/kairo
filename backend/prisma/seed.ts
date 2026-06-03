import { PrismaClient, WorkspaceRole, WorkspacePlan, ProductStage, SimulationStatus, RiskLevel, SessionStatus, SandboxStatus, PredictionType, PredictionHorizon, RoadmapStatus, RoadmapItemStatus, Priority, RequirementType, RequirementStatus, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding Kairo database...\n");

  // ── Users ─────────────────────────────────────────────────────────────────
  const [alice, bob, carol] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@kairo.ai" },
      update: {},
      create: {
        email: "alice@kairo.ai",
        name: "Alice Chen",
        avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Alice",
        passwordHash: "$2b$12$placeholder_hash_alice",
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@kairo.ai" },
      update: {},
      create: {
        email: "bob@kairo.ai",
        name: "Bob Park",
        avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Bob",
        passwordHash: "$2b$12$placeholder_hash_bob",
      },
    }),
    prisma.user.upsert({
      where: { email: "carol@kairo.ai" },
      update: {},
      create: {
        email: "carol@kairo.ai",
        name: "Carol Nair",
        avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Carol",
        passwordHash: "$2b$12$placeholder_hash_carol",
      },
    }),
  ]);
  console.log("✅  Users created:", alice.email, bob.email, carol.email);

  // ── Workspaces ────────────────────────────────────────────────────────────
  const [acmeWs, stealthWs] = await Promise.all([
    prisma.workspace.upsert({
      where: { slug: "acme-corp" },
      update: {},
      create: {
        name: "Acme Corp",
        slug: "acme-corp",
        plan: WorkspacePlan.PRO,
      },
    }),
    prisma.workspace.upsert({
      where: { slug: "stealth-labs" },
      update: {},
      create: {
        name: "Stealth Labs",
        slug: "stealth-labs",
        plan: WorkspacePlan.ENTERPRISE,
      },
    }),
  ]);
  console.log("✅  Workspaces created:", acmeWs.slug, stealthWs.slug);

  // ── Workspace Members ─────────────────────────────────────────────────────
  await Promise.all([
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: alice.id, workspaceId: acmeWs.id } },
      update: {},
      create: { userId: alice.id, workspaceId: acmeWs.id, role: WorkspaceRole.OWNER },
    }),
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: bob.id, workspaceId: acmeWs.id } },
      update: {},
      create: { userId: bob.id, workspaceId: acmeWs.id, role: WorkspaceRole.ADMIN },
    }),
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: carol.id, workspaceId: acmeWs.id } },
      update: {},
      create: { userId: carol.id, workspaceId: acmeWs.id, role: WorkspaceRole.MEMBER },
    }),
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: alice.id, workspaceId: stealthWs.id } },
      update: {},
      create: { userId: alice.id, workspaceId: stealthWs.id, role: WorkspaceRole.OWNER },
    }),
    prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: bob.id, workspaceId: stealthWs.id } },
      update: {},
      create: { userId: bob.id, workspaceId: stealthWs.id, role: WorkspaceRole.VIEWER },
    }),
  ]);
  console.log("✅  Workspace members assigned");

  // ── Products ──────────────────────────────────────────────────────────────
  const [flashApp, analyticsProduct] = await Promise.all([
    prisma.product.upsert({
      where: { id: "00000000-0000-0000-0001-000000000001" },
      update: {},
      create: {
        id: "00000000-0000-0000-0001-000000000001",
        workspaceId: acmeWs.id,
        name: "FlashLearn",
        description: "AI-powered flashcard and spaced repetition learning platform",
        industry: "EdTech",
        stage: ProductStage.BETA,
      },
    }),
    prisma.product.upsert({
      where: { id: "00000000-0000-0000-0001-000000000002" },
      update: {},
      create: {
        id: "00000000-0000-0000-0001-000000000002",
        workspaceId: stealthWs.id,
        name: "PulseAnalytics",
        description: "Real-time product analytics and user behavior intelligence",
        industry: "SaaS / Analytics",
        stage: ProductStage.LAUNCHED,
      },
    }),
  ]);
  console.log("✅  Products created:", flashApp.name, analyticsProduct.name);

  // ── Simulations ───────────────────────────────────────────────────────────
  const sim1 = await prisma.simulation.create({
    data: {
      productId: flashApp.id,
      name: "AI Flashcard Launch Impact",
      question: "Should we launch AI-generated flashcards as a core feature?",
      status: SimulationStatus.COMPLETED,
      confidence: 0.82,
      retentionImpact: 0.23,
      riskScore: RiskLevel.MEDIUM,
      runAt: new Date("2025-05-20T10:00:00Z"),
      result: {
        recommendation: "Proceed with phased beta rollout.",
        insights: [
          "Power users show 34% higher engagement with AI-generated cards",
          "Onboarding friction is the primary risk factor",
          "Competitor Anki lacks this feature — strong differentiation opportunity",
        ],
        predictedMetrics: {
          mauDelta: 12400,
          revenueDeltaMrr: 45000,
          npsImpact: 8,
        },
      },
    },
  });

  const sim2 = await prisma.simulation.create({
    data: {
      productId: flashApp.id,
      name: "Offline Mode Feasibility",
      question: "What is the retention impact of adding offline study mode?",
      status: SimulationStatus.COMPLETED,
      confidence: 0.74,
      retentionImpact: 0.15,
      riskScore: RiskLevel.LOW,
      runAt: new Date("2025-05-28T14:30:00Z"),
      result: {
        recommendation: "Build. Low risk, strong retention signal.",
        insights: [
          "Mobile users in low-connectivity regions show highest churn",
          "Offline mode would recover ~3,200 at-risk users",
        ],
        predictedMetrics: {
          mauDelta: 5800,
          revenueDeltaMrr: 18000,
          npsImpact: 5,
        },
      },
    },
  });
  console.log("✅  Simulations created:", sim1.name, sim2.name);

  // ── Boardroom Sessions ────────────────────────────────────────────────────
  await prisma.boardroomSession.create({
    data: {
      productId: flashApp.id,
      topic: "Should we launch AI flashcards in Q3?",
      status: SessionStatus.COMPLETED,
      summary: "Strong champion majority. CTO flagged 3-sprint estimate. Finance approved on 18-month ROI basis.",
      consensus: "Proceed with phased beta. Target 500 beta users by end of Q3.",
      votes: { champion: 3, cautious: 1, neutral: 1 },
      transcript: [
        { persona: "CE", role: "Founder & CEO", stance: "CHAMPION", quote: "This directly accelerates our 10-year vision. I've seen this pattern work at three previous companies." },
        { persona: "CT", role: "CTO", stance: "CAUTIOUS", quote: "Technically feasible, but we're looking at 3 sprints minimum. We need to de-risk the ML pipeline first." },
        { persona: "GP", role: "Growth PM", stance: "CHAMPION", quote: "Our top acquisition channel is organic search. This is a massive SEO play — we'd own the keyword cluster." },
        { persona: "UX", role: "UX Researcher", stance: "CHAMPION", quote: "We tested this concept with 28 users last month. Net sentiment was 4.4/5. Confusion was limited to edge cases." },
        { persona: "FL", role: "Finance Lead", stance: "NEUTRAL", quote: "ROI projections look strong at 18 months. Payback period depends on infrastructure costs we haven't modeled yet." },
      ],
    },
  });
  console.log("✅  Boardroom session created");

  // ── Competitor Analyses ───────────────────────────────────────────────────
  await Promise.all([
    prisma.competitorAnalysis.create({
      data: {
        productId: flashApp.id,
        competitorName: "Anki",
        competitorUrl: "https://apps.ankiweb.net",
        strengths: ["Massive user base", "Open-source ecosystem", "Free desktop app", "Strong algorithm (SM-2)"],
        weaknesses: ["Poor mobile UX", "No AI generation", "Steep learning curve", "No collaboration features"],
        opportunities: ["AI-first differentiation", "Modern UX", "Team/classroom features", "API ecosystem"],
        threats: ["Brand loyalty", "Plugin ecosystem lock-in"],
        score: 62,
        analyzedAt: new Date("2025-05-15T00:00:00Z"),
      },
    }),
    prisma.competitorAnalysis.create({
      data: {
        productId: flashApp.id,
        competitorName: "Quizlet",
        competitorUrl: "https://quizlet.com",
        strengths: ["100M+ users", "Strong brand", "School partnerships", "AI features (Quizlet+)"],
        weaknesses: ["Paywall friction", "Ad-heavy free tier", "Declining NPS among power users"],
        opportunities: ["Kairo's power user focus", "B2B/enterprise segment", "Better AI quality"],
        threats: ["Distribution scale", "School contract moats"],
        score: 71,
        analyzedAt: new Date("2025-05-15T00:00:00Z"),
      },
    }),
  ]);
  console.log("✅  Competitor analyses created");

  // ── Feature Sandboxes ─────────────────────────────────────────────────────
  await Promise.all([
    prisma.featureSandbox.create({
      data: {
        productId: flashApp.id,
        featureName: "AI Flashcard Generator",
        description: "Generate study cards from any text, PDF, or URL using GPT-4",
        retentionImpact: 0.23,
        revenueImpact: 0.31,
        engagementImpact: 0.41,
        effortEstimateDays: 42,
        riskLevel: RiskLevel.MEDIUM,
        status: SandboxStatus.COMPLETED,
        parameters: { aiModel: "gpt-4o", maxCardsPerSession: 50, supportedFormats: ["text", "pdf", "url"] },
        results: { simulationRunId: sim1.id, confidenceScore: 0.82, greenFlags: 4, redFlags: 1 },
      },
    }),
    prisma.featureSandbox.create({
      data: {
        productId: flashApp.id,
        featureName: "Collaborative Deck Sharing",
        description: "Allow users to share, fork, and co-edit flashcard decks",
        retentionImpact: 0.12,
        revenueImpact: 0.08,
        engagementImpact: 0.28,
        effortEstimateDays: 21,
        riskLevel: RiskLevel.LOW,
        status: SandboxStatus.DRAFT,
        parameters: { maxCollaborators: 20, permissionLevels: ["view", "comment", "edit"] },
      },
    }),
  ]);
  console.log("✅  Feature sandboxes created");

  // ── Predictions ───────────────────────────────────────────────────────────
  await Promise.all([
    prisma.prediction.create({
      data: {
        productId: flashApp.id,
        title: "MAU Growth — Q3 2025",
        type: PredictionType.USER_GROWTH,
        confidence: 0.78,
        horizon: PredictionHorizon.NINETY_DAYS,
        predictedValue: { value: 18500, unit: "monthly_active_users", lowerBound: 14000, upperBound: 23000 },
        metadata: { modelVersion: "v2.1", datapointsUsed: 14200, featureFlags: ["ai_flashcards"] },
      },
    }),
    prisma.prediction.create({
      data: {
        productId: flashApp.id,
        title: "MRR Forecast — 1 Year",
        type: PredictionType.REVENUE,
        confidence: 0.71,
        horizon: PredictionHorizon.ONE_YEAR,
        predictedValue: { value: 320000, unit: "usd_mrr", lowerBound: 220000, upperBound: 440000 },
        metadata: { modelVersion: "v2.1", assumptions: ["AI feature launch Q3", "No major churn events"] },
      },
    }),
    prisma.prediction.create({
      data: {
        productId: flashApp.id,
        title: "D30 Retention Forecast",
        type: PredictionType.RETENTION,
        confidence: 0.85,
        horizon: PredictionHorizon.THIRTY_DAYS,
        predictedValue: { value: 0.58, unit: "retention_rate", lowerBound: 0.51, upperBound: 0.65 },
        metadata: { cohort: "new_signups_june_2025" },
      },
    }),
  ]);
  console.log("✅  Predictions created");

  // ── Roadmaps ──────────────────────────────────────────────────────────────
  const roadmap = await prisma.roadmap.create({
    data: {
      productId: flashApp.id,
      title: "Q3 2025 — AI-First Expansion",
      quarter: "Q3 2025",
      status: RoadmapStatus.ACTIVE,
      goals: [
        "Launch AI flashcard generator to 500 beta users",
        "Reduce D7 churn by 15% via improved onboarding",
        "Reach $45k MRR milestone",
      ],
    },
  });

  await Promise.all([
    prisma.roadmapItem.create({
      data: {
        roadmapId: roadmap.id,
        title: "AI Flashcard Generator (v1)",
        description: "MVP of GPT-4o powered card generation from text input",
        priority: Priority.CRITICAL,
        status: RoadmapItemStatus.IN_PROGRESS,
        dueDate: new Date("2025-07-31"),
      },
    }),
    prisma.roadmapItem.create({
      data: {
        roadmapId: roadmap.id,
        title: "Onboarding Redesign",
        description: "Reduce TTFV (Time to First Value) from 8 min to under 3 min",
        priority: Priority.HIGH,
        status: RoadmapItemStatus.PLANNED,
        dueDate: new Date("2025-08-15"),
      },
    }),
    prisma.roadmapItem.create({
      data: {
        roadmapId: roadmap.id,
        title: "Streak & Gamification System",
        description: "Daily streaks, XP points, and leaderboards to drive D30 retention",
        priority: Priority.MEDIUM,
        status: RoadmapItemStatus.PLANNED,
        dueDate: new Date("2025-09-15"),
      },
    }),
    prisma.roadmapItem.create({
      data: {
        roadmapId: roadmap.id,
        title: "Offline Study Mode",
        description: "PWA offline support for mobile users in low-connectivity regions",
        priority: Priority.MEDIUM,
        status: RoadmapItemStatus.PLANNED,
        dueDate: new Date("2025-09-30"),
      },
    }),
  ]);
  console.log("✅  Roadmap + items created");

  // ── Product Requirements ──────────────────────────────────────────────────
  await Promise.all([
    prisma.productRequirement.create({
      data: {
        productId: flashApp.id,
        title: "AI Card Generation API",
        description: "Expose a POST /cards/generate endpoint that accepts text, PDF, or URL and returns structured flashcard JSON",
        type: RequirementType.FEATURE,
        priority: Priority.CRITICAL,
        status: RequirementStatus.IN_PROGRESS,
        acceptanceCriteria: [
          "Accepts plain text up to 10,000 characters",
          "Accepts PDF file up to 5MB",
          "Returns between 5–50 structured flashcards",
          "Response time < 8 seconds for text input",
          "Graceful error handling for unsupported formats",
        ],
        tags: ["ai", "core", "api", "q3"],
      },
    }),
    prisma.productRequirement.create({
      data: {
        productId: flashApp.id,
        title: "Spaced Repetition Algorithm (SM-2)",
        description: "Implement SM-2 spaced repetition scheduling for review queue optimization",
        type: RequirementType.FEATURE,
        priority: Priority.HIGH,
        status: RequirementStatus.APPROVED,
        acceptanceCriteria: [
          "SM-2 algorithm correctly computes next review interval",
          "Ease factor stored per card per user",
          "Review queue sorted by due date",
          "Mature cards reviewed no more than once per week by default",
        ],
        tags: ["algorithm", "core", "retention"],
      },
    }),
    prisma.productRequirement.create({
      data: {
        productId: flashApp.id,
        title: "User Authentication & Sessions",
        description: "JWT-based auth with refresh token rotation, Google OAuth, and magic link support",
        type: RequirementType.FEATURE,
        priority: Priority.CRITICAL,
        status: RequirementStatus.COMPLETED,
        acceptanceCriteria: [
          "Email/password sign-in with bcrypt hashing",
          "Google OAuth 2.0 integration",
          "JWT access tokens (15 min expiry)",
          "Refresh token rotation on every use",
          "Magic link email sign-in",
        ],
        tags: ["auth", "security", "done"],
      },
    }),
  ]);
  console.log("✅  Product requirements created");

  // ── Notifications ─────────────────────────────────────────────────────────
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: alice.id,
        workspaceId: acmeWs.id,
        type: NotificationType.SIMULATION_COMPLETE,
        title: "Simulation Complete",
        message: `Your simulation "AI Flashcard Launch Impact" completed with 82% confidence.`,
        actionUrl: `/workspace/acme-corp/simulations/${sim1.id}`,
        metadata: { simulationId: sim1.id, confidence: 0.82 },
      },
    }),
    prisma.notification.create({
      data: {
        userId: bob.id,
        workspaceId: acmeWs.id,
        type: NotificationType.BOARDROOM_READY,
        title: "AI Boardroom Session Ready",
        message: "Your boardroom debate on AI flashcard launch has completed. 3 champions, 1 cautious vote.",
        actionUrl: "/workspace/acme-corp/boardroom",
        metadata: { consensus: "proceed" },
      },
    }),
    prisma.notification.create({
      data: {
        userId: carol.id,
        workspaceId: acmeWs.id,
        type: NotificationType.TEAM_INVITATION,
        title: "Welcome to Acme Corp",
        message: "Alice Chen has added you to the Acme Corp workspace as a Member.",
        metadata: { invitedBy: alice.id },
        read: true,
        readAt: new Date(),
      },
    }),
  ]);
  console.log("✅  Notifications created");

  console.log("\n🎉  Seed complete!\n");
  console.log("  Users:                 3");
  console.log("  Workspaces:            2");
  console.log("  Workspace members:     5");
  console.log("  Products:              2");
  console.log("  Simulations:           2");
  console.log("  Boardroom sessions:    1");
  console.log("  Competitor analyses:   2");
  console.log("  Feature sandboxes:     2");
  console.log("  Predictions:           3");
  console.log("  Roadmaps:              1 (with 4 items)");
  console.log("  Product requirements:  3");
  console.log("  Notifications:         3");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
