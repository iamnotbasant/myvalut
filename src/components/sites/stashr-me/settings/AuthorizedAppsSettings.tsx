'use client';

import React, { useState } from 'react';
import { Shield, ExternalLink, Trash2 } from '@/components/icons';

export function AuthorizedAppsSettings() {
  const [apps, setApps] = useState([
    {
      id: 'app-chrome',
      name: 'Valut Chrome Extension',
      description: 'Official browser extension for instant 1-click bookmark capturing.',
      authorizedDate: 'Aug 10, 2026',
      permissions: ['Read & write bookmarks', 'Sync tags']
    }
  ]);

  const handleRevoke = (id: string) => {
    setApps(apps.filter(a => a.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-9 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      <div>
        <h2 className="text-sm font-semibold text-strong tracking-tight">Authorized apps</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage third-party applications and browser extensions connected to your Valut account.
        </p>
      </div>

      <div className="space-y-3">
        {apps.map(app => (
          <div
            key={app.id}
            className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/40 text-foreground">
                <Shield className="size-4.5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-strong">{app.name}</h4>
                <p className="text-xs text-muted-foreground">{app.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {app.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRevoke(app.id)}
              className="rounded-xl border border-input bg-card px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors shadow-xs"
            >
              Revoke
            </button>
          </div>
        ))}

        {apps.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
            No authorized applications found.
          </div>
        )}
      </div>
    </div>
  );
}
