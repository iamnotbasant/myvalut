'use client';

import React, { useState } from 'react';
import { Key, Plus, Copy, Check, Trash2 } from '@/components/icons';

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
  const [isGenerating, setIsGenerating] = useState(false);

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
    setIsGenerating(false);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-9 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">API Keys</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create and manage secret API keys for programmatic bookmark access and integrations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
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
                className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
                className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Delete key"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
