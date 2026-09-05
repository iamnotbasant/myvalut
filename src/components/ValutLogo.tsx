import React from 'react';

interface ValutLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  glow?: boolean;
}

export function ValutLogo({
  size = 'md',
  showWordmark = false,
  className = '',
  glow = true,
}: ValutLogoProps) {
  const sizeMap = {
    xs: { icon: 16, text: 'text-xs' },
    sm: { icon: 20, text: 'text-sm' },
    md: { icon: 28, text: 'text-base' },
    lg: { icon: 36, text: 'text-xl' },
    xl: { icon: 48, text: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vault Emblem */}
      <div className="relative flex items-center justify-center">
        {glow && (
          <div
            className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 blur-sm opacity-80 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        )}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Dark Titanium Frame Gradient */}
            <linearGradient id="valut_frame" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2A2A32" />
              <stop offset="50%" stopColor="#18181D" />
              <stop offset="100%" stopColor="#0E0E12" />
            </linearGradient>

            {/* Glowing Accent Gradient */}
            <linearGradient id="valut_accent" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* Inset Bevel Shadow */}
            <linearGradient id="valut_bevel" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Hexagonal Vault Shell */}
          <path
            d="M24 3.5L41.5 13.5V33.5L24 43.5L6.5 33.5V13.5L24 3.5Z"
            fill="url(#valut_frame)"
            stroke="url(#valut_bevel)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner Geometric Shield Facets */}
          <path
            d="M24 6L39 15V32L24 41L9 32V15L24 6Z"
            fill="#121217"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Interlocking Dimensional "V" Emblem */}
          <path
            d="M16 16L24 32L32 16H27.5L24 23.5L20.5 16H16Z"
            fill="url(#valut_accent)"
          />

          {/* Core Vault Aperture Key */}
          <polygon
            points="24,25.5 27,31.5 21,31.5"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />

          {/* Subtle Security Node Dots */}
          <circle cx="24" cy="10" r="1.25" fill="#38BDF8" />
          <circle cx="35" cy="18" r="1.25" fill="#6366F1" />
          <circle cx="13" cy="18" r="1.25" fill="#38BDF8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-white ${currentSize.text}`}>
            Valut
          </span>
          <span className="inline-block size-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      )}
    </div>
  );
}
