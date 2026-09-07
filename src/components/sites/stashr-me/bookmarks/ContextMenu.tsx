'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
  title?: string;
}

export function ContextMenu({
  isOpen,
  position,
  items,
  onClose,
  title
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click or escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen || items.length === 0 || !mounted) return null;

  // Calculate safe coordinates inside viewport
  const menuWidth = 224;
  const menuHeight = items.length * 36 + (title ? 36 : 0) + 20;
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  let x = position.x;
  let y = position.y;

  if (x + menuWidth > screenWidth - 12) {
    x = Math.max(12, screenWidth - menuWidth - 12);
  }
  if (y + menuHeight > screenHeight - 12) {
    y = Math.max(12, screenHeight - menuHeight - 12);
  }

  const menuElement = (
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="fixed z-[9999] w-56 rounded-xl border border-white/[0.14] bg-[#121214]/95 backdrop-blur-xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] animate-in fade-in zoom-in-95 duration-150 select-none text-xs"
      onClick={e => e.stopPropagation()}
      onContextMenu={e => e.preventDefault()}
    >
      {title && (
        <div className="px-2.5 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-white/[0.08] mb-1 truncate flex items-center justify-between">
          <span className="truncate">{title}</span>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {items.map(item => {
          if (item.separator) {
            return (
              <div
                key={item.id}
                className="my-1 h-px bg-white/[0.08] -mx-1"
              />
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                onClose();
                item.onClick?.();
              }}
              className={`group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-normal transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                item.danger
                  ? 'text-rose-400 hover:bg-rose-500/15 hover:text-rose-300'
                  : 'text-neutral-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {item.icon && (
                  <span
                    className={`size-3.5 shrink-0 flex items-center justify-center ${
                      item.danger
                        ? 'text-rose-400 group-hover:text-rose-300'
                        : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="truncate">{item.label}</span>
              </div>

              {item.shortcut && (
                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-neutral-300">
                  {item.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return createPortal(menuElement, document.body);
}
