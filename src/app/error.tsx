'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0c] text-white text-center">
      <div className="size-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/5">
        <AlertTriangle className="size-6" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-white mb-1.5">
        Something went wrong
      </h2>
      <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed">
        {error?.message || 'An unexpected error occurred while displaying this page.'}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-neutral-300 font-medium text-xs hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Home className="size-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
