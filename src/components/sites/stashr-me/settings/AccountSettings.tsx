'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Check, Trash2, Camera } from '@/components/icons';

export function AccountSettings() {
  const [name, setName] = useState('Basant');
  const [email, setEmail] = useState('basant@stashr.me');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-6 md:px-12 md:py-8 animate-in fade-in duration-150">
      {/* Profile Header */}
      <div>
        <h2 className="text-xl font-semibold text-strong tracking-tight">Account settings</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your personal details, profile avatar, and account preferences.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-amber-500 to-violet-500 text-2xl font-bold text-white shadow-xs">
          B
          <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-background bg-card text-muted-foreground shadow-xs">
            <Camera className="size-3" />
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-strong">Profile photo</h4>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, or WebP (max 5MB)
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button className="h-8 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors">
              Change photo
            </button>
            <button className="h-8 rounded-lg px-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-strong border-b border-border pb-3">
          Profile information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            {saved ? 'Changes saved successfully!' : 'Your profile is publicly visible to collaborators.'}
          </span>
          <button
            type="submit"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
          >
            {saved && <Check className="size-3.5" />}
            <span>{saved ? 'Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="space-y-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
        <p className="text-xs text-muted-foreground">
          Permanently delete your Stashr account and all stored bookmarks, collections, notes, and tags. This action cannot be undone.
        </p>
        <div className="pt-2">
          <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-destructive bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 shadow-xs transition-colors">
            <Trash2 className="size-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
