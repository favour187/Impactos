import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AnalysisHistoryProvider } from './context/AnalysisHistoryContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunityPage } from './pages/CommunityPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivacyPage } from './pages/PrivacyPage';

export function App() {
  return (
    <ThemeProvider>
      <AnalysisHistoryProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-blue-600 selection:text-white">
            <Navigation />
            <main className="grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/analyze" element={<AnalyzePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AnalysisHistoryProvider>
    </ThemeProvider>
  );
}

export default App;
