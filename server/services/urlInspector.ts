export interface UrlInspectionResult {
  url: string;
  hostname: string;
  protocol: string;
  usesHttps: boolean;
  isIpAddress: boolean;
  suspiciousIndicators: string[];
  riskScore: number; // 0 - 100
  assessment: 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
  details: {
    hasMisleadingSubdomains: boolean;
    hasHomographCharacters: boolean;
    hasExcessiveHyphens: boolean;
    hasKeywordsInSubdomain: boolean;
    tldRisk: 'NORMAL' | 'ELEVATED' | 'HIGH';
  };
}

export function inspectUrl(inputUrl: string): UrlInspectionResult {
  let formattedUrl = inputUrl.trim();
  if (!formattedUrl.match(/^[a-zA-Z]+:\/\//)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const parsed = new URL(formattedUrl);
    const hostname = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol;
    const usesHttps = protocol === 'https:';

    const suspiciousIndicators: string[] = [];
    let riskPoints = 0;

    // Check 1: IP address as host
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const isIpAddress = ipPattern.test(hostname);
    if (isIpAddress) {
      suspiciousIndicators.push('URL uses a raw IP address instead of a domain name, commonly used in phishing.');
      riskPoints += 35;
    }

    // Check 2: Misleading subdomains (e.g. paypal.com.secure-login-user.xyz)
    const domainParts = hostname.split('.');
    const hasExcessiveSubdomains = domainParts.length > 3;
    
    const sensitiveKeywords = ['login', 'bank', 'secure', 'verify', 'account', 'update', 'support', 'wallet', 'crypto', 'pay', 'auth'];
    let hasKeywordsInSubdomain = false;

    if (domainParts.length > 2) {
      const subdomains = domainParts.slice(0, domainParts.length - 2).join('.');
      for (const kw of sensitiveKeywords) {
        if (subdomains.includes(kw)) {
          hasKeywordsInSubdomain = true;
          suspiciousIndicators.push(`Subdomain contains security/login keyword ("${kw}") which may indicate brand impersonation.`);
          riskPoints += 25;
          break;
        }
      }
    }

    // Check 3: Homograph characters / punycode
    const hasHomographCharacters = hostname.startsWith('xn--') || /[^\x00-\x7F]/.test(hostname);
    if (hasHomographCharacters) {
      suspiciousIndicators.push('Domain contains special/Punycode characters that can mimic legitimate website names.');
      riskPoints += 30;
    }

    // Check 4: Excessive hyphens or unusual domain structure
    const hyphenCount = (hostname.match(/-/g) || []).length;
    const hasExcessiveHyphens = hyphenCount >= 3;
    if (hasExcessiveHyphens) {
      suspiciousIndicators.push('Domain name contains multiple hyphens, often seen in disposable phishing links.');
      riskPoints += 15;
    }

    // Check 5: Suspicious TLDs
    const tld = domainParts[domainParts.length - 1];
    const suspiciousTlds = ['zip', 'mov', 'top', 'xyz', 'country', 'kim', 'work', 'gq', 'cf', 'tk', 'ml', 'ga', 'click', 'link'];
    let tldRisk: 'NORMAL' | 'ELEVATED' | 'HIGH' = 'NORMAL';
    if (suspiciousTlds.includes(tld)) {
      tldRisk = 'ELEVATED';
      suspiciousIndicators.push(`Domain uses top-level domain (.${tld}) frequently associated with unmonitored bulk registrations.`);
      riskPoints += 15;
    }

    // Check 6: HTTPS missing
    if (!usesHttps) {
      suspiciousIndicators.push('Website uses unencrypted HTTP protocol. Data transmitted is visible to intermediate networks.');
      riskPoints += 20;
    }

    // Risk assessment classification
    let assessment: 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL' | 'UNKNOWN' = 'LOW';
    if (riskPoints >= 60) assessment = 'CRITICAL';
    else if (riskPoints >= 40) assessment = 'HIGH';
    else if (riskPoints >= 20) assessment = 'CAUTION';

    return {
      url: formattedUrl,
      hostname,
      protocol,
      usesHttps,
      isIpAddress,
      suspiciousIndicators,
      riskScore: Math.min(100, riskPoints),
      assessment,
      details: {
        hasMisleadingSubdomains: hasExcessiveSubdomains && hasKeywordsInSubdomain,
        hasHomographCharacters,
        hasExcessiveHyphens,
        hasKeywordsInSubdomain,
        tldRisk,
      },
    };
  } catch (err) {
    return {
      url: inputUrl,
      hostname: 'invalid-domain',
      protocol: 'unknown',
      usesHttps: false,
      isIpAddress: false,
      suspiciousIndicators: ['URL structure is malformed or invalid.'],
      riskScore: 50,
      assessment: 'UNKNOWN',
      details: {
        hasMisleadingSubdomains: false,
        hasHomographCharacters: false,
        hasExcessiveHyphens: false,
        hasKeywordsInSubdomain: false,
        tldRisk: 'NORMAL',
      },
    };
  }
}
