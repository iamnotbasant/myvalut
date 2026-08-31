'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { wipeAllVaultDataFromDb } from '@/lib/supabase-db';
import { soundFx } from '@/lib/sound-effects';
import {
  LogIn,
  LogOut,
  User,
  Mail,
  Shield,
  Trash2,
  AlertTriangle,
  Check,
  Copy,
  RefreshCw,
  Database
} from 'lucide-react';

export function AccountSettings() {
  const { user, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const handleCopyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      soundFx.playClickSound();
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSignOut = () => {
    soundFx.playClickSound();
    signOut();
  };

  const handleResetAllData = async () => {
    setIsResetting(true);
    soundFx.playArchiveSound();

    try {
      // 1. Call API reset route
      try {
        await fetch('/api/vault/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id || null })
        });
      } catch (apiErr) {
        console.warn('API reset fallback:', apiErr);
      }

      // 2. Direct client DB wipe
      try {
        await wipeAllVaultDataFromDb(user?.id || null);
      } catch (dbErr) {
        console.warn('Direct DB wipe fallback:', dbErr);
      }

      // 3. Clear ALL localStorage items
      if (typeof window !== 'undefined') {
        const allVaultKeys = [
          'stashr_bookmarks_v3',
          'stashr_collections_v3',
          'stashr_tags_v3',
          'stashr_pinned_creators_v1',
          'stashr_custom_tags_v1',
          'stashr_system_logs_v1',
          'stashr_bookmarks',
          'stashr_collections',
          'stashr_tags',
          'stashr_pinned_creators',
          'stashr_filter_state',
          'stashr_view_mode',
          'stashr_grid_columns',
          'stashr_mosaic_columns'
        ];
        allVaultKeys.forEach(k => localStorage.removeItem(k));
      }

      setResetSuccess(true);
      setTimeout(() => {
        window.location.replace('/');
      }, 800);
    } catch (err) {
      console.error('Reset all data error:', err);
      // Even on error, clear local storage and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('stashr_bookmarks_v3');
        localStorage.removeItem('stashr_collections_v3');
        localStorage.removeItem('stashr_tags_v3');
        window.location.replace('/');
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      {/* 1. Account & Profile Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Account & Profile</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal profile, cloud sync status, and active session.
          </p>
        </div>

        {user ? (
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xl font-bold border border-primary/30 shadow-xs">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="font-semibold text-base text-foreground truncate">
                    {user.email?.split('@')[0]}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>{user.email}</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 pt-0.5">
                    <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Cloud Database Connected (Supabase)</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 text-xs font-medium text-destructive hover:bg-destructive/20 transition-all cursor-pointer shadow-xs active:scale-95 self-start sm:self-auto"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>User ID:</span>
                <span className="font-mono text-foreground text-[11px] bg-muted/60 px-2 py-0.5 rounded-md">
                  {user.id}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUserId}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {copiedId ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 text-center space-y-4 shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-xs">
              <User className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Guest Mode</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                You are currently browsing locally. Sign in or create an account to permanently sync bookmarks, collections, and AI tags across all your devices.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.playClickSound();
                setIsAuthOpen(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer active:scale-95"
            >
              <LogIn className="size-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Security & Storage Section */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Security & Storage</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your vault data is protected with Row Level Security (RLS).
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Database className="size-4 text-primary" />
            <span>Vault Data Security</span>
          </div>
          <p>• Only your authenticated account can access, create, or modify your stored bookmarks.</p>
          <p>• Offline caching enables instant zero-latency loading and search without internet delays.</p>
        </div>
      </div>

      {/* 3. DANGER ZONE: Reset / Wipe All Data */}
      <div className="space-y-3 pt-4 border-t border-destructive/20">
        <div>
          <h2 className="text-sm font-semibold text-destructive tracking-tight flex items-center gap-1.5">
            <AlertTriangle className="size-4" />
            <span>Danger Zone: Reset Vault Data</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanently wipe all bookmarks, collections, tags, notes, and local storage caches.
          </p>
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-foreground">Factory Reset Vault</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This action will completely erase all your saved items, tags, collections, system logs, and cached media. Once wiped, this data cannot be recovered.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              setConfirmInput('');
              setIsResetModalOpen(true);
            }}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-destructive px-4 text-xs font-medium text-destructive-foreground shadow-xs hover:bg-destructive/90 transition-all cursor-pointer active:scale-95"
          >
            <Trash2 className="size-3.5" />
            <span>Reset All Vault Data</span>
          </button>
        </div>
      </div>

      {/* 4. Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div
          onClick={() => setIsResetModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-destructive/40 bg-[#121212] p-6 text-foreground shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/20 text-destructive border border-destructive/30">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-foreground">Wipe All Vault Data?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-neutral-300 space-y-1.5 leading-relaxed">
              <p className="font-medium text-destructive">⚠️ What will happen:</p>
              <p>• All saved bookmarks will be deleted.</p>
              <p>• All custom tags and collections will be deleted.</p>
              <p>• Local storage and cloud database will be wiped clean.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Type <span className="font-mono text-destructive font-bold">RESET</span> below to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={e => setConfirmInput(e.target.value)}
                placeholder="Type RESET"
                className="w-full h-9 rounded-xl border border-input bg-card/60 px-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                disabled={isResetting}
                className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetAllData}
                disabled={confirmInput.trim().toUpperCase() !== 'RESET' || isResetting}
                className="h-9 px-4 rounded-xl bg-destructive text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Wiping Data...</span>
                  </>
                ) : resetSuccess ? (
                  <>
                    <Check className="size-3.5" />
                    <span>Wiped! Reloading...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>Confirm Wipe & Reset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
