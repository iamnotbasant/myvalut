'use client';

import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      category: 'Navigation & Search',
      shortcuts: [
        { keys: ['⌘', 'K'], label: 'Open Command Palette' },
        { keys: ['/'], label: 'Focus Quick Search' },
        { keys: ['?'], label: 'Show Keyboard Shortcuts' },
        { keys: ['Esc'], label: 'Close Active Modal / Clear Selection' },
      ],
    },
    {
      category: 'Bookmarks & Actions',
      shortcuts: [
        { keys: ['+'], label: 'Add New Bookmark' },
        { keys: ['N'], label: 'Create New Bookmark' },
        { keys: ['Alt', 'V'], label: 'Save Active Tab (Chrome Extension)' },
      ],
    },
    {
      category: 'Views & Management',
      shortcuts: [
        { keys: ['Backspace'], label: 'Move to Archive (in selection mode)' },
        { keys: ['Space'], label: 'Select / Toggle Bookmark Card' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] text-foreground shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Keyboard className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Keyboard Shortcuts</h2>
              <p className="text-[11px] text-neutral-400">Power user keybindings for instant productivity</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
          {shortcutGroups.map(group => (
            <div key={group.category} className="space-y-2.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {group.category}
              </h3>
              <div className="space-y-1.5 rounded-xl border border-white/5 bg-white/[0.015] p-2.5">
                {group.shortcuts.map(sc => (
                  <div
                    key={sc.label}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs text-neutral-300">{sc.label}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map(k => (
                        <kbd
                          key={k}
                          className="flex h-5 min-w-5 items-center justify-center rounded border border-white/15 bg-neutral-900 px-1.5 font-mono text-[10px] font-medium text-neutral-200 shadow-xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 bg-white/[0.02] text-xs text-neutral-400">
          <span>Tip: Press <kbd className="font-mono text-neutral-300">?</kbd> anywhere to open this cheatsheet</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
