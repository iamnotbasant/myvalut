'use client';

import React, { useState } from 'react';
import { ValutLogo } from '@/components/ValutLogo';
import { soundFx } from '@/lib/sound-effects';
import {
  X,
  Check,
  Copy,
  ExternalLink,
  Download,
  Terminal,
  Puzzle,
  Sparkles,
  Zap,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface ExtensionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExtensionGuideModal({ isOpen, onClose }: ExtensionGuideModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'url' | 'path') => {
    soundFx.playClickSound();
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  const handleTestConnection = async () => {
    soundFx.playClickSound();
    setTestingConnection(true);
    setConnectionStatus('idle');
    try {
      const res = await fetch('/api/extension/check');
      const data = await res.json();
      if (data.status === 'ready' || data.success) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    } catch {
      setConnectionStatus('error');
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] text-foreground shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <ValutLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Valut Chrome Extension</h2>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Ready to Load
                </span>
              </div>
              <p className="text-xs text-neutral-400">1-click web bookmarking with background AI tagging</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Key Feature Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <Zap className="size-4 text-amber-400 mb-1" />
              <span className="text-xs font-medium text-neutral-200">Alt + V</span>
              <span className="text-[10px] text-neutral-500">1-click hotkey</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <Sparkles className="size-4 text-purple-400 mb-1" />
              <span className="text-xs font-medium text-neutral-200">Auto AI Tags</span>
              <span className="text-[10px] text-neutral-500">Gemini powered</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <ShieldCheck className="size-4 text-sky-400 mb-1" />
              <span className="text-xs font-medium text-neutral-200">Live Sync</span>
              <span className="text-[10px] text-neutral-500">0ms WebSockets</span>
            </div>
          </div>

          {/* 3 Step Install Guide */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Easy 3-Step Setup (Chrome / Brave / Edge)
            </h3>

            {/* Step 1 */}
            <div className="flex gap-3.5 rounded-xl border border-white/5 bg-white/[0.015] p-3.5">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                1
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-200">
                  Locate your <code className="text-sky-300 font-mono text-[11px] bg-sky-950/40 px-1 py-0.5 rounded">extension/</code> directory
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  The extension is pre-packaged inside your project directory:
                </p>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-black/60 border border-white/10 px-3 py-1.5 font-mono text-[11px] text-neutral-300">
                  <span className="truncate">myvalut/extension</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('c:\\Users\\httpb\\Desktop\\Projects\\myvalut\\extension', 'path')}
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 shrink-0 cursor-pointer"
                  >
                    {copiedPath ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
                    <span>{copiedPath ? 'Copied' : 'Copy Path'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3.5 rounded-xl border border-white/5 bg-white/[0.015] p-3.5">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                2
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-200">
                  Open Browser Extensions & enable <span className="text-amber-300">Developer mode</span>
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Paste this into your browser URL bar:
                </p>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-black/60 border border-white/10 px-3 py-1.5 font-mono text-[11px] text-neutral-300">
                  <span className="truncate">chrome://extensions</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('chrome://extensions', 'url')}
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Then toggle the switch labeled <strong>"Developer mode"</strong> in the top-right corner.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3.5 rounded-xl border border-white/5 bg-white/[0.015] p-3.5">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                3
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-200">
                  Click <span className="text-emerald-300">"Load unpacked"</span>
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Click the <strong>Load unpacked</strong> button in the top left, and select the <code className="text-sky-300 font-mono text-[11px]">myvalut/extension</code> folder. Valut will appear in your extension toolbar!
                </p>
              </div>
            </div>
          </div>

          {/* Connection Checker */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div>
              <p className="text-xs font-medium text-neutral-200">Backend API Sync Status</p>
              <p className="text-[11px] text-neutral-400">
                {connectionStatus === 'idle' && 'Verify that /api/extension/save endpoint is live'}
                {connectionStatus === 'success' && '✓ Extension API is online and accepting bookmarks'}
                {connectionStatus === 'error' && '✕ Endpoint check failed. Ensure dev server is running.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {testingConnection ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-3 bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
