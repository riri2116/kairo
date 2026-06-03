/**
 * Emotion Simulator AI layer.
 *
 * Performs REAL analysis of a product journey with Google Gemini — no mock data
 * and no random/placeholder psychology. Given a journey and its ordered steps, it
 * predicts the likely emotional state at each step, scores friction / drop-off /
 * confidence, surfaces UX risks and optimization opportunities, and proposes an
 * optimized version of the journey for comparison.
 *
 * Uses the Gemini Developer API via @google/genai (blueprint: javascript_gemini).
 * Requires GEMINI_API_KEY. Errors (missing key, quota, etc.) propagate to the
 * route so they can be surfaced to the user — we never silently fabricate output.
 */

export const EMOTION_TYPES = [
  "EXCITED",
  "CURIOUS",
  "CONFIDENT",
  "CONFUSED",
  "FRUSTRATED",
  "OVERWHELMED",
  "DELIGHTED",
] as const;
export type EmotionType = (typeof EMOTION_TYPES)[number];

export const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const OPTIMIZATION_CATEGORIES = [
  "SIMPLIFICATION",
  "ONBOARDING",
  "GUIDANCE",
  "FLOW_IMPROVEMENT",
] as const;
export type OptimizationCategory = (typeof OPTIMIZATION_CATEGORIES)[number];

export interface TimelinePoint {
  order: number;
  title: string;
  expectedEmotion: EmotionType;
  confidenceScore: number; // 0–100
  frictionLevel: number; // 0–100
  dropOffRisk: number; // 0–100
  reasoning: string;
}

export interface OptimizedStep {
  order: number;
  title: string;
  expectedEmotion: EmotionType;
  frictionLevel: number;
  dropOffRisk: number;
  change: string;
}

export interface EmotionMetrics {
  avgFrictionScore: number;
  dropOffRisk: number;
  confidenceScore: number;
  delightScore: number;
  activationPotential: number;
}

export interface UXRiskResult {
  area: string;
  level: RiskLevel;
  description: string;
  stepReference: string | null;
}

export interface OptimizationResult {
  category: OptimizationCategory;
  title: string;
  description: string;
  expectedImpact: string | null;
  priority: RiskLevel;
}

export interface EmotionAnalysisResult {
  summary: string;
  timeline: TimelinePoint[];
  metrics: EmotionMetrics;
  overallRisk: RiskLevel;
  risks: UXRiskResult[];
  suggestions: OptimizationResult[];
  optimizedJourney: {
    summary: string;
    steps: OptimizedStep[];
    metrics: EmotionMetrics;
  };
}

export interface JourneyForAnalysis {
  name: string;
  type: string;
  description?: string | null;
  productName?: string | null;
  steps: { order: number; title: string; description?: string | null }[];
}

// ── normalization helpers ─────────────────────────────────────────────────────

function clamp(n: unknown, min = 0, max = 100): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.min(max, Math.max(min, Math.round(v)));
}

function normEmotion(v: unknown): EmotionType {
  const up = String(v ?? "").trim().toUpperCase();
  return (EMOTION_TYPES as readonly string[]).includes(up)
    ? (up as EmotionType)
    : "CURIOUS";
}

function normRisk(v: unknown): RiskLevel {
  const up = String(v ?? "").trim().toUpperCase();
  return (RISK_LEVELS as readonly string[]).includes(up)
    ? (up as RiskLevel)
    : "MEDIUM";
}

function normCategory(v: unknown): OptimizationCategory {
  const up = String(v ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  return (OPTIMIZATION_CATEGORIES as readonly string[]).includes(up)
    ? (up as OptimizationCategory)
    : "FLOW_IMPROVEMENT";
}

function normMetrics(m: any): EmotionMetrics {
  return {
    avgFrictionScore: clamp(m?.avgFrictionScore),
    dropOffRisk: clamp(m?.dropOffRisk),
    confidenceScore: clamp(m?.confidenceScore),
    delightScore: clamp(m?.delightScore),
    activationPotential: clamp(m?.activationPotential),
  };
}

function deriveMetricsFromTimeline(timeline: TimelinePoint[]): EmotionMetrics {
  if (timeline.length === 0) {
    return {
      avgFrictionScore: 0,
      dropOffRisk: 0,
      confidenceScore: 0,
      delightScore: 0,
      activationPotential: 0,
    };
  }
  const avg = (xs: number[]) =>
    Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
  const friction = avg(timeline.map((t) => t.frictionLevel));
  const dropOff = Math.max(...timeline.map((t) => t.dropOffRisk));
  const confidence = avg(timeline.map((t) => t.confidenceScore));
  const positive = timeline.filter((t) =>
    ["EXCITED", "CONFIDENT", "DELIGHTED", "CURIOUS"].includes(t.expectedEmotion)
  ).length;
  const delight = clamp((positive / timeline.length) * 100);
  const activation = clamp(100 - friction * 0.5 - dropOff * 0.5);
  return {
    avgFrictionScore: friction,
    dropOffRisk: dropOff,
    confidenceScore: confidence,
    delightScore: delight,
    activationPotential: activation,
  };
}

const SYSTEM_PROMPT = `You are a senior UX researcher and product experience analyst at a top product company (think Notion, Linear, Stripe, Airbnb). You analyze user journeys to predict the emotional experience at each step, grounded in established UX and behavioral-design principles (cognitive load, decision fatigue, the peak-end rule, time-on-task, clarity of next action, perceived progress).

You never invent pop-psychology. Your assessments must be reasoned from concrete properties of each step: number of decisions, complexity, required effort, clarity, friction sources, and where users are likely to abandon. Respond with valid JSON only.`;

function buildUserPrompt(journey: JourneyForAnalysis): string {
  const stepLines = journey.steps
    .map(
      (s) =>
        `  ${s.order}. ${s.title}${s.description ? ` — ${s.description}` : ""}`
    )
    .join("\n");

  return `Analyze this user journey and predict the emotional experience at each step.

JOURNEY
Name: ${journey.name}
Type: ${journey.type}
${journey.productName ? `Product: ${journey.productName}\n` : ""}${journey.description ? `Context: ${journey.description}\n` : ""}
STEPS (in order)
${stepLines}

Allowed emotions (use EXACTLY one per step): EXCITED, CURIOUS, CONFIDENT, CONFUSED, FRUSTRATED, OVERWHELMED, DELIGHTED.

Return a JSON object with EXACTLY these keys:
{
  "summary": "2-3 sentence overview of the emotional arc and the biggest experience risk",
  "timeline": [
    {
      "order": <step number>,
      "title": "<step title>",
      "expectedEmotion": "<one allowed emotion>",
      "confidenceScore": <0-100 how confident a user feels they can succeed at this step>,
      "frictionLevel": <0-100 effort/complexity/cognitive load at this step>,
      "dropOffRisk": <0-100 likelihood the user abandons at this step>,
      "reasoning": "1-2 sentences citing the concrete cause (decisions, complexity, clarity, effort)"
    }
  ],
  "metrics": {
    "avgFrictionScore": <0-100 average friction across the journey>,
    "dropOffRisk": <0-100 overall likelihood of abandonment somewhere in the journey>,
    "confidenceScore": <0-100 average user confidence>,
    "delightScore": <0-100 how delightful/positive the overall experience is>,
    "activationPotential": <0-100 likelihood the user reaches the journey's success outcome>
  },
  "overallRisk": "LOW|MEDIUM|HIGH|CRITICAL",
  "risks": [
    { "area": "<short name of the problem area>", "level": "LOW|MEDIUM|HIGH|CRITICAL", "description": "what is wrong and why it hurts the experience", "stepReference": "<step title or null>" }
  ],
  "suggestions": [
    { "category": "SIMPLIFICATION|ONBOARDING|GUIDANCE|FLOW_IMPROVEMENT", "title": "<concise opportunity>", "description": "concrete recommendation", "expectedImpact": "<expected effect on friction/drop-off/activation>", "priority": "LOW|MEDIUM|HIGH|CRITICAL" }
  ],
  "optimizedJourney": {
    "summary": "how the optimized flow improves the emotional arc",
    "steps": [
      { "order": <n>, "title": "<improved/merged step title>", "expectedEmotion": "<allowed emotion>", "frictionLevel": <0-100>, "dropOffRisk": <0-100>, "change": "what changed vs the current step" }
    ],
    "metrics": { "avgFrictionScore": <0-100>, "dropOffRisk": <0-100>, "confidenceScore": <0-100>, "delightScore": <0-100>, "activationPotential": <0-100> }
  }
}

Provide one timeline entry per input step (same order). Provide 2-5 risks and 2-5 suggestions. The optimized journey should measurably reduce friction and drop-off versus the current one.`;
}

export async function runEmotionAnalysis(
  journey: JourneyForAnalysis
): Promise<EmotionAnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  if (!journey.steps || journey.steps.length === 0) {
    throw new Error("Journey has no steps to analyze");
  }

  // Gemini Developer API — blueprint: javascript_gemini (@google/genai)
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      temperature: 0.5,
    },
    contents: buildUserPrompt(journey),
  });

  const raw = JSON.parse(response.text ?? "{}");

  // ── normalize timeline (align to input steps, fill any gaps) ────────────────
  const rawTimeline: any[] = Array.isArray(raw.timeline) ? raw.timeline : [];
  const byOrder = new Map<number, any>();
  rawTimeline.forEach((t) => {
    const o = Number(t?.order);
    if (Number.isFinite(o)) byOrder.set(o, t);
  });

  const timeline: TimelinePoint[] = journey.steps.map((step, i) => {
    const t = byOrder.get(step.order) ?? rawTimeline[i] ?? {};
    return {
      order: step.order,
      title: step.title,
      expectedEmotion: normEmotion(t.expectedEmotion),
      confidenceScore: clamp(t.confidenceScore),
      frictionLevel: clamp(t.frictionLevel),
      dropOffRisk: clamp(t.dropOffRisk),
      reasoning: String(t.reasoning ?? "").trim(),
    };
  });

  // ── metrics (prefer model output, fall back to derived) ─────────────────────
  const hasMetrics =
    raw.metrics && typeof raw.metrics === "object" && raw.metrics !== null;
  const metrics = hasMetrics
    ? normMetrics(raw.metrics)
    : deriveMetricsFromTimeline(timeline);

  // ── risks ───────────────────────────────────────────────────────────────────
  const risks: UXRiskResult[] = (Array.isArray(raw.risks) ? raw.risks : [])
    .filter((r: any) => r && (r.area || r.description))
    .map((r: any) => ({
      area: String(r.area ?? "Unspecified area").trim(),
      level: normRisk(r.level),
      description: String(r.description ?? "").trim(),
      stepReference:
        r.stepReference && String(r.stepReference).trim()
          ? String(r.stepReference).trim()
          : null,
    }));

  // ── suggestions ──────────────────────────────────────────────────────────────
  const suggestions: OptimizationResult[] = (
    Array.isArray(raw.suggestions) ? raw.suggestions : []
  )
    .filter((s: any) => s && (s.title || s.description))
    .map((s: any) => ({
      category: normCategory(s.category),
      title: String(s.title ?? "Opportunity").trim(),
      description: String(s.description ?? "").trim(),
      expectedImpact:
        s.expectedImpact && String(s.expectedImpact).trim()
          ? String(s.expectedImpact).trim()
          : null,
      priority: normRisk(s.priority),
    }));

  // ── optimized journey ────────────────────────────────────────────────────────
  const optRaw = raw.optimizedJourney ?? {};
  const optSteps: OptimizedStep[] = (
    Array.isArray(optRaw.steps) ? optRaw.steps : []
  ).map((s: any, i: number) => ({
    order: Number.isFinite(Number(s?.order)) ? Number(s.order) : i + 1,
    title: String(s?.title ?? `Step ${i + 1}`).trim(),
    expectedEmotion: normEmotion(s?.expectedEmotion),
    frictionLevel: clamp(s?.frictionLevel),
    dropOffRisk: clamp(s?.dropOffRisk),
    change: String(s?.change ?? "").trim(),
  }));

  const optMetrics =
    optRaw.metrics && typeof optRaw.metrics === "object"
      ? normMetrics(optRaw.metrics)
      : deriveMetricsFromTimeline(
          optSteps.map((s) => ({
            order: s.order,
            title: s.title,
            expectedEmotion: s.expectedEmotion,
            confidenceScore: 100 - s.frictionLevel,
            frictionLevel: s.frictionLevel,
            dropOffRisk: s.dropOffRisk,
            reasoning: "",
          }))
        );

  return {
    summary: String(raw.summary ?? "").trim(),
    timeline,
    metrics,
    overallRisk: normRisk(raw.overallRisk),
    risks,
    suggestions,
    optimizedJourney: {
      summary: String(optRaw.summary ?? "").trim(),
      steps: optSteps,
      metrics: optMetrics,
    },
  };
}
