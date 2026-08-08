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

Return strictly raw JSON. Do not enclose in markdown code blocks or extra conversational text.
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

  const parts: any[] = [{ text: promptText }];

  if (payload.imageBase64) {
    let cleanBase64 = payload.imageBase64;
    let mimeType = payload.imageMimeType || 'image/jpeg';
    
    if (cleanBase64.includes(';base64,')) {
      const split = cleanBase64.split(';base64,');
      if (split[0].includes('data:')) {
        mimeType = split[0].replace('data:', '');
      }
      cleanBase64 = split[1];
    }

    parts.push({
      inlineData: {
        mimeType,
        data: cleanBase64
      }
    });
  }

  const requestBody = {
    contents: [
      {
        parts
      }
    ],
    generationConfig: {
      temperature: 0.2
    }
  };

  // REST API Endpoints to try (supports v1beta, v1, gemini-1.5-flash, gemini-2.0-flash, gemini-1.5-pro)
  const endpointsToTry = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`
  ];

  let errors: string[] = [];

  for (const endpoint of endpointsToTry) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const rawText = data.candidates[0].content.parts[0].text;
        const parsed = parseGeminiResponse(rawText);
        if (parsed) {
          return {
            ...parsed,
            analyzedAt: new Date().toISOString()
          };
        }
      } else if (data.error) {
        errors.push(`[${data.error.code || response.status}] ${data.error.message || 'API Error'}`);
      }
    } catch (err: any) {
      errors.push(`Network Error: ${err.message || 'Failed fetch'}`);
    }
  }

  return {
    overallRisk: 'UNKNOWN',
    riskScore: 0,
    category: 'OTHER',
    summary: `Gemini API call failed. Details: ${errors.join(' | ')}`,
    warningSigns: [],
    possibleConsequences: ['Automated risk evaluation could not be completed.'],
    recommendedActions: [
      'Check if your GEMINI_API_KEY is valid and has "Generative Language API" enabled in Google Cloud / AI Studio.',
      'Ensure the key has active quota and no domain restrictions.'
    ],
    questionsToVerify: [],
    confidence: 0,
    limitations: ['API key or endpoint restriction encountered.'],
    analyzedAt: new Date().toISOString()
  };
}

export async function answerFollowupQuestion(
  userQuery: string,
  context: { category: string; overallRisk: string; summary: string; warningSigns: WarningSign[] }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return 'Gemini API key is not configured on the backend server. Please set GEMINI_API_KEY in server environment variables.';
  }

  const promptText = `
You are IMPACTOS, an expert risk screening assistant.
The user is reviewing a ${context.category} situation assessed at ${context.overallRisk} risk.
Summary: "${context.summary}"

User Follow-Up Question: "${userQuery}"

Provide a concise, practical, helpful 2-3 sentence response offering safety guidance and verification steps.
`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ]
  };

  const endpointsToTry = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  ];

  for (const endpoint of endpointsToTry) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (err: any) {
      console.error('Follow-up REST API error:', err);
    }
  }

  return 'Unable to process follow-up request. Please verify GEMINI_API_KEY configuration.';
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
