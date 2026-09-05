'use client';

import React from 'react';
import { CreditCard, Check, Sparkles } from '@/components/icons';

export function BillingSettings() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-6 md:px-12 md:py-8 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-semibold text-strong tracking-tight">Billing & Plans</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your subscription tier, invoices, and payment methods.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Plan
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Active
              </span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-strong">Valut Pro (Early Supporter)</h3>
          </div>
          <span className="font-mono text-2xl font-bold text-strong">$5<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
        </div>

        {/* Usage Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Saved bookmarks</span>
            <span className="font-mono font-medium text-foreground">30 / Unlimited</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted-foreground/15">
            <div className="h-full w-[15%] rounded-full bg-primary" />
          </div>
        </div>

        <div className="space-y-2 pt-2 text-xs">
          <div className="flex items-center gap-2 text-foreground">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>Unlimited cloud saves and cross-device sync</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>AI automated categorization & semantic search</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>Direct Chrome, Brave, and Edge extension integration</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            Next renewal: March 14, 2026
          </span>
          <button className="h-8 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-strong">Payment History</h3>
        <p className="text-xs text-muted-foreground">
          No previous invoices yet. All receipts are sent directly to your account email.
        </p>
      </div>
    </div>
  );
}
