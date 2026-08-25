'use client';

import React, { useState, useEffect } from 'react';

export function AppearanceSettings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('stashr_theme') as 'light' | 'dark' | 'system') || 'dark';
    }
    return 'dark';
  });
  const [gridColumns, setGridColumns] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stashr_grid_columns');
      if (saved) return Number(saved);
    }
    return 3;
  });
  const [mosaicColumns, setMosaicColumns] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stashr_mosaic_columns');
      if (saved) return Number(saved);
    }
    return 3;
  });

  const handleSelectTheme = (mode: 'light' | 'dark' | 'system') => {
    setTheme(mode);
    localStorage.setItem('stashr_theme', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleGridColsChange = (val: number) => {
    setGridColumns(val);
    localStorage.setItem('stashr_grid_columns', String(val));
  };

  const handleMosaicColsChange = (val: number) => {
    setMosaicColumns(val);
    localStorage.setItem('stashr_mosaic_columns', String(val));
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      {/* 1. Theme Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Theme</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose how Stashr looks to you.
          </p>
        </div>

        {/* 3 Theme Preview Cards (Exact visual graphics from screenshot) */}
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {/* Light Theme Card */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSelectTheme('light')}
              className={`group relative flex h-24 w-full flex-col overflow-hidden rounded-2xl border transition-all text-left ${
                theme === 'light'
                  ? 'border-white ring-2 ring-white/80'
                  : 'border-border/80 hover:border-border'
              }`}
            >
              {/* Top ambient neutral dark header */}
              <div className="h-full w-full bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-300 p-2 flex flex-col justify-end">
                {/* Mock UI window */}
                <div className="h-16 w-full rounded-t-xl bg-[#F5F5F7] border-t border-x border-black/10 flex overflow-hidden shadow-sm">
                  {/* Mock Sidebar */}
                  <div className="w-6 border-r border-black/5 bg-[#EBEBED] p-1 space-y-1">
                    <div className="size-1.5 rounded-full bg-black/20" />
                    <div className="h-1 w-full rounded bg-black/15" />
                    <div className="h-1 w-full rounded bg-black/15" />
                  </div>
                  {/* Mock Main View */}
                  <div className="flex-1 p-1.5 space-y-1 bg-white">
                    <div className="h-1.5 w-1/2 rounded bg-black/20" />
                    <div className="h-6 w-full rounded bg-black/5" />
                  </div>
                </div>
              </div>
            </button>
            <p className="text-center text-xs font-medium text-muted-foreground">Light</p>
          </div>

          {/* Dark Theme Card */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSelectTheme('dark')}
              className={`group relative flex h-24 w-full flex-col overflow-hidden rounded-2xl border transition-all text-left ${
                theme === 'dark'
                  ? 'border-white ring-2 ring-white/80'
                  : 'border-border/80 hover:border-border'
              }`}
            >
              {/* Top ambient neutral black header */}
              <div className="h-full w-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-2 flex flex-col justify-end">
                {/* Mock UI window */}
                <div className="h-16 w-full rounded-t-xl bg-[#080808] border-t border-x border-white/10 flex overflow-hidden shadow-sm">
                  {/* Mock Sidebar */}
                  <div className="w-6 border-r border-white/5 bg-[#050505] p-1 space-y-1">
                    <div className="size-1.5 rounded-full bg-white/25" />
                    <div className="h-1 w-full rounded bg-white/15" />
                    <div className="h-1 w-full rounded bg-white/15" />
                  </div>
                  {/* Mock Main View */}
                  <div className="flex-1 p-1.5 space-y-1 bg-[#121212]">
                    <div className="h-1.5 w-1/2 rounded bg-white/20" />
                    <div className="h-6 w-full rounded bg-white/5" />
                  </div>
                </div>
              </div>
            </button>
            <p className="text-center text-xs font-medium text-strong">Dark</p>
          </div>

          {/* System Theme Card */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSelectTheme('system')}
              className={`group relative flex h-24 w-full flex-col overflow-hidden rounded-2xl border transition-all text-left ${
                theme === 'system'
                  ? 'border-white ring-2 ring-white/80'
                  : 'border-border/80 hover:border-border'
              }`}
            >
              {/* Top ambient neutral header */}
              <div className="h-full w-full bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 p-2 flex flex-col justify-end">
                {/* Mock UI window split in half (Light left, Dark right) */}
                <div className="h-16 w-full rounded-t-xl flex overflow-hidden border-t border-x border-white/10 shadow-sm">
                  {/* Left half light */}
                  <div className="w-1/2 bg-[#F5F5F7] p-1 space-y-1">
                    <div className="size-1.5 rounded-full bg-black/20" />
                    <div className="h-1 w-3/4 rounded bg-black/15" />
                    <div className="h-4 w-full rounded bg-black/5" />
                  </div>
                  {/* Right half dark */}
                  <div className="w-1/2 bg-[#080808] p-1 space-y-1 border-l border-white/10">
                    <div className="h-1.5 w-1/2 rounded bg-white/20" />
                    <div className="h-4 w-full rounded bg-white/10" />
                  </div>
                </div>
              </div>
            </button>
            <p className="text-center text-xs font-medium text-muted-foreground">System</p>
          </div>
        </div>
      </div>

      {/* 2. Grid Layout Section */}
      <div className="space-y-2">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Grid layout</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set the maximum number of columns in the bookmarks grid view.
          </p>
        </div>

        <div className="relative w-28">
          <select
            value={gridColumns}
            onChange={e => handleGridColsChange(Number(e.target.value))}
            className="h-9 w-full appearance-none rounded-xl border border-input bg-card/60 px-3.5 pr-8 text-xs font-medium text-foreground outline-none transition-all hover:bg-accent/40 focus:border-ring focus:ring-2 focus:ring-ring/20 shadow-xs cursor-pointer"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 flex flex-col items-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Mosaic Layout Section */}
      <div className="space-y-2">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Mosaic layout</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set the maximum number of columns in the bookmarks mosaic view.
          </p>
        </div>

        <div className="relative w-28">
          <select
            value={mosaicColumns}
            onChange={e => handleMosaicColsChange(Number(e.target.value))}
            className="h-9 w-full appearance-none rounded-xl border border-input bg-card/60 px-3.5 pr-8 text-xs font-medium text-foreground outline-none transition-all hover:bg-accent/40 focus:border-ring focus:ring-2 focus:ring-ring/20 shadow-xs cursor-pointer"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 flex flex-col items-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
