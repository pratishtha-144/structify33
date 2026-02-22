import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Stakeholder {
  name: string;
  role: string;
  influence: "High" | "Medium" | "Low";
  interest: "High" | "Medium" | "Low";
}

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  ambiguity?: string;
}

export interface BRDData {
  projectName: string;
  version: string;
  executiveSummary: string;
  businessObjectives: string[];
  stakeholders: Stakeholder[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: string[];
  assumptions: string[];
  risks: string[];
  timeline: { phase: string; description: string }[];
  successMetrics: string[];
}

const PROMPT_TEMPLATE = `
You are an expert Business Analyst. Analyze the following project documents and generate a comprehensive Business Requirements Document (BRD).

DOCUMENTS:
---
{CONTENT}
---

Return a VALID JSON object (and ONLY the JSON, no markdown, no code fences, no explanation) following this exact structure:

{
  "projectName": "Short descriptive project name extracted from the documents",
  "version": "1.0",
  "executiveSummary": "A concise 2-4 sentence executive summary of the project.",
  "businessObjectives": [
    "Objective 1 as a clear, actionable statement",
    "Objective 2"
  ],
  "stakeholders": [
    { "name": "Full Name", "role": "Job Title", "influence": "High", "interest": "Medium" }
  ],
  "functionalRequirements": [
    { "id": "FR-01", "title": "Short title", "description": "Detailed description", "ambiguity": "Optional: describe any ambiguity found, or omit this field if none" }
  ],
  "nonFunctionalRequirements": [
    "NFR-01: Performance – System shall respond within 2 seconds under normal load."
  ],
  "assumptions": [
    "Assumption 1"
  ],
  "risks": [
    "Risk 1: Description of the risk and its potential impact."
  ],
  "timeline": [
    { "phase": "Phase 1 – Discovery", "description": "Requirements gathering and stakeholder interviews." }
  ],
  "successMetrics": [
    "Metric 1: Description of how success will be measured."
  ]
}

Rules:
- Extract real information from the documents provided. Do not invent details not present in the source text.
- If a section cannot be determined from the documents, provide a reasoned placeholder based on what IS available.
- influence and interest fields must be exactly one of: "High", "Medium", or "Low"
- Return ONLY the raw JSON. Do not wrap it in markdown or code blocks.
`;

export async function generateBRD(fileContents: string): Promise<BRDData> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // gemini-1.5-flash is the latest stable, fast, and cost-effective model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = PROMPT_TEMPLATE.replace("{CONTENT}", fileContents.trim());

  console.log("[Structify] Sending request to Gemini API...");

  const result = await model.generateContent(prompt);
  const response = result.response;
  const rawText = response.text();

  console.log("[Structify] Raw Gemini response:", rawText);

  // Strip potential markdown code fences if the model adds them despite instructions
  const jsonString = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: BRDData;
  try {
    parsed = JSON.parse(jsonString) as BRDData;
  } catch (parseErr) {
    console.error("[Structify] Failed to parse Gemini JSON response:", jsonString);
    throw new Error("Gemini returned an invalid JSON response. Check console for details.");
  }

  return parsed;
}