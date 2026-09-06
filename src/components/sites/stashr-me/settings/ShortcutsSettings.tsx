'use client';

import React, { useState } from 'react';
import { Keyboard, Search } from 'lucide-react';

interface ShortcutItem {
  keys: string[];
  label: string;
  description?: string;
}

interface ShortcutCategory {
  category: string;
  shortcuts: ShortcutItem[];
}

export function ShortcutsSettings() {
  const [searchQuery, setSearchQuery] = useState('');

  const shortcutGroups: ShortcutCategory[] = [
    {
      category: 'Navigation & Global Search',
      shortcuts: [
        { keys: ['⌘', 'K'], label: 'Open Command Palette', description: 'Instant spotlight search across all bookmarks, tags & actions' },
        { keys: ['/'], label: 'Focus Search Bar', description: 'Instantly jump cursor into vault search input' },
        { keys: ['?'], label: 'Show Shortcuts Modal', description: 'Display floating keybinding cheat sheet anywhere' },
        { keys: ['Esc'], label: 'Dismiss / Close Modal', description: 'Close any active popover, drawer, or selection bar' },
      ],
    },
    {
      category: 'Bookmarks & Actions',
      shortcuts: [
        { keys: ['+'], label: 'Add New Bookmark', description: 'Open manual bookmark entry dialog' },
        { keys: ['N'], label: 'New Bookmark Prompt', description: 'Fast bookmark creator with auto-enrichment' },
        { keys: ['Alt', 'V'], label: 'Save Active Tab', description: 'Trigger Valut Chrome Extension to capture current page' },
      ],
    },
    {
      category: 'Views & Management',
      shortcuts: [
        { keys: ['Space'], label: 'Toggle Card Selection', description: 'Select or deselect active bookmark in selection mode' },
        { keys: ['Backspace'], label: 'Archive Selection', description: 'Move selected bookmarks to Archive' },
        { keys: ['1'], label: 'Grid View Mode', description: 'Switch bookmarks layout to masonry Grid' },
        { keys: ['2'], label: 'Row View Mode', description: 'Switch bookmarks layout to compact Rows' },
        { keys: ['3'], label: 'Timeline Feed Mode', description: 'Switch bookmarks layout to vertical feed' },
        { keys: ['4'], label: 'Mosaic Media Mode', description: 'Switch bookmarks layout to pure visual media wall' },
      ],
    },
  ];

  const filteredGroups = shortcutGroups.map(group => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return group;
    const matches = group.shortcuts.filter(
      sc =>
        sc.label.toLowerCase().includes(q) ||
        sc.description?.toLowerCase().includes(q) ||
        sc.keys.some(k => k.toLowerCase().includes(q))
    );
    return { ...group, shortcuts: matches };
  }).filter(group => group.shortcuts.length > 0);

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
            <Keyboard className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Keyboard Shortcuts</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Power user keybindings for rapid navigation and bookmark management.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Filter Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter shortcuts by name or key..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2 text-xs text-white placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Shortcuts List */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-muted-foreground">
            <p className="text-xs">No shortcuts match &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.category} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.category}
              </h3>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden shadow-sm">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white">{shortcut.label}</p>
                      {shortcut.description && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{shortcut.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="flex h-6 min-w-6 items-center justify-center rounded-md border border-white/15 bg-neutral-900 px-2 font-mono text-[11px] font-semibold text-neutral-200 shadow-xs ring-1 ring-black/50"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pro Tip Box */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 text-xs text-purple-200/90 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div className="space-y-1">
          <p className="font-medium text-white">Interactive Keybinding Tip</p>
          <p className="text-[11px] text-purple-300/80 leading-relaxed">
            You can press <kbd className="font-mono bg-purple-900/50 border border-purple-500/30 px-1.5 py-0.5 rounded text-white">?</kbd> on your keyboard anywhere across Valut to open the floating shortcut cheatsheet modal.
          </p>
        </div>
      </div>
    </div>
  );
}
