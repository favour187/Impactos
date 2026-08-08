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

class CommunityStore {
  private reports: CommunityReport[] = [];

  getAllReports(): CommunityReport[] {
    return this.reports;
  }

  addReport(report: Omit<CommunityReport, 'id' | 'createdAt' | 'confirmations' | 'disagreements' | 'isVerified'>): CommunityReport {
    const newReport: CommunityReport = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
      confirmations: 1,
      disagreements: 0,
      isVerified: false
    };
    this.reports.unshift(newReport);
    return newReport;
  }

  vote(id: string, type: 'confirm' | 'disagree'): CommunityReport | null {
    const report = this.reports.find(r => r.id === id);
    if (!report) return null;
    if (type === 'confirm') {
      report.confirmations += 1;
    } else {
      report.disagreements += 1;
    }
    return report;
  }
}

export const communityStore = new CommunityStore();
