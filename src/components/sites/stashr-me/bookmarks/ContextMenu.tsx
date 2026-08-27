'use client';

import React, { useEffect, useRef } from 'react';

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

  if (!isOpen || items.length === 0) return null;

  // Calculate safe coordinates inside viewport
  const menuWidth = 200;
  const menuHeight = items.length * 34 + (title ? 30 : 0) + 16;
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  let x = position.x;
  let y = position.y;

  if (x + menuWidth > screenWidth - 10) {
    x = Math.max(10, screenWidth - menuWidth - 10);
  }
  if (y + menuHeight > screenHeight - 10) {
    y = Math.max(10, screenHeight - menuHeight - 10);
  }

  return (
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="fixed z-50 w-52 rounded-xl border border-white/[0.12] bg-[#121212]/95 backdrop-blur-md p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-100 select-none text-xs"
      onClick={e => e.stopPropagation()}
      onContextMenu={e => e.preventDefault()}
    >
      {title && (
        <div className="px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-white/[0.08] mb-1 truncate">
          {title}
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
}
