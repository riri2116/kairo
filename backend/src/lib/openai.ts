import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

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

const TYPE_LABELS: Record<BrainSubmissionType, string> = {
  PRODUCT_IDEA: "Product Idea",
  FEATURE_IDEA: "Feature Idea",
  PRICING_CHANGE: "Pricing Change",
  GROWTH_EXPERIMENT: "Growth Experiment",
};

function buildPrompt(type: BrainSubmissionType, title: string, input: string): string {
  return `You are a senior product strategist and analyst at a top-tier product consultancy. Analyze the following ${TYPE_LABELS[type]} submission and provide a structured product intelligence report.

## Submission Type: ${TYPE_LABELS[type]}
## Title: ${title}
## Description:
${input}

Provide a detailed analysis in the following JSON format. Each field should be 2-4 sentences of substantive, actionable insight — not generic filler.

{
  "impactAnalysis": "...",
  "riskAssessment": "...",
  "technicalComplexity": "...",
  "revenueImpact": "...",
  "retentionImpact": "...",
  "recommendation": "...",
  "confidenceScore": <number 0-100>,
  "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>"
}

Guidelines:
- impactAnalysis: Overall business and user impact. What changes, who is affected, and how significantly.
- riskAssessment: Key risks — technical, market, execution, and competitive. Be specific.
- technicalComplexity: Engineering effort, dependencies, estimated timeline, and technical debt implications.
- revenueImpact: Projected effect on MRR/ARR, conversion rates, LTV, or pricing leverage. Use realistic ranges.
- retentionImpact: Effect on DAU/MAU, churn, engagement depth, and long-term user loyalty.
- recommendation: Clear GO / NO-GO / ITERATE recommendation with the primary reason and suggested next step.
- confidenceScore: 0-100 score reflecting how confident you are in this analysis given the information provided.
- riskLevel: Overall risk classification.

Return ONLY valid JSON. No markdown, no commentary outside the JSON.`;
}

export async function runBrainAnalysis(
  type: BrainSubmissionType,
  title: string,
  input: string
): Promise<BrainAnalysisResult> {
  const client = getOpenAI();

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a senior product strategist. You always respond with valid JSON only — no markdown fences, no extra text.",
      },
      {
        role: "user",
        content: buildPrompt(type, title, input),
      },
    ],
    temperature: 0.4,
    max_tokens: 1200,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as BrainAnalysisResult;

  if (
    !parsed.impactAnalysis ||
    !parsed.recommendation ||
    typeof parsed.confidenceScore !== "number"
  ) {
    throw new Error("OpenAI returned an incomplete analysis");
  }

  return parsed;
}
