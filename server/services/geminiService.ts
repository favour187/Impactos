import { GoogleGenAI } from '@google/genai';

export interface WarningSign {
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: string;
}

export interface RiskAnalysisResult {
  overallRisk: 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
  riskScore: number;
  category: string;
  summary: string;
  warningSigns: WarningSign[];
  possibleConsequences: string[];
  recommendedActions: string[];
  questionsToVerify: string[];
  confidence: number;
  limitations: string[];
  analyzedAt: string;
}

export interface AnalyzePayload {
  inputType: 'text' | 'image' | 'url' | 'document' | 'voice';
  content?: string;
  imageBase64?: string;
  imageMimeType?: string;
  location?: string;
  context?: string;
  scenarioId?: string;
}

const SYSTEM_PROMPT = `
You are IMPACTOS, an expert Real-World Risk & Danger Analysis Platform.
Your task is to analyze real-world inputs (text, image, URL, document, or situation descriptions) to help users identify potential risks, hazards, scams, suspicious behavior, or safety warning signs.

The central question to answer is: "Could there be a danger here?"

YOU MUST RETURN ONLY A STRICT VALID JSON OBJECT matching this exact schema:

{
  "overallRisk": "LOW" | "CAUTION" | "HIGH" | "CRITICAL" | "UNKNOWN",
  "riskScore": number (integer from 0 to 100, where 0 is completely safe and 100 is critical danger),
  "category": "DIGITAL SAFETY" | "PERSONAL SAFETY" | "PUBLIC SAFETY" | "HOUSING" | "TRANSPORT" | "AGRICULTURE" | "ENVIRONMENT" | "ENERGY" | "BUSINESS" | "FINANCE" | "HEALTH" | "DOCUMENTS" | "OTHER",
  "summary": "Clear, concise 2-3 sentence summary explaining what was evaluated and the key risk assessment.",
  "warningSigns": [
    {
      "title": "Short title of warning sign",
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "explanation": "Clear explanation of why this was flagged as a potential warning sign."
    }
  ],
  "possibleConsequences": [
    "Simple human-language explanation of potential negative outcomes or risks"
  ],
  "recommendedActions": [
    "Practical, actionable next steps for the user"
  ],
  "questionsToVerify": [
    "Specific questions the user should ask or investigate to verify safety"
  ],
  "confidence": number (integer from 0 to 100),
  "limitations": [
    "Explicit statement of what could not be determined from the provided input alone"
  ]
}

SAFETY & TONE GUIDELINES:
- Use prudent, objective language: "Potential risk detected", "Possible warning sign", "This may indicate", "Further verification is recommended".
- Avoid absolute declarative accusations: Do not say "This definitely contains malware", "This person is a scammer", or "You will be harmed".
- For medical, legal, structural, electrical, agricultural, or emergency situations, include standard screening disclaimers.
- If the input is completely ambiguous or unreadable, set overallRisk to "UNKNOWN", riskScore to 0, confidence to 0, and explain what additional context is required.

Do NOT include markdown formatting (\`\`\`json) or extra text outside the JSON object.
`;

export async function analyzeRisk(payload: AnalyzePayload): Promise<RiskAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return {
      overallRisk: 'UNKNOWN',
      riskScore: 0,
      category: 'OTHER',
      summary: 'Gemini API key is not configured on the backend server. Please set the GEMINI_API_KEY environment variable in your server configuration (e.g. Render dashboard or .env file).',
      warningSigns: [],
      possibleConsequences: [
        'Live AI screening requires an active GEMINI_API_KEY configured in environment variables.'
      ],
      recommendedActions: [
        'Add GEMINI_API_KEY to your Render environment variables or .env file.',
        'Restart the application server.'
      ],
      questionsToVerify: [
        'Is GEMINI_API_KEY present in process.env?'
      ],
      confidence: 0,
      limitations: [
        'No Gemini API key provided to perform live inference.'
      ],
      analyzedAt: new Date().toISOString()
    };
  }

  const ai = new GoogleGenAI({ apiKey });
    
  const contents: any[] = [];
  let promptText = `${SYSTEM_PROMPT}\n\nUSER INPUT FOR RISK ANALYSIS:\nInput Type: ${payload.inputType}\n`;

  if (payload.location) {
    promptText += `Location: ${payload.location}\n`;
  }
  if (payload.context) {
    promptText += `User Context / Question: ${payload.context}\n`;
  }
  if (payload.content) {
    promptText += `Content:\n"""\n${payload.content}\n"""\n`;
  }

  contents.push({ text: promptText });

  if (payload.imageBase64) {
    let cleanBase64 = payload.imageBase64;
    let mimeType = payload.imageMimeType || 'image/jpeg';
    
    if (cleanBase64.includes(';base64,')) {
      const parts = cleanBase64.split(';base64,');
      const mimeMatch = parts[0].match(/data:(.*)/);
      if (mimeMatch) mimeType = mimeMatch[1];
      cleanBase64 = parts[1];
    }

    contents.push({
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    });
  }

  // List of standard supported Gemini models to try in sequence
  const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
      });

      const responseText = response.text || '';
      const parsed = parseGeminiResponse(responseText);

      if (parsed) {
        return {
          ...parsed,
          analyzedAt: new Date().toISOString(),
        };
      }
    } catch (error: any) {
      console.error(`Gemini API Error with model ${modelName}:`, error);
      lastError = error;
    }
  }

  return {
    overallRisk: 'UNKNOWN',
    riskScore: 0,
    category: 'OTHER',
    summary: `Unable to complete AI analysis due to an upstream API error: ${lastError?.message || 'Unknown error'}.`,
    warningSigns: [],
    possibleConsequences: ['Automated risk evaluation was incomplete.'],
    recommendedActions: ['Verify API key permissions or try submitting again.'],
    questionsToVerify: [],
    confidence: 0,
    limitations: ['API error occurred during Gemini inference.'],
    analyzedAt: new Date().toISOString()
  };
}

export async function answerFollowupQuestion(
  userQuery: string,
  context: { category: string; overallRisk: string; summary: string; warningSigns: WarningSign[] }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return 'Gemini API key is not configured on the backend server. Please add GEMINI_API_KEY to process.env to enable live AI responses.';
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
You are IMPACTOS, an expert risk screening assistant.
The user is reviewing a ${context.category} situation assessed at ${context.overallRisk} risk.
Summary: "${context.summary}"

User Follow-Up Question: "${userQuery}"

Provide a concise, practical, helpful 2-3 sentence response offering safety guidance and verification steps.
`;

  const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ text: prompt }]
      });

      if (response.text) return response.text.trim();
    } catch (err: any) {
      console.error(`Error answering follow-up with model ${modelName}:`, err);
    }
  }

  return 'Unable to process follow-up request at this time. Please check backend API configuration.';
}

function parseGeminiResponse(text: string): RiskAnalysisResult | null {
  try {
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const data = JSON.parse(cleanJson);

    if (!data.overallRisk || typeof data.riskScore !== 'number') {
      return null;
    }

    return {
      overallRisk: ['LOW', 'CAUTION', 'HIGH', 'CRITICAL', 'UNKNOWN'].includes(data.overallRisk)
        ? data.overallRisk
        : 'UNKNOWN',
      riskScore: Math.min(100, Math.max(0, data.riskScore || 0)),
      category: data.category || 'OTHER',
      summary: data.summary || 'Analysis complete.',
      warningSigns: Array.isArray(data.warningSigns) ? data.warningSigns : [],
      possibleConsequences: Array.isArray(data.possibleConsequences) ? data.possibleConsequences : [],
      recommendedActions: Array.isArray(data.recommendedActions) ? data.recommendedActions : [],
      questionsToVerify: Array.isArray(data.questionsToVerify) ? data.questionsToVerify : [],
      confidence: Math.min(100, Math.max(0, data.confidence || 75)),
      limitations: Array.isArray(data.limitations) ? data.limitations : [],
      analyzedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to parse JSON from Gemini response:', text, err);
    return null;
  }
}
