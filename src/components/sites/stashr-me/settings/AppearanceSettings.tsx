'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from '@/components/icons';

export function AppearanceSettings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    const savedTheme = localStorage.getItem('stashr_theme') as 'light' | 'dark' | 'system';
    if (savedTheme) setTheme(savedTheme);

    const savedCols = localStorage.getItem('stashr_grid_columns');
    if (savedCols) setColumns(Number(savedCols));
  }, []);

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

  const handleSelectCols = (cols: number) => {
    setColumns(cols);
    localStorage.setItem('stashr_grid_columns', String(cols));
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-6 md:px-12 md:py-8 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-semibold text-strong tracking-tight">Appearance</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Customize your theme interface, color modes, and grid density.
        </p>
      </div>

      {/* Theme Picker */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-strong">Interface Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Light Theme Card */}
          <button
            onClick={() => handleSelectTheme('light')}
            className={`group relative flex flex-col items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              theme === 'light'
                ? 'border-primary ring-2 ring-primary bg-accent/30'
                : 'border-border hover:border-border hover:bg-accent/40'
            }`}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-800 shadow-xs">
              <Sun className="size-6 text-amber-500" />
            </div>
            <span className="font-medium text-xs text-strong">Light</span>
            {theme === 'light' && (
              <div className="absolute top-2.5 right-2.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </div>
            )}
          </button>

          {/* Dark Theme Card */}
          <button
            onClick={() => handleSelectTheme('dark')}
            className={`group relative flex flex-col items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              theme === 'dark'
                ? 'border-primary ring-2 ring-primary bg-accent/30'
                : 'border-border hover:border-border hover:bg-accent/40'
            }`}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 shadow-xs">
              <Moon className="size-6 text-indigo-400" />
            </div>
            <span className="font-medium text-xs text-strong">Dark</span>
            {theme === 'dark' && (
              <div className="absolute top-2.5 right-2.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </div>
            )}
          </button>

          {/* System Theme Card */}
          <button
            onClick={() => handleSelectTheme('system')}
            className={`group relative flex flex-col items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              theme === 'system'
                ? 'border-primary ring-2 ring-primary bg-accent/30'
                : 'border-border hover:border-border hover:bg-accent/40'
            }`}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted border border-border text-foreground shadow-xs">
              <Laptop className="size-6 text-muted-foreground" />
            </div>
            <span className="font-medium text-xs text-strong">System</span>
            {theme === 'system' && (
              <div className="absolute top-2.5 right-2.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Grid Columns Setting */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div>
          <h3 className="text-sm font-semibold text-strong">Default Grid Columns</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose how many cards fit side by side in grid view on widescreen displays.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => handleSelectCols(num)}
              className={`flex h-12 items-center justify-center rounded-xl border font-mono text-sm font-medium transition-all ${
                columns === num
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                  : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {num} Columns
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
