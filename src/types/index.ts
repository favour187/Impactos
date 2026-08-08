export type RiskLevel = 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface WarningSign {
  title: string;
  severity: SeverityLevel;
  explanation: string;
}

export interface RiskAnalysisResult {
  overallRisk: RiskLevel;
  riskScore: number; // 0 - 100
  category: string;
  summary: string;
  warningSigns: WarningSign[];
  possibleConsequences: string[];
  recommendedActions: string[];
  questionsToVerify: string[];
  confidence: number; // 0 - 100
  limitations: string[];
  analyzedAt: string;
  isSimulated?: boolean;
}

export type InputType = 'text' | 'image' | 'url' | 'document' | 'voice';

export interface AnalysisInputData {
  inputType: InputType;
  content: string;
  imageFile?: File | null;
  imageBase64?: string;
  location?: string;
  context?: string;
  scenarioId?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  shortDesc: string;
  category: string;
  inputType: InputType;
  sampleInput: string;
  sampleContext?: string;
  sampleLocation?: string;
  sampleImage?: string;
  iconName: string;
}

export interface SectorCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  examples: string[];
  color: string;
}

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latitude: number;
  longitude: number;
  locationName: string;
  imageUrl?: string;
  createdAt: string;
  confirmations: number;
  disagreements: number;
  reporterName: string;
  isVerified: false;
}

export interface HistoryItem {
  id: string;
  title: string;
  inputType: InputType;
  result: RiskAnalysisResult;
  timestamp: string;
}
