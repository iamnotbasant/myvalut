'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { LogIn, LogOut, User, Mail, Shield, Key } from 'lucide-react';

export function AccountSettings() {
  const { user, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      {/* 1. Profile Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Account Profile</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your authenticated personal vault session.
          </p>
        </div>

        {user ? (
          <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold border border-primary/25 shadow-xs">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {user.email?.split('@')[0]}
                </h3>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                  <Mail className="size-3" />
                  <span>{user.email}</span>
                </p>
                <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
                  <Shield className="size-3" />
                  <span>Cloud Database Connected (Supabase)</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <div className="text-[11px] text-muted-foreground">
                User ID: <span className="font-mono text-foreground/80">{user.id.slice(0, 12)}...</span>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card/60 p-5 text-center space-y-3 shadow-xs">
            <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <User className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">Guest Mode</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You are currently not signed in. Sign in or create an account to permanently sync bookmarks across all your devices.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex h-8.5 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <LogIn className="size-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Security Section */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Cloud Security & Data</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your data is encrypted and isolated with Supabase Row Level Security.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-3.5 text-xs text-muted-foreground space-y-1">
          <p>• Only your authenticated account has access to your bookmarks.</p>
          <p>• Offline cache is automatically updated in your browser.</p>
        </div>
      </div>

      {/* 3. Delete Account Section */}
      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Delete account</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanently remove your account and all associated bookmarks from the database.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setDeletionRequested(true)}
            className="inline-flex h-8.5 items-center gap-2 rounded-xl border border-input bg-card/80 px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent shadow-xs cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-muted-foreground">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>{deletionRequested ? 'Request received' : 'Request account deletion'}</span>
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
