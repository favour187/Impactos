import React, { useState, useRef } from 'react';
import { InputType, AnalysisInputData } from '../types';
import { 
  Camera, FileText, Globe, FileUp, Mic, MapPin, 
  Upload, X, ArrowRight, Sparkles, StopCircle, Volume2
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
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const handleTabChange = (tab: InputType) => {
    setActiveTab(tab);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onloadend = () => setAudioBase64(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => setContent(event.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAudioBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access unavailable or denied. You can type or upload an audio file instead.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
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
        () => {
          setLocation('Abuja, Nigeria');
        }
      );
    } else {
      setLocation('Abuja, Nigeria');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !selectedFile && !imagePreview && !audioBase64 && !context) {
      alert('Please provide an image, text, document, URL, or situation audio/description.');
      return;
    }

    onAnalyze({
      inputType: activeTab,
      content,
      imageFile: selectedFile,
      imageBase64: imagePreview || audioBase64 || undefined,
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
          <span>Voice & Audio</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tab 1: Image Upload */}
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
                  Upload photo of physical hazard, building structure, crop, or screenshot
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Text */}
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
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
        )}

        {/* Tab 3: Enter URL */}
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
            <p className="text-[11px] text-slate-500 mt-2">
              Performs safe domain structure analysis, Punycode detection, misleading subdomain check, and TLD risk evaluation.
            </p>
          </div>
        )}

        {/* Tab 4: Upload Document */}
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
                {selectedFile ? selectedFile.name : 'Upload Contract, Rental Agreement, or Invoice'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, TXT, DOCX
              </p>
            </div>

            {content && (
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Extracted contract text..."
                className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-xs font-mono text-slate-300"
              />
            )}
          </div>
        )}

        {/* Tab 5: Voice & Audio Situation */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-blue-400" />
                    Live Microphone Dictation or Audio Voice Note
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Speak or upload a recorded audio note describing what happened.
                  </p>
                </div>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shrink-0 shadow-lg shadow-blue-600/20"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Record Audio Note</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center space-x-2 shrink-0 animate-pulse"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Stop Recording ({recordingTime}s)</span>
                  </button>
                )}
              </div>

              {audioBase64 && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Audio Recording Ready for Analysis
                  </span>
                  <button
                    type="button"
                    onClick={() => setAudioBase64(null)}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Or type a verbal description of what happened in plain language..."
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Context & Location Inputs */}
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
              placeholder="e.g. Abuja, Nigeria"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Example Question Chips */}
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

        {/* CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-3 group transition-all duration-300 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-blue-200" />
          <span>Analyze for Risk</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};
