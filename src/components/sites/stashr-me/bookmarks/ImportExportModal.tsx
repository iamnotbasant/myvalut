'use client';

import React, { useState, useRef } from 'react';
import { BookmarkItem, Collection, Tag } from '@/types/stashr';
import {
  exportVaultToJson,
  exportVaultToMarkdown,
  downloadFile,
  copyToClipboard,
  parseAndValidateImport,
} from '@/lib/import-export';
import { soundFx } from '@/lib/sound-effects';
import {
  X,
  Check,
  Copy,
  Download,
  Upload,
  FileText,
  FileCode,
  ShieldCheck,
  AlertCircle,
  Folder,
  Tag as TagIcon,
  Bookmark,
} from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  collections: Collection[];
  tags: Tag[];
  onImport: (data: {
    bookmarks: BookmarkItem[];
    collections: Collection[];
    tags: Tag[];
  }) => Promise<{ addedCount: number; skippedCount: number }>;
}

export function ImportExportModal({
  isOpen,
  onClose,
  bookmarks,
  collections,
  tags,
  onImport,
}: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  // Export State
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown'>('json');
  const [isCopied, setIsCopied] = useState(false);

  // Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importParsed, setImportParsed] = useState<{
    bookmarks: BookmarkItem[];
    collections: Collection[];
    tags: Tag[];
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ added: number; skipped: number } | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Export Download
  const handleExportDownload = () => {
    soundFx.playSaveSound();
    const dateStr = new Date().toISOString().split('T')[0];

    if (exportFormat === 'json') {
      const jsonContent = exportVaultToJson(bookmarks, collections, tags);
      downloadFile(`valut-backup-${dateStr}.json`, jsonContent, 'application/json');
    } else {
      const mdContent = exportVaultToMarkdown(bookmarks);
      downloadFile(`valut-knowledge-export-${dateStr}.md`, mdContent, 'text/markdown');
    }
  };

  // Handle Copy to Clipboard
  const handleCopyContent = async () => {
    soundFx.playClickSound();
    const content =
      exportFormat === 'json'
        ? exportVaultToJson(bookmarks, collections, tags)
        : exportVaultToMarkdown(bookmarks);

    const ok = await copyToClipboard(content);
    if (ok) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportError(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = parseAndValidateImport(text);

      if (res.success && res.data) {
        setImportParsed(res.data);
      } else {
        setImportError(res.error || 'Failed to parse import file.');
        setImportParsed(null);
      }
    };
    reader.onerror = () => {
      setImportError('Could not read the selected file.');
      setImportParsed(null);
    };
    reader.readAsText(file);
  };

  // Execute Import
  const handleExecuteImport = async () => {
    if (!importParsed || isImporting) return;

    soundFx.playClickSound();
    setIsImporting(true);
    setImportError(null);

    try {
      // Filter duplicates if option selected
      let toImportBookmarks = importParsed.bookmarks;
      let skipped = 0;

      if (skipDuplicates) {
        const existingUrls = new Set(bookmarks.map((b) => b.url).filter(Boolean));
        const existingIds = new Set(bookmarks.map((b) => b.id));

        toImportBookmarks = importParsed.bookmarks.filter((b) => {
          if (b.url && existingUrls.has(b.url)) {
            skipped++;
            return false;
          }
          if (existingIds.has(b.id)) {
            skipped++;
            return false;
          }
          return true;
        });
      }

      const res = await onImport({
        bookmarks: toImportBookmarks,
        collections: importParsed.collections,
        tags: importParsed.tags,
      });

      setImportResult({
        added: res.addedCount,
        skipped: res.skippedCount + skipped,
      });
      soundFx.playSaveSound();
    } catch (err: any) {
      setImportError(err.message || 'Import failed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.playClickSound();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#121217] p-6 text-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Data Portability & Backup</h2>
              <p className="text-xs text-zinc-400">Export or restore your knowledge vault anytime</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClickSound();
              onClose();
            }}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              setActiveTab('export');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Download className="size-3.5" />
            <span>Export Data</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              setActiveTab('import');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="size-3.5" />
            <span>Import / Restore</span>
          </button>
        </div>

        {/* Tab Content: EXPORT */}
        {activeTab === 'export' && (
          <div className="mt-5 space-y-4">
            {/* Format Selection Cards */}
            <div>
              <label className="text-xs font-medium text-zinc-300 mb-2 block">Choose Format</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickSound();
                    setExportFormat('json');
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    exportFormat === 'json'
                      ? 'border-blue-500/60 bg-blue-500/10 text-white'
                      : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium text-xs text-white">
                    <FileCode className="size-4 text-blue-400" />
                    <span>JSON Backup</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400 leading-normal">
                    Complete backup with metadata, tags & collections.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickSound();
                    setExportFormat('markdown');
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    exportFormat === 'markdown'
                      ? 'border-blue-500/60 bg-blue-500/10 text-white'
                      : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium text-xs text-white">
                    <FileText className="size-4 text-purple-400" />
                    <span>Markdown (.md)</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400 leading-normal">
                    Clean notes with links. Ideal for Obsidian & Notion.
                  </p>
                </button>
              </div>
            </div>

            {/* Live Stats Summary */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Bookmark className="size-3.5 text-blue-400" />
                  <strong className="text-white">{bookmarks.length}</strong> Bookmarks
                </span>
                <span className="flex items-center gap-1.5">
                  <Folder className="size-3.5 text-emerald-400" />
                  <strong className="text-white">{collections.length}</strong> Folders
                </span>
                <span className="flex items-center gap-1.5">
                  <TagIcon className="size-3.5 text-purple-400" />
                  <strong className="text-white">{tags.length}</strong> Tags
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportDownload}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Download className="size-4" />
                <span>Download {exportFormat.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyContent}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-xs transition-colors border border-white/[0.08] cursor-pointer"
                title="Copy contents to clipboard"
              >
                {isCopied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: IMPORT */}
        {activeTab === 'import' && (
          <div className="mt-5 space-y-4">
            {/* Drop / File Input Zone */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/50 transition-all cursor-pointer text-center group"
            >
              <div className="size-10 rounded-full bg-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors mb-2">
                <Upload className="size-5" />
              </div>
              <p className="text-xs font-medium text-white">
                {importFile ? importFile.name : 'Click to select Valut backup file (.json)'}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Supports Valut JSON backup exports</p>
            </div>

            {/* Error Message */}
            {importError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            {/* Parsed Preview */}
            {importParsed && (
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Bookmarks found:</span>
                  <span className="font-semibold text-white">{importParsed.bookmarks.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Collections / Folders:</span>
                  <span className="font-semibold text-white">{importParsed.collections.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Tags detected:</span>
                  <span className="font-semibold text-white">{importParsed.tags.length}</span>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipDuplicates}
                      onChange={(e) => setSkipDuplicates(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Skip already existing bookmarks</span>
                  </label>
                </div>
              </div>
            )}

            {/* Success Result */}
            {importResult && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <Check className="size-4 shrink-0" />
                <span>
                  Successfully restored <strong>{importResult.added}</strong> bookmarks! ({importResult.skipped} skipped).
                </span>
              </div>
            )}

            {/* Import Action */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!importParsed || isImporting}
                onClick={handleExecuteImport}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="size-4" />
                <span>{isImporting ? 'Restoring & Syncing...' : 'Restore to Valut'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
