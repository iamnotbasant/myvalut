'use client';

import React, { useState } from 'react';
import { TagDot, Search, Sparkles, Plus, Trash2 } from '@/components/icons';
import { INITIAL_TAGS } from '../bookmarks/mock-data';
import { Tag, TagColor } from '@/types/stashr';

export function TagsSettings() {
  const [autoTaggingEnabled, setAutoTaggingEnabled] = useState(true);
  const [instructions, setInstructions] = useState(
    "I'm interested in web development, design, and AI. Tag bookmarks by topic and format, e.g. react, tutorial, inspiration, tool, research."
  );
  const [tags, setTags] = useState<Tag[]>([
    { id: 't-404', name: '404 page', color: 'violet', count: 1 },
    { id: 't-ai', name: 'ai', color: 'orange', count: 7 },
    { id: 't-anim', name: 'animation', color: 'pink', count: 3 },
    { id: 't-des-insp', name: 'design inspiration', color: 'red', count: 2 },
    { id: 't-gh', name: 'github', color: 'orange', count: 3 },
    { id: 't-gd', name: 'graphic design', color: 'blue', count: 4 },
    { id: 't-md', name: 'motion design', color: 'violet', count: 3 },
    { id: 't-os', name: 'open source', color: 'green', count: 5 },
    { id: 't-pe', name: 'photo editing', color: 'violet', count: 2 },
    { id: 't-ui', name: 'ui', color: 'green', count: 5 },
    { id: 't-ux', name: 'ux', color: 'amber', count: 2 }
  ]);
  const [tagQuery, setTagQuery] = useState('');
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<TagColor>('blue');
  const [savedPrompt, setSavedPrompt] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const colors: TagColor[] = [
    'violet', 'amber', 'teal', 'green', 'indigo',
    'orange', 'pink', 'blue', 'cyan', 'red'
  ];

  const handleSavePrompt = () => {
    setSavedPrompt(true);
    setTimeout(() => setSavedPrompt(false), 2000);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const newTag: Tag = {
      id: `t_${Date.now()}`,
      name: newTagName.trim(),
      color: newTagColor,
      count: 0
    };
    setTags([newTag, ...tags]);
    setNewTagName('');
    setIsAddTagOpen(false);
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const handleCleanUpTags = () => {
    setIsCleaningUp(true);
    setTimeout(() => {
      setIsCleaningUp(false);
    }, 1000);
  };

  const filteredTags = tags.filter(t =>
    t.name.toLowerCase().includes(tagQuery.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-9 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      {/* 1. AI Auto-tagging Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-strong tracking-tight">
                AI Auto-tagging
              </h2>
              <span className="rounded-full bg-neutral-800 px-1.5 py-0.2 text-[10px] font-semibold text-neutral-300">
                PRO
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically tag new bookmarks using AI classification.
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={autoTaggingEnabled}
            onClick={() => setAutoTaggingEnabled(!autoTaggingEnabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              autoTaggingEnabled ? 'bg-neutral-200 dark:bg-white' : 'bg-neutral-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                autoTaggingEnabled ? 'translate-x-4 bg-neutral-900' : 'translate-x-0 bg-neutral-400'
              }`}
            />
          </button>
        </div>

        {/* Tagging instructions box */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-strong">
            Tagging instructions
          </label>

          <div className="rounded-2xl border border-input bg-card/60 p-3 shadow-xs space-y-3">
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows={4}
              maxLength={200}
              className="w-full resize-none bg-transparent text-xs leading-relaxed text-foreground placeholder:text-muted-foreground outline-none font-mono"
            />

            <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
              <span className="text-[11px] text-muted-foreground font-mono">
                {instructions.length}/200
              </span>

              <button
                type="button"
                onClick={handleSavePrompt}
                className="inline-flex h-7.5 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="size-3.5" />
                <span>{savedPrompt ? 'Saved' : 'Save prompt'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Manage Tags Section */}
      <div className="space-y-4 pt-1">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Manage Tags</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, edit, and delete tags for organising your bookmarks.
          </p>
        </div>

        {/* Action / Search Bar (Exact Match) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search tags input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={tagQuery}
              onChange={e => setTagQuery(e.target.value)}
              placeholder="Search tags..."
              className="h-8.5 w-full rounded-xl border border-input bg-card/60 pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring/80 focus:ring-2 focus:ring-ring/20 shadow-xs"
            />
          </div>

          {/* Clean up tags button */}
          <button
            type="button"
            onClick={handleCleanUpTags}
            disabled={isCleaningUp}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-xl border border-input bg-card/80 px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors shadow-xs"
          >
            <Sparkles className="size-3.5 text-muted-foreground" />
            <span>{isCleaningUp ? 'Cleaning...' : 'Clean up tags'}</span>
          </button>

          {/* Add tag button */}
          <button
            type="button"
            onClick={() => setIsAddTagOpen(!isAddTagOpen)}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add tag</span>
          </button>
        </div>

        {/* Add Tag Modal / Form Drawer */}
        {isAddTagOpen && (
          <form
            onSubmit={handleAddTag}
            className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in zoom-in-95 duration-100"
          >
            <h4 className="text-xs font-semibold text-strong">Create new tag</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="Tag name (e.g. design, web, tutorials)..."
                className="h-8 flex-1 rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newTagName.trim()}
                className="h-8 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-50 shadow-xs"
              >
                Create
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1">Color:</span>
              {colors.map(color => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`size-5 rounded-full flex items-center justify-center transition-transform ${
                    newTagColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-card' : 'hover:scale-110'
                  }`}
                >
                  <TagDot color={color} />
                </button>
              ))}
            </div>
          </form>
        )}

        {/* Tag List Rows matching Screenshot 5 */}
        <div className="divide-y divide-border/40 rounded-2xl border border-border/70 bg-card/40 overflow-hidden">
          {filteredTags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-accent/40"
            >
              <div className="flex items-center gap-3">
                <TagDot color={tag.color} />
                <span className="text-xs font-medium text-foreground">{tag.name}</span>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteTag(tag.id)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title={`Delete ${tag.name}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}

          {filteredTags.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No tags found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
