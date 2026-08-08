import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { RiskAnalysisResult } from '../types';

interface AudioBriefingButtonProps {
  result: RiskAnalysisResult;
}

export const AudioBriefingButton: React.FC<AudioBriefingButtonProps> = ({ result }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const speakBriefing = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textText = `IMPACTOS Risk Briefing. Category: ${result.category}. Overall risk level is ${result.overallRisk}, with a risk score of ${result.riskScore} out of 100. ${result.summary}. Key warning signs include: ${result.warningSigns.map(s => s.title).join(', ')}.`;

    const utterance = new SpeechSynthesisUtterance(textText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={speakBriefing}
      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
        isPlaying
          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
          : 'bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30'
      }`}
      title="Listen to Audio Risk Briefing"
    >
      {isPlaying ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
      <span>{isPlaying ? 'Stop Audio Briefing' : '🔊 Listen to Audio Briefing'}</span>
    </button>
  );
};
