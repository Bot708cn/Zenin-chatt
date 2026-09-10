import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withSlogan?: boolean;
  className?: string;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  withSlogan = false,
  className = '',
  glow = true,
}) => {
  // Dimensions
  const iconSizes = {
    xs: { w: 24, h: 24, text: 'text-base', slogan: 'text-[9px]' },
    sm: { w: 32, h: 32, text: 'text-lg', slogan: 'text-[10px]' },
    md: { w: 48, h: 48, text: 'text-2xl', slogan: 'text-xs' },
    lg: { w: 72, h: 72, text: 'text-3xl', slogan: 'text-sm' },
    xl: { w: 96, h: 96, text: 'text-4xl', slogan: 'text-sm' },
  };

  const current = iconSizes[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Subtle Ambient Electric Glow */}
        {glow && (
          <div
            className="absolute rounded-full pointer-events-none -z-10 blur-xl opacity-70"
            style={{
              width: `${current.w * 1.5}px`,
              height: `${current.h * 1.5}px`,
              background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(0,114,255,0.2) 60%, transparent 100%)',
            }}
          />
        )}

        {/* High-Fidelity Zenin Chatt 3D Origami Ribbon Z Logo */}
        <svg
          width={current.w}
          height={current.h}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Top Outer Ribbon Gradient */}
            <linearGradient id="zeninGradTopOuter" x1="20" y1="20" x2="100" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#00A2FF" />
              <stop offset="100%" stopColor="#0066FF" />
            </linearGradient>

            {/* Bottom Outer Ribbon Gradient */}
            <linearGradient id="zeninGradBottomOuter" x1="100" y1="100" x2="20" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#0099FF" />
              <stop offset="100%" stopColor="#0052D4" />
            </linearGradient>

            {/* Inner Fold Shadows */}
            <linearGradient id="zeninFoldShadow" x1="40" y1="40" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#003566" />
              <stop offset="50%" stopColor="#001833" />
              <stop offset="100%" stopColor="#000D1A" />
            </linearGradient>

            {/* Specular Highlight Gradient */}
            <linearGradient id="zeninHighlight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0F7FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </linearGradient>

            {/* Neon Filter */}
            <filter id="zeninNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00F0FF" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Core Ribbon Geometric Form (Isometric Monogram 'Z' Diamond Fold) */}
          <g filter="url(#zeninNeonGlow)">
            {/* Upper folded ribbon segment */}
            <path
              d="M 28 42 L 56 16 C 62 10 74 10 82 18 L 96 32 C 102 38 100 48 92 56 L 68 80 L 46 58 L 74 30 L 62 20 L 28 54 Z"
              fill="url(#zeninGradTopOuter)"
            />

            {/* Inner Dark Fold Facet for 3D depth */}
            <path
              d="M 46 58 L 68 80 L 52 96 C 46 102 36 102 28 94 L 20 86 C 14 80 16 70 24 62 L 46 58 Z"
              fill="url(#zeninFoldShadow)"
            />

            {/* Lower symmetrical returning ribbon */}
            <path
              d="M 92 78 L 64 104 C 58 110 46 110 38 102 L 24 88 C 18 82 20 72 28 64 L 52 40 L 74 62 L 46 90 L 58 100 L 92 66 Z"
              fill="url(#zeninGradBottomOuter)"
            />

            {/* Dynamic sharp edge highlights */}
            <path
              d="M 56 16 L 82 18 L 96 32"
              stroke="url(#zeninHighlight)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 64 104 L 38 102 L 24 88"
              stroke="url(#zeninHighlight)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 38 52 L 68 22"
              stroke="#00F0FF"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              strokeLinecap="round"
            />
            <path
              d="M 82 68 L 52 98"
              stroke="#00F0FF"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col items-center mt-2.5 select-none">
          <div className={`font-extrabold tracking-wide flex items-center gap-1.5 ${current.text}`}>
            <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Zenin</span>
            <span className="text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">Chatt</span>
          </div>

          {withSlogan && (
            <div className={`text-[#38BDF8] font-medium tracking-widest mt-1 uppercase flex items-center gap-2 ${current.slogan}`}>
              <span>Étudier</span>
              <span className="w-1 h-1 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
              <span>Échanger</span>
              <span className="w-1 h-1 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
              <span>Réussir</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
