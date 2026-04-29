import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    idea: {
      type: Type.OBJECT,
      properties: {
        problem: { type: Type.STRING },
        solution: { type: Type.STRING },
        target_customer: { type: Type.STRING },
        uniqueness: { type: Type.STRING },
        clarity_score: { type: Type.INTEGER, description: "0-10 score" }
      },
      required: ["problem", "solution", "target_customer", "uniqueness", "clarity_score"]
    },
    market: {
      type: Type.OBJECT,
      properties: {
        market_size: { type: Type.STRING },
        demand_score: { type: Type.INTEGER, description: "0-10 score" },
        trend: { type: Type.STRING, description: "growing | stable | declining" },
        top_competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
        competition_score: { type: Type.INTEGER, description: "0-10 score" },
        gap_opportunity: { type: Type.STRING }
      },
      required: ["market_size", "demand_score", "trend", "top_competitors", "competition_score", "gap_opportunity"]
    },
    legal: {
      type: Type.OBJECT,
      properties: {
        risk_level: { type: Type.STRING, description: "low | medium | high" },
        pakistan_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
        us_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
        eu_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
        licenses_required: { type: Type.ARRAY, items: { type: Type.STRING } },
        compliance_advice: { type: Type.STRING }
      },
      required: ["risk_level", "pakistan_issues", "us_issues", "eu_issues", "licenses_required", "compliance_advice"]
    },
    monetization: {
      type: Type.OBJECT,
      properties: {
        business_model: { type: Type.STRING },
        pricing_strategy: { type: Type.STRING },
        revenue_streams: { type: Type.ARRAY, items: { type: Type.STRING } },
        estimated_margin: { type: Type.STRING },
        monetization_score: { type: Type.INTEGER, description: "0-10 score" }
      },
      required: ["business_model", "pricing_strategy", "revenue_streams", "estimated_margin", "monetization_score"]
    },
    investor: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        killer_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        success_probability: { type: Type.INTEGER, description: "0-100 score" },
        investment_score: { type: Type.INTEGER, description: "0-100 score" },
        final_decision: { type: Type.STRING, description: "BUILD | BUILD WITH CAUTION | DO NOT BUILD" },
        reasoning: { type: Type.STRING },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["strengths", "weaknesses", "killer_risks", "success_probability", "investment_score", "final_decision", "reasoning", "improvements"]
    },
    pitch: {
      type: Type.OBJECT,
      properties: {
        one_liner: { type: Type.STRING },
        problem: { type: Type.STRING },
        solution: { type: Type.STRING },
        market: { type: Type.STRING },
        business_model: { type: Type.STRING },
        why_now: { type: Type.STRING },
        vision: { type: Type.STRING }
      },
      required: ["one_liner", "problem", "solution", "market", "business_model", "why_now", "vision"]
    }
  },
  required: ["idea", "market", "legal", "monetization", "investor", "pitch"]
};

export interface VCReport {
  idea: { problem: string; solution: string; target_customer: string; uniqueness: string; clarity_score: number; };
  market: { market_size: string; demand_score: number; trend: string; top_competitors: string[]; competition_score: number; gap_opportunity: string; };
  legal: { risk_level: string; pakistan_issues: string[]; us_issues: string[]; eu_issues: string[]; licenses_required: string[]; compliance_advice: string; };
  monetization: { business_model: string; pricing_strategy: string; revenue_streams: string[]; estimated_margin: string; monetization_score: number; };
  investor: { strengths: string[]; weaknesses: string[]; killer_risks: string[]; success_probability: number; investment_score: number; final_decision: string; reasoning: string; improvements: string[]; };
  pitch: { one_liner: string; problem: string; solution: string; market: string; business_model: string; why_now: string; vision: string; };
}

export async function validateStartupIdea(idea: string, brutallyHonest: boolean): Promise<VCReport> {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `You are an elite AI Startup Validator used by top-tier venture capital firms.
Your job is to evaluate startup ideas with extreme clarity, realism, and brutal honesty.
You must think like: Y Combinator Partner, Sequoia Capital Investor, McKinsey Business Analyst.

Rules:
- No fluff, no generic advice
- Always give data-backed reasoning
- Highlight risks aggressively
- Give actionable improvements
- Output MUST match the requested structured JSON schema

Evaluation Criteria:
1. Problem Clarity
2. Market Demand
3. Competition Intensity
4. Legal & Compliance Risk (Pakistan, US, EU)
5. Revenue Potential
6. Scalability
7. Execution Difficulty
8. Failure Probability
9. Investment Score (0–100)

Final Judgment must be one of:
- BUILD
- BUILD WITH CAUTION
- DO NOT BUILD

${brutallyHonest ? "CRITICAL: The user has enabled 'Brutally Honest Mode'. DO NOT hold back. If the idea is terrible, tear it apart constructively but ruthlessly. Identify fatal flaws that founders ignore." : ""}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: idea,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2, // low temp for analytical focus
      }
    });

    const text = response.text();
    if (!text) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as VCReport;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to validate idea. Please try again.");
  }
}
