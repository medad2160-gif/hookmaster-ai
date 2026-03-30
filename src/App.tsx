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

  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const text = {
    en: {
      badge: "AI-Powered Viral Strategy",
      title: "ViralHook AI",
      subtitle: "Stop the scroll and explode your reach. Generate high-converting hooks, ideas, and scripts in seconds.",
      niche: "Your Niche or Topic",
      placeholder: "e.g. Minimalist Home Decor, Crypto Trading, Vegan Cooking...",
      tone: "Choose Your Tone",
      generate: "Generate Viral Strategy",
      loading: "Analyzing Viral Patterns...",
      result: "Your Viral Blueprint",
      hook: "The Hook",
      idea: "Visual Concept",
      script: "Short Script",
    },
    ar: {
      badge: "استراتيجية ذكاء اصطناعي",
      title: "مولد الأفكار الفيرال",
      subtitle: "خلّي الناس توقف عندك وزوّد وصولك. أنشئ أفكار وهوكات وسكربتات في ثواني.",
      niche: "اكتب المجال",
      placeholder: "مثال: ديكور منزلي، كريبتو، طبخ نباتي...",
      tone: "اختر النمط",
      generate: "إنشاء",
      loading: "جاري التحليل...",
      result: "الخطة الفيرال",
      hook: "الهُوك",
      idea: "فكرة الفيديو",
      script: "سكريبت قصير",
    }
  };

  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState<Tone>('educational');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViralContent | null>(null);
  const [history, setHistory] = useState<ViralContent[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const tones: { value: Tone; label: string; icon: string }[] = [
    { value: 'educational', label: lang === 'ar' ? 'تعليمي' : 'Educational', icon: '🎓' },
    { value: 'controversial', label: lang === 'ar' ? 'جدلي' : 'Controversial', icon: '🔥' },
    { value: 'storytelling', label: lang === 'ar' ? 'قصصي' : 'Storytelling', icon: '📖' },
    { value: 'humorous', label: lang === 'ar' ? 'مضحك' : 'Humorous', icon: '😂' },
    { value: 'inspirational', label: lang === 'ar' ? 'تحفيزي' : 'Inspirational', icon: '✨' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    setTimeout(() => {
  const fakeData = {
    hook: "🔥 سر محدش قالك عليه في المجال ده!",
    videoIdea: "اعمل فيديو بسيط يشرح فكرة غريبة في مجالك",
    script: "ابدأ بهوك قوي، بعدين اشرح بسرعة، وختم بسؤال يخلي الناس تتفاعل",
    tone,
    niche
  };

  setResult(fakeData);
  setHistory(prev => [fakeData, ...prev].slice(0, 5));
  setLoading(false);
}, 1500);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <header className="mb-12 text-center">

        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="text-sm text-zinc-400 hover:text-white"
          >
       س     {lang === 'en' ? 'AR' : 'صEN'}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
        >
          <Sparkles size={14} />
          <span>{text[lang].badge}</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-4">
          {text[lang].title}
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          {text[lang].subtitle}
        </p>
      </header>

      <main className="grid gap-8">

        {/* Input */}
        <section className="brutalist-card">
          <form onSubmit={handleGenerate} className="space-y-6">

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                {text[lang].niche}
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder={text[lang].placeholder}
                className="w-full brutalist-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                {text[lang].tone}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                      tone === t.value
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full brutalist-button">
              {loading ? text[lang].loading : text[lang].generate}
            </button>

          </form>
        </section>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.section className="space-y-6">
              <h2 className="text-xl text-emerald-400 font-bold">
                {text[lang].result}
              </h2>

              <div className="brutalist-card">
                <p className="text-white text-xl">"{result.hook}"</p>
              </div>

              <div className="brutalist-card">
                <p className="text-zinc-300">{result.videoIdea}</p>
              </div>

              <div className="brutalist-card">
                <p className="text-zinc-300">{result.script}</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
