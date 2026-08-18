'use client';

import React, { useState } from 'react';
import { TagDot, Plus, Trash2, Sparkles, Check } from '@/components/icons';
import { INITIAL_TAGS } from '../bookmarks/mock-data';
import { Tag, TagColor } from '@/types/stashr';

export function TagsSettings() {
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<TagColor>('blue');
  const [isAiCleaning, setIsAiCleaning] = useState(false);
  const [aiCleanMessage, setAiCleanMessage] = useState<string | null>(null);

  const colors: TagColor[] = [
    'violet', 'amber', 'teal', 'green', 'indigo',
    'orange', 'pink', 'blue', 'cyan', 'red'
  ];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const newTag: Tag = {
      id: `t_${Date.now()}`,
      name: newTagName.trim(),
      color: selectedColor,
      count: 0
    };
    setTags([...tags, newTag]);
    setNewTagName('');
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const handleAiCleanup = () => {
    setIsAiCleaning(true);
    setTimeout(() => {
      setIsAiCleaning(false);
      setAiCleanMessage('No duplicates found. Your tags look clean.');
      setTimeout(() => setAiCleanMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-6 md:px-12 md:py-8 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-semibold text-strong tracking-tight">Tag settings</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage, color-code, and organize your bookmark tags with AI cleanup.
        </p>
      </div>

      {/* AI Cleanup Card */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-strong">AI Tag Cleanup</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Automatically detect redundant tags, merge duplicates, and suggest taxonomy improvements.
          </p>
          {aiCleanMessage && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              {aiCleanMessage}
            </p>
          )}
        </div>
        <button
          onClick={handleAiCleanup}
          disabled={isAiCleaning}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xs"
        >
          <Sparkles className="size-3.5" />
          <span>{isAiCleaning ? 'Analyzing...' : 'Clean up tags'}</span>
        </button>
      </div>

      {/* Create New Tag */}
      <form onSubmit={handleAddTag} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-strong">Create new tag</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            placeholder="Tag name..."
            className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
          />
          <button
            type="submit"
            disabled={!newTagName.trim()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground disabled:opacity-50 shadow-xs hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-2">
            Select Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                type="button"
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex size-6 items-center justify-center rounded-full transition-transform ${
                  selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary ring-offset-background' : 'hover:scale-110'
                }`}
              >
                <TagDot color={color} />
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Existing Tags List */}
      <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-sm font-semibold text-strong">Existing tags</h3>
          <span className="text-xs font-mono text-muted-foreground">
            {tags.length} total
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                <TagDot color={tag.color} />
                <span className="text-xs font-medium text-foreground">{tag.name}</span>
                {tag.count !== undefined && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    ({tag.count})
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
