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
          className="relative shrink-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Heavy Steel Vault Rim Gradient */}
            <linearGradient id="vault_outer_steel" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3A3A46" />
              <stop offset="35%" stopColor="#22222B" />
              <stop offset="70%" stopColor="#15151C" />
              <stop offset="100%" stopColor="#0B0B0F" />
            </linearGradient>

            {/* Inner Vault Door Chamber Gradient */}
            <radialGradient id="vault_chamber" cx="24" cy="24" r="18" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1B1C24" />
              <stop offset="75%" stopColor="#101015" />
              <stop offset="100%" stopColor="#08080B" />
            </radialGradient>

            {/* Metallic Wheel Handle Gradient */}
            <linearGradient id="vault_wheel_grad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="45%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>

            {/* Bolt Rivet Metallic Gradient */}
            <radialGradient id="vault_bolt_grad" cx="0.35" cy="0.35" r="0.65">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>

            {/* Inset Chamfer Bevel */}
            <linearGradient id="vault_bevel" x1="24" y1="3" x2="24" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.7" />
            </linearGradient>

            {/* Glowing Core Dial */}
            <radialGradient id="vault_core_glow" cx="24" cy="24" r="5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="70%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
          </defs>

          {/* 1. Heavy Vault Outer Door Ring */}
          <circle
            cx="24"
            cy="24"
            r="21"
            fill="url(#vault_outer_steel)"
            stroke="url(#vault_bevel)"
            strokeWidth="1.75"
          />

          {/* 2. Concentric Steel Perimeter Ridge */}
          <circle
            cx="24"
            cy="24"
            r="16.5"
            fill="url(#vault_chamber)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.2"
          />

          {/* 3. Perimeter Locking Bolts (8 Heavy Steel Vault Rivets) */}
          <circle cx="24" cy="5.75" r="1.4" fill="url(#vault_bolt_grad)" />
          <circle cx="36.9" cy="11.1" r="1.4" fill="url(#vault_bolt_grad)" />
          <circle cx="42.25" cy="24" r="1.4" fill="url(#vault_bolt_grad)" />
          <circle cx="36.9" cy="36.9" r="1.4" fill="url(#vault_bolt_grad)" />
          <circle cx="24" cy="42.25" r="1.4" fill="url(#vault_bolt_grad)" />
          <circle cx="11.1" cy="36.9" r="1.4" fill="url(#vault_bolt_grad)" />
          <circle cx="5.75" cy="24" r="1.4" fill="url(#vault_bolt_grad)" />
          <circle cx="11.1" cy="11.1" r="1.4" fill="url(#vault_bolt_grad)" />

          {/* 4. Combination Dial Calibrations / Tick Marks */}
          <circle
            cx="24"
            cy="24"
            r="13"
            stroke="#38BDF8"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="1.5 2.5"
          />

          {/* 5. Safe Wheel Spoke Handles (Horizontal & Vertical Cylinders) */}
          <line
            x1="24"
            y1="12"
            x2="24"
            y2="36"
            stroke="url(#vault_wheel_grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="24"
            x2="36"
            y2="24"
            stroke="url(#vault_wheel_grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* 6. Rotating Safe Wheel Rim */}
          <circle
            cx="24"
            cy="24"
            r="8.5"
            fill="none"
            stroke="url(#vault_wheel_grad)"
            strokeWidth="2.25"
          />

          {/* 7. Center Combination Dial Hub */}
          <circle
            cx="24"
            cy="24"
            r="4.75"
            fill="url(#vault_core_glow)"
            stroke="#FFFFFF"
            strokeOpacity="0.4"
            strokeWidth="1"
          />

          {/* 8. Keyway / Center Locking Aperture */}
          <circle cx="24" cy="23" r="1.2" fill="#FFFFFF" fillOpacity="0.95" />
          <polygon points="23.3,23 24.7,23 24.4,26.2 23.6,26.2" fill="#FFFFFF" fillOpacity="0.95" />
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
