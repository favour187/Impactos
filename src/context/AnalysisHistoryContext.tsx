import React, { createContext, useContext, useState, useEffect } from 'react';
import { HistoryItem, RiskAnalysisResult, InputType } from '../types';

interface AnalysisHistoryContextType {
  history: HistoryItem[];
  addHistoryItem: (result: RiskAnalysisResult, inputType: InputType, title: string) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  stats: {
    totalAnalyses: number;
    highRiskDetected: number;
    hazardsIdentified: number;
    categoriesExplored: number;
  };
  patternsNoticed: string[];
}

const AnalysisHistoryContext = createContext<AnalysisHistoryContextType | undefined>(undefined);

export const AnalysisHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('impactos_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('impactos_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const addHistoryItem = (result: RiskAnalysisResult, inputType: InputType, title: string) => {
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      title: title || `${result.category} Analysis`,
      inputType,
      result,
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Compute live statistics based on real user history
  const totalAnalyses = history.length;
  const highRiskDetected = history.filter(h => h.result.overallRisk === 'HIGH' || h.result.overallRisk === 'CRITICAL').length;
  const hazardsIdentified = history.reduce((acc, h) => acc + (h.result.warningSigns?.length || 0), 0);
  const categoriesExplored = new Set(history.map(h => h.result.category)).size;

  // Compute smart activity insights strictly from actual user activity
  const generatePatternsNoticed = (): string[] => {
    if (history.length === 0) {
      return ["No recent analysis activity recorded yet. Submit a text message, image, URL, or document to begin tracking risk patterns."];
    }

    const patterns: string[] = [];
    const categoryCounts: Record<string, number> = {};
    let totalHighRisk = 0;

    history.forEach(item => {
      const cat = item.result.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      if (item.result.overallRisk === 'HIGH' || item.result.overallRisk === 'CRITICAL') {
        totalHighRisk++;
      }
    });

    const topCat = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
      patterns.push(`Your most frequent area of risk assessment is ${topCat[0]} (${topCat[1]} analysis submissions).`);
    }

    if (totalHighRisk > 0) {
      patterns.push(`${Math.round((totalHighRisk / history.length) * 100)}% of your analyzed situations contained high or critical severity warning signs requiring active mitigation.`);
    }

    patterns.push(`You have screened situations across ${categoriesExplored} distinct sectors.`);

    return patterns;
  };

  return (
    <AnalysisHistoryContext.Provider
      value={{
        history,
        addHistoryItem,
        deleteHistoryItem,
        clearHistory,
        stats: {
          totalAnalyses,
          highRiskDetected,
          hazardsIdentified,
          categoriesExplored
        },
        patternsNoticed: generatePatternsNoticed()
      }}
    >
      {children}
    </AnalysisHistoryContext.Provider>
  );
};

export const useAnalysisHistory = () => {
  const context = useContext(AnalysisHistoryContext);
  if (!context) {
    throw new Error('useAnalysisHistory must be used within AnalysisHistoryProvider');
  }
  return context;
};
