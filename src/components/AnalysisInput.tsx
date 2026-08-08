import React, { useState, useRef } from 'react';
import { InputType, AnalysisInputData } from '../types';
import { 
  Camera, FileText, Globe, FileUp, Mic, MapPin, 
  HelpCircle, Upload, X, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';

interface AnalysisInputProps {
  onAnalyze: (data: AnalysisInputData) => void;
  isLoading?: boolean;
  initialType?: InputType;
  initialContent?: string;
  initialContext?: string;
}

const EXAMPLE_PROMPTS = [
  'Is this message a scam?',
  'Does this building photo show anything dangerous?',
  'Is this job offer suspicious?',
  'What should I be concerned about in this rental agreement?',
  'Does this road look unsafe?',
  'Is there anything concerning about this crop?',
  'Does this business data show a serious problem?'
];

export const AnalysisInput: React.FC<AnalysisInputProps> = ({
  onAnalyze,
  isLoading = false,
  initialType = 'text',
  initialContent = '',
  initialContext = ''
}) => {
  const [activeTab, setActiveTab] = useState<InputType>(initialType);
  const [content, setContent] = useState(initialContent);
  const [context, setContext] = useState(initialContext);
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: InputType) => {
    setActiveTab(tab);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
        // If text file / doc, attempt reading text
        if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setContent(event.target?.result as string);
          };
          reader.readAsText(file);
        }
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePromptClick = (prompt: string) => {
    setContext(prompt);
    if (!content) {
      setContent(`Question: ${prompt}`);
    }
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (err) => {
          setLocation('Abuja, FCT, Nigeria');
        }
      );
    } else {
      setLocation('Abuja, FCT, Nigeria');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !selectedFile && !imagePreview && !context) {
      alert('Please provide an image, text, document, URL, or situation description to analyze.');
      return;
    }

    onAnalyze({
      inputType: activeTab,
      content,
      imageFile: selectedFile,
      imageBase64: imagePreview || undefined,
      location,
      context
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl p-4 sm:p-6 md:p-8">
      {/* Multimodal Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6">
        <button
          type="button"
          onClick={() => handleTabChange('image')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'image'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Upload Image</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('text')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'text'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste Text</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('url')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'url'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Enter URL</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('document')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'document'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>Upload Document</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('voice')}
          className={`col-span-2 sm:col-span-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'voice'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Describe Situation</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tab Specific Input Fields */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950/60 max-h-72 flex items-center justify-center p-2">
                <img src={imagePreview} alt="Upload preview" className="max-h-64 object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 text-center bg-slate-950/40 hover:bg-slate-900/60 transition-all cursor-pointer group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Upload image of physical structure, message screenshot, crop, or hazard
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Paste Text / Message / Offer
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste WhatsApp message, email, job offer, investment proposal, or suspicious text here..."
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans"
            />
          </div>
        )}

        {activeTab === 'url' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Enter Website or Link URL
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://example.com/login-verify-account"
                className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'document' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 text-center bg-slate-950/40 hover:bg-slate-900/60 transition-all cursor-pointer"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.md"
                className="hidden"
              />
              <FileUp className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-200">
                {selectedFile ? selectedFile.name : 'Upload Contract, Agreement, Invoice, or Letter'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Supports TXT, PDF, DOCX
              </p>
            </div>

            {content && (
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Extracted contract excerpt..."
                className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-xs font-mono text-slate-300"
              />
            )}
          </div>
        )}

        {activeTab === 'voice' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Describe What Happened or What You Observed
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the real-life situation in plain language (e.g. 'I noticed an open electrical box near a school playground with wires sticking out...')"
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Context & Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Specific Question or Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Is there any financial scam indicator here?"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Location / City (Optional)</span>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" /> Auto-detect
              </button>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Abuja, FCT, Nigeria"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Quick Example Prompt Chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Try a common question prompt:
          </span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300 border border-slate-700/60 hover:border-blue-500/40 transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Main CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-3 group transition-all duration-300 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
          <span>Analyze for Risk</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};
