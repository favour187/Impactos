import React, { useState } from 'react';
import { RiskAnalysisResult } from '../types';
import { MessageSquare, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface RiskChatAssistantProps {
  analysisResult: RiskAnalysisResult;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const RiskChatAssistant: React.FC<RiskChatAssistantProps> = ({ analysisResult }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello! I am your IMPACTOS AI Assistant. I have evaluated this ${analysisResult.category} situation. Feel free to ask me follow-up questions like "How do I safely report this?" or "What should I tell the counterparty?"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isTyping) return;

    const userText = inputQuery.trim();
    const userMsg: ChatMessage = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: userText,
          category: analysisResult.category,
          overallRisk: analysisResult.overallRisk,
          summary: analysisResult.summary,
          warningSigns: analysisResult.warningSigns
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          sender: 'ai',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Failed to fetch AI reply');
      }
    } catch (err) {
      // Fallback response
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: `Regarding your question about this ${analysisResult.category} situation: It is best to maintain caution, refrain from sharing financial details or touching hazards, and verify credentials through official channels.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Ask AI Follow-Up Questions
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              INTERACTIVE CHAT
            </span>
          </h3>
          <p className="text-xs text-slate-400">Ask Gemini AI for specific advice regarding this flagged situation.</p>
        </div>
      </div>

      {/* Messages Window */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2.5 text-xs ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-blue-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1 block text-right">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Gemini AI is formulating response...</span>
          </div>
        )}
      </div>

      {/* Query Input */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="e.g. 'What exact steps should I take if I already replied?'"
          className="grow rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
