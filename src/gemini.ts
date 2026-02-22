import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const BRD_PROMPT = `You are a senior Business Analyst. Analyze the input documents below and produce a complete, professional Business Requirements Document (BRD).

Structure the output EXACTLY using these section headers (use the exact header text including the ##):

## Executive Summary
## Business Objectives
## Stakeholder Analysis
## Functional Requirements
## Non-Functional Requirements
## Assumptions
## Risks
## Timeline
## Success Metrics

Rules:
- Write real content based ONLY on the provided documents.
- Under "Functional Requirements", prefix each item with FR-01, FR-02 etc.
- Under "Non-Functional Requirements", prefix each item with NFR-01, NFR-02 etc.
- Under "Stakeholder Analysis", list each person as: Name | Role | Influence (High/Medium/Low) | Interest (High/Medium/Low)
- Use bullet points (starting with -) for list items under each section.
- Do NOT use markdown code fences or JSON.
- Do NOT invent a company or project not mentioned in the documents.

INPUT DOCUMENTS:
---
`;

export async function generateBRD(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = BRD_PROMPT + text.trim() + "\n---";

    console.log("[Structify] Calling Gemini API...");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("[Structify] Gemini response received:", responseText.substring(0, 200) + "...");

    return responseText;
  } catch (error) {
    console.error("[Structify] Gemini API Error:", error);
    throw error;
  }
}