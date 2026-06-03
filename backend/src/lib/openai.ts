/**
 * AI analysis layer.
 * Currently running in MOCK mode — swap MOCK_MODE = false and ensure
 * OPENAI_API_KEY is set to enable live GPT-4o calls.
 */

import { mockBrainAnalysis, BrainSubmissionType, BrainAnalysisResult } from "./mockAI";

const MOCK_MODE = true;

export type { BrainSubmissionType, BrainAnalysisResult };

export async function runBrainAnalysis(
  type: BrainSubmissionType,
  title: string,
  input: string
): Promise<BrainAnalysisResult> {
  if (MOCK_MODE) {
    // Simulate realistic latency so the loading state is visible
    await new Promise(r => setTimeout(r, 1400));
    return mockBrainAnalysis(type, title, input);
  }

  // ── Live OpenAI path ──────────────────────────────────────────────────────
  const { default: OpenAI } = await import("openai");
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const TYPE_LABELS: Record<BrainSubmissionType, string> = {
    PRODUCT_IDEA: "Product Idea",
    FEATURE_IDEA: "Feature Idea",
    PRICING_CHANGE: "Pricing Change",
    GROWTH_EXPERIMENT: "Growth Experiment",
  };

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a senior product strategist. Respond with valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze this ${TYPE_LABELS[type]}: "${title}"\n\n${input}\n\nReturn JSON with keys: impactAnalysis, riskAssessment, technicalComplexity, revenueImpact, retentionImpact, recommendation (each 2-4 sentences), confidenceScore (0-100), riskLevel (LOW|MEDIUM|HIGH|CRITICAL).`,
      },
    ],
    temperature: 0.4,
    max_tokens: 1200,
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0]?.message?.content ?? "{}") as BrainAnalysisResult;
}
