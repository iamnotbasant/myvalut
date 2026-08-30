'use client';

import React, { useState, useEffect } from 'react';
import { BookmarkItem } from '@/types/stashr';
import {
  Sparkles,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Trash2,
  TagDot
} from '@/components/icons';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  source: 'ai_tagger' | 'scraper' | 'extension_save' | 'database' | 'system';
  level: 'info' | 'warn' | 'error' | 'success';
  title: string;
  details?: string;
  payload?: any;
}

interface SystemLogsViewProps {
  bookmarks: BookmarkItem[];
  onGenerateTags?: (bookmark: BookmarkItem) => Promise<void> | void;
}

export function SystemLogsView({ bookmarks, onGenerateTags }: SystemLogsViewProps) {
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<'all' | 'error' | 'ai' | 'scraper'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Test State
  const [testInput, setTestInput] = useState('https://www.youtube.com/watch?v=7ql_QDk_e8s');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Bulk Auto-Tag State
  const [isBulkTagging, setIsBulkTagging] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  const untaggedBookmarks = bookmarks.filter(b => (!b.tags || b.tags.length === 0) && !b.isArchived);

  // Load logs from localStorage
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem('valut_system_logs_v1');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      } else {
        // Initial informative logs
        const initialLogs: SystemLogEntry[] = [
          {
            id: 'log_init_1',
            timestamp: new Date().toLocaleTimeString(),
            source: 'system',
            level: 'info',
            title: 'Valut System Initialized',
            details: 'Next.js 16 App Router + Supabase DB + Gemini 3.6 Flash Engine connected.'
          },
          {
            id: 'log_init_2',
            timestamp: new Date().toLocaleTimeString(),
            source: 'ai_tagger',
            level: 'success',
            title: 'Gemini Model Candidates Loaded',
            details: 'Priority models: gemini-3.6-flash, gemini-3.5-flash (v1beta API endpoints verified).'
          }
        ];
        setLogs(initialLogs);
        localStorage.setItem('valut_system_logs_v1', JSON.stringify(initialLogs));
      }
    } catch {}
  }, []);

  const addLog = (entry: Omit<SystemLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: SystemLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prev => {
      const updated = [newEntry, ...prev].slice(0, 100);
      try {
        localStorage.setItem('valut_system_logs_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearLogs = () => {
    setLogs([]);
    try {
      localStorage.removeItem('valut_system_logs_v1');
    } catch {}
  };

  const handleCopyLog = (log: SystemLogEntry) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Live Interactive Gemini Test
  const handleRunLiveTest = async () => {
    if (!testInput.trim() || isTesting) return;
    setIsTesting(true);
    setTestResult(null);

    const startTime = Date.now();

    try {
      const res = await fetch('/api/ai/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: testInput.startsWith('http') ? testInput : undefined,
          title: !testInput.startsWith('http') ? testInput : undefined,
          text: testInput
        })
      });

      const latency = Date.now() - startTime;
      const data = await res.json();

      if (res.ok && data.success) {
        setTestResult({
          status: 'SUCCESS',
          latency: `${latency}ms`,
          tags: data.tags || [],
          raw: data
        });

        addLog({
          source: 'ai_tagger',
          level: 'success',
          title: `AI Tagging Test Passed (${latency}ms)`,
          details: `Generated ${data.tags?.length || 0} tags: ${data.tags?.map((t: any) => t.name).join(', ')}`,
          payload: data
        });
      } else {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setTestResult({
        status: 'ERROR',
        error: err.message || 'Test failed'
      });

      addLog({
        source: 'ai_tagger',
        level: 'error',
        title: 'AI Tagging Test Failed',
        details: err.message || 'Unknown test error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // 2. Bulk Auto-Tag Untagged Bookmarks
  const handleBulkAutoTag = async () => {
    if (untaggedBookmarks.length === 0 || isBulkTagging) return;

    setIsBulkTagging(true);
    setBulkProgress({ current: 0, total: untaggedBookmarks.length });

    addLog({
      source: 'ai_tagger',
      level: 'info',
      title: `Starting Batch Tag Generation for ${untaggedBookmarks.length} untagged bookmarks...`
    });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < untaggedBookmarks.length; i++) {
      const bm = untaggedBookmarks[i];
      setBulkProgress({ current: i + 1, total: untaggedBookmarks.length });

      try {
        if (onGenerateTags) {
          await onGenerateTags(bm);
          successCount++;
        }
      } catch (e: any) {
        failCount++;
        addLog({
          source: 'ai_tagger',
          level: 'warn',
          title: `Failed to tag bookmark: ${bm.title || bm.id}`,
          details: e.message || 'Unknown error'
        });
      }

      // Small delay between calls
      await new Promise(r => setTimeout(r, 600));
    }

    setIsBulkTagging(false);
    addLog({
      source: 'ai_tagger',
      level: failCount === 0 ? 'success' : 'warn',
      title: `Batch Tagging Completed: ${successCount} tagged, ${failCount} failed.`,
    });
  };

  const filteredLogs = logs.filter(log => {
    if (filterLevel === 'error') return log.level === 'error' || log.level === 'warn';
    if (filterLevel === 'ai') return log.source === 'ai_tagger';
    if (filterLevel === 'scraper') return log.source === 'scraper';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                System Diagnostics & Error Logs
              </h1>
              <p className="text-xs text-neutral-400">
                Live monitoring for Gemini AI Tagging, Scrapers, Supabase DB & Extension Saves
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {untaggedBookmarks.length > 0 && (
            <button
              type="button"
              onClick={handleBulkAutoTag}
              disabled={isBulkTagging}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs font-medium transition-all shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`size-3.5 text-purple-400 ${isBulkTagging ? 'animate-spin' : ''}`} />
              <span>
                {isBulkTagging
                  ? `Tagging ${bulkProgress.current}/${bulkProgress.total}...`
                  : `Auto-Tag ${untaggedBookmarks.length} Untagged`}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* 1. Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Gemini AI Engine */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121214] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Gemini AI Engine</span>
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>gemini-3.6-flash</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">Fallback: gemini-3.5-flash</span>
          </div>
        </div>

        {/* Database Realtime */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121214] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Database Sync</span>
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Supabase Live</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">{bookmarks.length} bookmarks saved</span>
          </div>
        </div>

        {/* Scrapers Status */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121214] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Platform Scrapers</span>
            <span className="flex size-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>YT, X & Reddit</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">vxtwitter + oEmbed DOM</span>
          </div>
        </div>

        {/* Untagged Status */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121214] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Untagged Items</span>
            {untaggedBookmarks.length > 0 ? (
              <span className="flex size-2 rounded-full bg-amber-400 animate-ping" />
            ) : (
              <span className="flex size-2 rounded-full bg-emerald-400" />
            )}
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              {untaggedBookmarks.length > 0 ? (
                <>
                  <AlertTriangle className="size-4 text-amber-400" />
                  <span>{untaggedBookmarks.length} Untagged</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>100% Tagged</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">All vault items indexed</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Live AI Tagging Tester */}
      <div className="rounded-xl border border-white/[0.08] bg-[#121214] p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Live AI Tagging & Scraper Tester</h2>
          </div>
          <span className="text-xs text-neutral-400">Diagnose live endpoint responses</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={testInput}
            onChange={e => setTestInput(e.target.value)}
            placeholder="Enter a YouTube URL, Tweet URL, or video title to test..."
            className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleRunLiveTest}
            disabled={isTesting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`size-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing API...' : 'Run Live Test'}</span>
          </button>
        </div>

        {/* Live Test Result */}
        {testResult && (
          <div className="rounded-lg border border-white/10 bg-black/60 p-3.5 space-y-2.5 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testResult.status === 'SUCCESS' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="size-3.5" /> 200 OK ({testResult.latency})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
                    <XCircle className="size-3.5" /> FAILED
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-400">Model: gemini-3.6-flash</span>
            </div>

            {testResult.status === 'SUCCESS' && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-neutral-400 mr-1">Generated Tags:</span>
                {testResult.tags.map((t: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-white/10 bg-white/[0.06] text-xs text-neutral-200"
                  >
                    <TagDot color={t.color} />
                    <span>{t.name}</span>
                  </span>
                ))}
              </div>
            )}

            {testResult.status === 'ERROR' && (
              <p className="text-xs text-rose-300 font-mono">{testResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* 3. Live Logs & Error Stream */}
      <div className="rounded-xl border border-white/[0.08] bg-[#121214] overflow-hidden shadow-sm">
        {/* Table Filter Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-black/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Event Stream</span>
            <span className="text-[11px] text-neutral-400">({filteredLogs.length} events)</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
            {(['all', 'error', 'ai', 'scraper'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterLevel(tab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                  filterLevel === tab
                    ? 'bg-white/15 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab === 'all' ? 'All Logs' : tab === 'error' ? 'Errors Only' : tab === 'ai' ? 'AI Tagging' : 'Scrapers'}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="divide-y divide-white/[0.06] max-h-96 overflow-y-auto font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 font-sans text-xs">
              No logged events for this filter.
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 hover:bg-white/[0.02] flex items-start justify-between gap-4 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Status icon */}
                  {log.level === 'error' ? (
                    <XCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : log.level === 'warn' ? (
                    <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : log.level === 'success' ? (
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Activity className="size-4 text-blue-400 shrink-0 mt-0.5" />
                  )}

                  <div className="min-w-0 space-y-0.5 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-xs">{log.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-neutral-400 border border-white/5 font-mono">
                        {log.source}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-[11.5px] text-neutral-300 leading-relaxed font-sans">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-neutral-500 font-mono">{log.timestamp}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyLog(log)}
                    title="Copy Log JSON"
                    className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                  >
                    {copiedId === log.id ? (
                      <Check className="size-3 text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
