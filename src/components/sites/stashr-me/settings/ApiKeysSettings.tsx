'use client';

import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Check, Trash2, Sparkles, ExternalLink } from '@/components/icons';

export function ApiKeysSettings() {
  const [keys, setKeys] = useState([
    {
      id: 'k-1',
      name: 'Default API Key',
      key: 'st_live_948f93e9a71b42c89e2',
      created: 'Aug 14, 2026'
    }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Gemini API Key State
  const [geminiKey, setGeminiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('valut_gemini_key') || localStorage.getItem('gemini_api_key') || '';
    }
    return '';
  });
  const [savedGeminiKey, setSavedGeminiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('valut_gemini_key') || localStorage.getItem('gemini_api_key') || '';
    }
    return '';
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tags?: string[] } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = () => {
    const newKey = {
      id: `k-${Date.now()}`,
      name: `Key #${keys.length + 1}`,
      key: `st_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 8)}`,
      created: 'Just now'
    };
    setKeys([newKey, ...keys]);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const handleSaveGeminiKey = () => {
    const trimmed = geminiKey.trim();
    localStorage.setItem('valut_gemini_key', trimmed);
    localStorage.setItem('gemini_api_key', trimmed);
    setSavedGeminiKey(trimmed);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearGeminiKey = () => {
    localStorage.removeItem('valut_gemini_key');
    localStorage.removeItem('gemini_api_key');
    setGeminiKey('');
    setSavedGeminiKey('');
    setTestResult(null);
  };

  const handleTestGeminiKey = async () => {
    const keyToTest = geminiKey.trim();
    if (!keyToTest) {
      setTestResult({ success: false, message: 'Please enter a Gemini API Key first.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai/tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': keyToTest,
        },
        body: JSON.stringify({
          title: 'Claude 3.7 Sonnet Announcement',
          text: 'Anthropic introduces Claude 3.7 Sonnet with hybrid reasoning capabilities, fast code generation, and deep architectural planning.',
          platform: 'twitter',
          geminiApiKey: keyToTest,
        }),
      });

      const data = await res.json();
      if (res.ok && data.tags && data.tags.length > 0) {
        setTestResult({
          success: true,
          message: 'Gemini AI successfully connected! Sample tags generated:',
          tags: data.tags.map((t: { name: string }) => t.name),
        });
        // Auto-save verified key
        handleSaveGeminiKey();
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to authenticate with Gemini API. Check your key.',
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error testing Gemini key.';
      setTestResult({
        success: false,
        message: errorMsg,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-9 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      {/* 1. Google Gemini AI Key Card */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 via-[#1c1c1f] to-[#1c1c1f] p-5 shadow-lg space-y-4 ring-1 ring-indigo-500/20">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white tracking-tight">Google Gemini AI Smart Tagging</h2>
              {savedGeminiKey ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                  <Check className="size-2.5 stroke-[3]" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/20">
                  NLP Heuristic Mode
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Connect your free Google Gemini API Key for deep content analysis, semantic taxonomy, and automatic tag generation for all saved posts.
            </p>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <span>Get Free Key</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="password"
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 rounded-xl border border-neutral-700 bg-black/40 px-3.5 py-2 text-xs font-mono text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={handleSaveGeminiKey}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
            >
              {isSaved ? 'Saved!' : 'Save Key'}
            </button>
            {savedGeminiKey && (
              <button
                type="button"
                onClick={handleClearGeminiKey}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-white/5 hover:bg-white/10 px-3 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Remove API Key"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              disabled={isTesting || !geminiKey.trim()}
              onClick={handleTestGeminiKey}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-indigo-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`size-3.5 text-indigo-400 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Connection...' : '⚡ Test Gemini AI Tagging'}</span>
            </button>
            <span className="text-[11px] text-neutral-500">
              Supports Gemini 2.5 Flash, 2.0 Flash & 1.5 Flash
            </span>
          </div>

          {testResult && (
            <div
              className={`mt-2 rounded-xl p-3 text-xs border ${
                testResult.success
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : 'border-red-500/30 bg-red-950/20 text-red-300'
              }`}
            >
              <div className="font-medium">{testResult.message}</div>
              {testResult.tags && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {testResult.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-medium text-white text-[11px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Standard Personal API Keys */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-strong tracking-tight">Personal Access Tokens</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secret tokens for programmatic bookmark access and integrations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>New key</span>
          </button>
        </div>

        <div className="space-y-3">
          {keys.map(k => (
            <div
              key={k.id}
              className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-strong">{k.name}</span>
                  <span className="text-[10px] text-muted-foreground">({k.created})</span>
                </div>
                <code className="block font-mono text-xs text-muted-foreground">
                  {k.key}
                </code>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleCopy(k.id, k.key)}
                  className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                  title="Copy key"
                >
                  {copiedId === k.id ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(k.id)}
                  className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                  title="Delete key"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
