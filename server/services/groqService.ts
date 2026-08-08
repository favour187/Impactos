import Groq from 'groq-sdk';
import { inspectUrl } from './urlInspector.js';

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
You are IMPACTOS, an expert Real-World Risk & Danger Detection Platform powered by Groq AI.
Your central mission is answering: "Could there be a danger here?"

When analyzing real-world inputs (text messages, images, URLs, documents, contracts, or situation reports):
1. Carefully assess for physical hazards, digital phishing/scams, financial traps, environmental threats, structural issues, electrical dangers, road hazards, manipulative language, agricultural diseases, housing contract traps, or health concerns.
2. YOU MUST RETURN ONLY A STRICT VALID JSON OBJECT matching this exact schema:

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
    "Practical, actionable step-by-step next steps for the user"
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

Return strictly JSON. Do not enclose in markdown code blocks (\`\`\`json) or extra conversational text.
`;

export async function analyzeRisk(payload: AnalyzePayload): Promise<RiskAnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return {
      overallRisk: 'UNKNOWN',
      riskScore: 0,
      category: 'OTHER',
      summary: 'Groq API key is not configured on the backend server. Please set the GROQ_API_KEY environment variable in your server configuration (e.g. Render dashboard or .env file). Get a free instant key at console.groq.com/keys',
      warningSigns: [],
      possibleConsequences: [
        'Live AI screening requires an active GROQ_API_KEY configured in environment variables.'
      ],
      recommendedActions: [
        'Get a free Groq API key at console.groq.com/keys',
        'Add GROQ_API_KEY=your_key to your Render environment variables or .env file.',
        'Restart the application server.'
      ],
      questionsToVerify: [
        'Is GROQ_API_KEY set in process.env?'
      ],
      confidence: 0,
      limitations: [
        'No Groq API key provided to perform live inference.'
      ],
      analyzedAt: new Date().toISOString()
    };
  }

  try {
    const groq = new Groq({ apiKey });

    let userPromptText = `Input Type: ${payload.inputType}\n`;
    if (payload.location) userPromptText += `Location Context: ${payload.location}\n`;
    if (payload.context) userPromptText += `User Question / Context: ${payload.context}\n`;

    // Special handling for URL inputs: Perform safe non-destructive domain inspection first!
    if (payload.inputType === 'url' && payload.content) {
      const urlResult = inspectUrl(payload.content);
      userPromptText += `\nSAFE URL DOMAIN INSPECTION RESULTS:\nURL: ${urlResult.url}\nHostname: ${urlResult.hostname}\nUses HTTPS: ${urlResult.usesHttps}\nIs Raw IP: ${urlResult.isIpAddress}\nRisk Score: ${urlResult.riskScore}/100\nSuspicious Indicators: ${urlResult.suspiciousIndicators.join('; ')}\n`;
    } else if (payload.content) {
      userPromptText += `Content:\n"""\n${payload.content}\n"""\n`;
    }

    let userMessageContent: any = userPromptText;
    let selectedModel = 'llama-3.3-70b-versatile';

    // If an image is provided, attempt Groq Vision model
    if (payload.imageBase64) {
      selectedModel = 'llama-3.2-11b-vision-preview';

      let formattedDataUrl = payload.imageBase64;
      if (!formattedDataUrl.startsWith('data:')) {
        const mime = payload.imageMimeType || 'image/jpeg';
        formattedDataUrl = `data:${mime};base64,${payload.imageBase64}`;
      }

      userMessageContent = [
        { type: 'text', text: userPromptText },
        {
          type: 'image_url',
          image_url: {
            url: formattedDataUrl
          }
        }
      ];
    }

    // Try primary selected model, fallback to llama-3.3-70b-versatile if vision preview hits tier limits
    const modelsToTry = selectedModel.includes('vision')
      ? ['llama-3.2-11b-vision-preview', 'llama-3.3-70b-versatile']
      : ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const isVision = modelName.includes('vision');
        const contentBody = isVision ? userMessageContent : userPromptText;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: contentBody }
          ],
          model: modelName,
          temperature: 0.2,
          response_format: isVision ? undefined : { type: 'json_object' }
        });

        const responseText = chatCompletion.choices[0]?.message?.content || '';
        const parsed = parseGroqResponse(responseText);

        if (parsed) {
          return {
            ...parsed,
            analyzedAt: new Date().toISOString()
          };
        }
      } catch (err: any) {
        console.error(`Groq API Error with model ${modelName}:`, err);
        lastError = err;
      }
    }

    throw lastError || new Error('Failed to complete Groq API inference.');

  } catch (error: any) {
    console.error('Groq API Error:', error);
    return {
      overallRisk: 'UNKNOWN',
      riskScore: 0,
      category: 'OTHER',
      summary: `Groq AI API error: ${error.message || 'Unknown error'}.`,
      warningSigns: [],
      possibleConsequences: ['Automated risk screening could not be completed.'],
      recommendedActions: ['Verify GROQ_API_KEY permissions at console.groq.com or try submitting again.'],
      questionsToVerify: [],
      confidence: 0,
      limitations: ['API error occurred during Groq inference.'],
      analyzedAt: new Date().toISOString()
    };
  }
}

export async function answerFollowupQuestion(
  userQuery: string,
  context: { category: string; overallRisk: string; summary: string; warningSigns: WarningSign[] }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return 'Groq API key is not configured on the backend server. Please add GROQ_API_KEY to process.env to enable live AI responses.';
  }

  try {
    const groq = new Groq({ apiKey });
    const prompt = `
You are IMPACTOS, an expert risk screening assistant.
The user is reviewing a ${context.category} situation assessed at ${context.overallRisk} risk.
Summary: "${context.summary}"

User Follow-Up Question: "${userQuery}"

Provide a concise, practical, helpful 2-3 sentence response offering safety guidance and verification steps.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3
    });

    const replyText = chatCompletion.choices[0]?.message?.content;
    if (replyText) return replyText.trim();
  } catch (err: any) {
    console.error('Groq follow-up chat error:', err);
  }

  return 'Unable to process follow-up request. Please verify GROQ_API_KEY configuration.';
}

function parseGroqResponse(text: string): RiskAnalysisResult | null {
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
    console.error('Failed to parse JSON from Groq response:', text, err);
    return null;
  }
}
