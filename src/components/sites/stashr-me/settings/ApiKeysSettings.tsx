'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  Check,
  Copy,
  Trash2,
  Sparkles,
  Shield,
  Pencil
} from '@/components/icons';
import { Eye, EyeOff, AlertTriangle, RotateCw, ExternalLink } from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';

export function ApiKeysSettings() {
  const [apiKey, setApiKey] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Hydrate key from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gemini_api_key');
      if (saved) {
        setApiKey(saved);
        setInputValue(saved);
      } else {
        // Fallback to pre-configured env key if present
        const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
        if (envKey) {
          setApiKey(envKey);
          setInputValue(envKey);
          localStorage.setItem('gemini_api_key', envKey);
        }
      }
    } catch {}
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    soundFx.playSaveSound();
    const cleanKey = inputValue.trim();
    setApiKey(cleanKey);
    localStorage.setItem('gemini_api_key', cleanKey);
    setIsEditing(false);
    setTestResult(null);

    // Auto-test newly saved key
    testConnection(cleanKey);
  };

  const handleDelete = () => {
    soundFx.playArchiveSound();
    setApiKey('');
    setInputValue('');
    setIsEditing(false);
    setTestResult(null);
    try {
      localStorage.removeItem('gemini_api_key');
    } catch {}
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    soundFx.playClickSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const testConnection = async (keyToTest?: string) => {
    const key = keyToTest || apiKey;
    if (!key) return;

    setIsTesting(true);
    setTestResult(null);
    soundFx.playClickSound();

    try {
      const res = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();

      if (data.success) {
        soundFx.playAiSuccessSound();
        setTestResult({
          success: true,
          message: data.message || 'Connected to Gemini AI successfully!',
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to connect. Please verify your API key.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error while testing connection.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '••••••••••••';
    return `${key.slice(0, 6)}••••••••••••••••${key.slice(-4)}`;
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      {/* Header Info */}
      <div className="space-y-1.5 border-b border-border/80 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <h1 className="text-base font-semibold text-strong tracking-tight">
            Gemini AI API Key
          </h1>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your Google Gemini API key powers real-time automatic tagging and metadata extraction
          for YouTube videos, X/Twitter posts, Reddit threads, and web bookmarks.
        </p>
      </div>

      {/* Main API Key Card */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="size-4 text-primary" />
            <span className="text-xs font-semibold text-strong">Active Gemini API Key</span>
          </div>

          {/* Status Indicator */}
          {apiKey ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Configured</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/20">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span>Not Configured</span>
            </div>
          )}
        </div>

        {/* If user is editing or has no key */}
        {(!apiKey || isEditing) ? (
          <form onSubmit={handleSave} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {isEditing ? 'Update Gemini API Key' : 'Enter your Gemini API Key'}
              </label>
              <input
                type="text"
                required
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="AIzaSy... or your Gemini Key"
                className="h-9 w-full rounded-xl border border-input bg-background px-3 font-mono text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue(apiKey);
                    setIsEditing(false);
                  }}
                  className="h-8 rounded-xl border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Check className="size-3.5" />
                <span>{isEditing ? 'Update Key' : 'Save Key'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Active Key Display Card */
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-3.5 py-2.5">
              <code className="font-mono text-xs text-foreground select-all">
                {isVisible ? apiKey : maskKey(apiKey)}
              </code>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                  title={isVisible ? 'Hide key' : 'Show key'}
                >
                  {isVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                  title="Copy key"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setInputValue(apiKey);
                  }}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                  title="Edit key"
                >
                  <Pencil className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                  title="Delete key"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => testConnection()}
                disabled={isTesting}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`size-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Testing connection...' : 'Test Connection'}</span>
              </button>

              {testResult && (
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-medium animate-in fade-in duration-200 ${
                    testResult.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="size-3.5" />
                  ) : (
                    <AlertTriangle className="size-3.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Guide Callout: Where to get API Key */}
      <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-strong">Need a Gemini API Key?</span>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            <span>Google AI Studio</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Google provides free access to Gemini 2.5 Flash and 1.5 Flash models. Head over to Google AI Studio,
          create a free key, and paste it above to unlock instantaneous auto-tagging with zero latency.
        </p>
      </div>
    </div>
  );
}
