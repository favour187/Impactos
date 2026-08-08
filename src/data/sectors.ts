import { SectorCategory } from '../types';

export const SECTORS: SectorCategory[] = [
  {
    id: 'digital',
    title: 'Digital Safety',
    icon: 'ShieldCheck',
    description: 'Identify online phishing, SMS prize scams, fraudulent URLs, social engineering, and unauthorized credential harvesting.',
    examples: ['SMS prize notifications with fee requests', 'Punycode URL lookalikes', 'Unsolicited OTP requests'],
    color: 'emerald'
  },
  {
    id: 'housing',
    title: 'Housing & Tenancy',
    icon: 'Home',
    description: 'Screen rental lease agreements, deposit conditions, unexpected admin fees, and unverified property claims.',
    examples: ['Unilateral lease termination clauses', 'Hidden non-refundable maintenance fees', 'Subletting restrictions'],
    color: 'indigo'
  },
  {
    id: 'public',
    title: 'Public Safety',
    icon: 'AlertTriangle',
    description: 'Detect physical street hazards, blocked emergency exits, unsafe crowd conditions, and structural warnings.',
    examples: ['Deteriorating building facade', 'Unmarked excavation pits', 'Blocked emergency stairwells'],
    color: 'amber'
  },
  {
    id: 'environment',
    title: 'Environment & Water',
    icon: 'Waves',
    description: 'Screen water accumulation, flash flood channels, chemical runoff indicators, and storm damage hazards.',
    examples: ['Submerged roadway crossings', 'Industrial wastewater discoloration', 'Storm canal blockage'],
    color: 'blue'
  },
  {
    id: 'agriculture',
    title: 'Agriculture & Crops',
    icon: 'Sprout',
    description: 'Analyze crop leaf spot patterns, fungal rust symptoms, soil erosion risk, and livestock distress signs.',
    examples: ['Foliar leaf necrosis on maize', 'Spreading fungal mildew on leaves', 'Pest infestation symptoms'],
    color: 'emerald'
  },
  {
    id: 'energy',
    title: 'Energy & Electrical',
    icon: 'Zap',
    description: 'Spot loose electrical wiring, uninsulated cables, sagging power lines, and transformer box damage.',
    examples: ['Exposed breaker wiring panel', 'Overloaded extension distribution', 'Damaged high-voltage insulator'],
    color: 'yellow'
  },
  {
    id: 'transport',
    title: 'Transport & Roads',
    icon: 'Car',
    description: 'Analyze road washout damage, missing guardrails, severe potholes, and vehicle mechanical warning signs.',
    examples: ['Road embankment gully collapse', 'Unlit night road hazard', 'Missing warning signage'],
    color: 'orange'
  },
  {
    id: 'business',
    title: 'Business Operations',
    icon: 'Store',
    description: 'Detect financial anomalies, cost-profit divergence, supply chain disruption signs, and inventory leaks.',
    examples: ['Revenue rising while profit margin drops', 'Vendor cost escalation', 'Inventory shrinkage patterns'],
    color: 'purple'
  },
  {
    id: 'documents',
    title: 'Documents & Contracts',
    icon: 'FileText',
    description: 'Review legal letters, scholarship offers, service agreements, and invoices for suspicious liabilities.',
    examples: ['Invoices with changed bank details', 'Confusing penalty clauses', 'Missing provider disclosures'],
    color: 'teal'
  },
  {
    id: 'finance',
    title: 'Finance & Investments',
    icon: 'DollarSign',
    description: 'Screen high-yield investment schemes, upfront equipment purchase recruitment traps, and loan scams.',
    examples: ['Guaranteed 50% monthly returns', 'Upfront equipment purchase requirement', 'Unlicensed brokerage'],
    color: 'emerald'
  },
  {
    id: 'health',
    title: 'Health & Wellness',
    icon: 'Heart',
    description: 'Decision support screening for counterfeit drug packaging, unsafe dietary claims, and sanitization hazards.',
    examples: ['Suspicious pharmaceutical seal', 'Unverified medical claims', 'Biological waste disposal hazard'],
    color: 'rose'
  },
  {
    id: 'personal',
    title: 'Personal Safety',
    icon: 'UserCheck',
    description: 'Assess suspicious individual behavior requests, impersonation indicators, and isolated path traversal.',
    examples: ['Impersonation of official personnel', 'Unlit transit corridors', 'High-pressure coercion'],
    color: 'cyan'
  }
];
