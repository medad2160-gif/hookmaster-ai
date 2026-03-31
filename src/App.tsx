/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  Video, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronRight,
  Instagram,
  Smartphone
} from 'lucide-react';
import { generateViralContent } from './services/gemini';
import { ViralContent, Tone } from './types';

export default function App() {
  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState<Tone>('educational');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViralContent | null>(null);
  const [history, setHistory] = useState<ViralContent[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const tones: { value: Tone; label: string; icon: string }[] = [
    { value: 'educational', label: 'Educational', icon: '🎓' },
    { value: 'controversial', label: 'Controversial', icon: '🔥' },
    { value: 'storytelling', label: 'Storytelling', icon: '📖' },
    { value: 'humorous', label: 'Humorous', icon: '😂' },
    { value: 'inspirational', label: 'Inspirational', icon: '✨' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    try {
      const data = await generateViralContent(niche, tone);
      setResult(data);
      setHistory(prev => [data, ...prev].slice(0, 5));
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
        >
          <Sparkles size={14} />
          <span>AI-Powered Viral Strategy</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-4">
          Viral<span className="gradient-text">Hook</span> AI
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Stop the scroll and explode your reach. Generate high-converting hooks, ideas, and scripts in seconds.
        </p>
      </header>

      <main className="grid gap-8">
        {/* Input Form */}
        <section className="brutalist-card">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="niche" className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Your Niche or Topic
              </label>
              <input
                id="niche"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Minimalist Home Decor, Crypto Trading, Vegan Cooking..."
                className="w-full brutalist-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Choose Your Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      tone === t.value
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-2xl mb-1">{t.icon}</span>
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !niche.trim()}
              className="w-full brutalist-button group"
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Analyzing Viral Patterns...</span>
                </>
              ) : (
                <>
                  <Zap size={20} className="group-hover:fill-current" />
                  <span>Generate Viral Strategy</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.section
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                <ChevronRight size={24} />
                <h2>Your Viral Blueprint</h2>
              </div>

              <div className="grid gap-6">
                {/* Hook Card */}
                <div className="brutalist-card relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase text-xs tracking-widest">
                      <Zap size={14} />
                      <span>The Hook</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.hook, 'hook')}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-100"
                    >
                      {copied === 'hook' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-2xl font-bold leading-tight text-white">
                    "{result.hook}"
                  </p>
                </div>

                {/* Video Idea Card */}
                <div className="brutalist-card relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase text-xs tracking-widest">
                      <Video size={14} />
                      <span>Visual Concept</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.videoIdea, 'idea')}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-100"
                    >
                      {copied === 'idea' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    {result.videoIdea}
                  </p>
                </div>

                {/* Script Card */}
                <div className="brutalist-card relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-violet-400 font-semibold uppercase text-xs tracking-widest">
                      <FileText size={14} />
                      <span>Short Script</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.script, 'script')}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-100"
                    >
                      {copied === 'script' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                    <p className="text-zinc-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {result.script}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200">Reels Tip</h4>
                    <p className="text-xs text-zinc-500 mt-1">Use trending audio at low volume (3-5%) to boost discoverability while keeping your voice clear.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200">TikTok Tip</h4>
                    <p className="text-xs text-zinc-500 mt-1">Add on-screen text for the hook immediately. 80% of users scroll with sound off initially.</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* History Section */}
        {history.length > 1 && (
          <section className="mt-12">
            <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-4">Recent Generations</h3>
            <div className="space-y-3">
              {history.slice(1).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setResult(item)}
                  className="w-full text-left p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{tones.find(t => t.value === item.tone)?.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-zinc-300 truncate max-w-[200px] md:max-w-md">{item.hook}</p>
                      <p className="text-xs text-zinc-600 uppercase tracking-tighter">{item.niche}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-20 pb-8 text-center text-zinc-600 text-sm">
        <p>© 2026 ViralHook AI. Built for creators who mean business.</p>
      </footer>
    </div>
  );
}
