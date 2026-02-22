import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ─── Live Gemini API call ────────────────────────────────────────────────────
export async function generateBRD(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a senior Business Analyst.
Analyze the following input documents and generate a complete, professional Business Requirements Document (BRD).

Structure your output EXACTLY with these section headers:

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
- Use bullet points (starting with -) for list items.
- Under Functional Requirements, prefix each item: FR-01, FR-02 ...
- Under Non-Functional Requirements, prefix each item: NFR-01, NFR-02 ...
- Under Stakeholder Analysis format each row as: Name | Role | Influence | Interest
- Do NOT use JSON or markdown code fences.

INPUT DOCUMENTS:
---
${text.trim()}
---`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("[Structify] Gemini response received.");
    return responseText;
  } catch (error) {
    console.error("[Structify] Gemini API Error:", error);
    throw error;
  }
}

// ─── Demo Mode (no API needed) ───────────────────────────────────────────────
export function generateDemoBRD(uploadedText?: string): string {
  // If user uploaded files with actual content, personalise the project name
  const hasContent = uploadedText && uploadedText.trim().length > 50;
  const projectLabel = hasContent ? "Uploaded Project" : "Project Alpha";

  return `## Executive Summary
Structify is an AI-powered platform — ${projectLabel} — designed to convert unstructured project data (meeting transcripts, emails, and documents) into a fully structured Business Requirements Document. By leveraging advanced NLP techniques, Structify dramatically reduces the time and effort required for manual documentation, ensuring all stakeholder decisions and requirements are captured accurately and traceably.

## Business Objectives
- Automate BRD creation from raw project communications and documents
- Reduce manual documentation effort by at least 70%
- Improve requirement clarity and reduce rework due to missed specifications
- Enable real-time collaboration between Business Analysts and stakeholders
- Provide a traceable link between source documents and generated requirements

## Stakeholder Analysis
- John Smith | Project Sponsor | High | High
- Sarah Johnson | Business Analyst | High | High
- David Chen | Lead Developer | Medium | High
- Emily Ross | Product Manager | High | Medium
- Client Representative | External Stakeholder | High | Low

## Functional Requirements
- FR-01: The system shall allow users to upload meeting transcripts in .txt and .pdf format
- FR-02: The system shall allow users to upload project emails in .txt and .eml format
- FR-03: The system shall allow users to upload existing documents in .pdf and .docx format
- FR-04: The system shall extract key requirements, decisions, and stakeholders from all uploaded content
- FR-05: The system shall generate a structured, sectioned BRD from the extracted information
- FR-06: The system shall export the generated BRD as a formatted PDF document
- FR-07: The system shall provide an AI chat assistant for inline BRD refinement

## Non-Functional Requirements
- NFR-01: Performance – BRD generation shall complete within 30 seconds for inputs up to 50 pages
- NFR-02: Security – All uploaded files shall be processed in-memory and not persisted to disk
- NFR-03: Usability – The interface shall be fully responsive on desktop, tablet, and mobile viewports
- NFR-04: Reliability – The system shall have 99.9% uptime with graceful degradation on API failure
- NFR-05: Accessibility – The UI shall meet WCAG 2.1 AA accessibility standards

## Assumptions
- Users will provide documents in the supported formats (.txt, .pdf, .docx, .eml)
- The uploaded content will be in English
- Users have stable internet connectivity for API communication
- Stakeholders have been identified before the BRD generation process begins
- The Gemini API key provided has sufficient quota for the expected usage

## Risks
- Incorrect or incomplete input data may lead to missing requirements in the generated BRD
- API rate limits or outages could cause generation failures during peak usage
- Scanned PDFs without OCR text layers will not be readable by the extraction engine
- Ambiguous stakeholder mentions in transcripts may result in duplicate or misattributed entries
- Users may over-rely on AI output without reviewing for domain-specific accuracy

## Timeline
- Phase 1 – Discovery & Setup: Requirements gathering, environment configuration, and stakeholder interviews (Week 1–2)
- Phase 2 – Upload System: Implement multi-source file ingestion with drag-and-drop UI (Week 3–4)
- Phase 3 – AI Processing Engine: Integrate Gemini API, build extraction and classification pipeline (Week 5–7)
- Phase 4 – BRD Generation: Build structured output renderer and section parser (Week 8–9)
- Phase 5 – Export & Polish: PDF/DOCX export, UI polish, performance tuning, UAT (Week 10–12)

## Success Metrics
- 90%+ of generated BRDs rated "accurate" or "mostly accurate" by Business Analysts in user testing
- Average BRD generation time under 20 seconds for standard inputs
- Zero data leakage incidents in production (measured by security audit)
- 80%+ reduction in time-to-BRD compared to manual process (measured via user surveys)
- Net Promoter Score (NPS) of 40+ within the first quarter of launch
`;
}