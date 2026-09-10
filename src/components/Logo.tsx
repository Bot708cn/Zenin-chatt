import React, { useState } from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withSlogan?: boolean;
  className?: string;
  glow?: boolean;
  layout?: 'auto' | 'vertical' | 'horizontal';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  withSlogan = false,
  className = '',
  glow = true,
  layout = 'auto',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // Scaled dimensions
  const iconSizes = {
    xs: { icon: 28, text: 'text-base', slogan: 'text-[9px]', gap: 'gap-2' },
    sm: { icon: 38, text: 'text-xl', slogan: 'text-[10px]', gap: 'gap-2.5' },
    md: { icon: 54, text: 'text-2xl', slogan: 'text-xs', gap: 'gap-3' },
    lg: { icon: 84, text: 'text-3xl', slogan: 'text-xs', gap: 'gap-3.5' },
    xl: { icon: 110, text: 'text-4xl', slogan: 'text-sm', gap: 'gap-4' },
  };

  const current = iconSizes[size];
  const isHorizontal = layout === 'horizontal' || (layout === 'auto' && (size === 'xs' || size === 'sm'));

  // SVG Fallback if image cannot be loaded
  const renderSvgFallback = () => (
    <svg
      width={current.icon}
      height={current.icon}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 hover:scale-105"
    >
      <defs>
        <linearGradient id="svgTopFacet" x1="160" y1="140" x2="352" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="60%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#0055FF" />
        </linearGradient>
        <linearGradient id="svgTopShadow" x1="220" y1="180" x2="330" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0055D4" />
          <stop offset="100%" stopColor="#001845" />
        </linearGradient>
        <linearGradient id="svgBottomFacet" x1="352" y1="372" x2="160" y2="272" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#0077FF" />
          <stop offset="100%" stopColor="#0044DD" />
        </linearGradient>
        <linearGradient id="svgBottomShadow" x1="292" y1="332" x2="182" y2="242" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0055D4" />
          <stop offset="100%" stopColor="#001438" />
        </linearGradient>
        <filter id="svgNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#00F0FF" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter="url(#svgNeonGlow)">
        <path d="M 152 208 L 240 128 C 248 120 264 120 272 128 L 348 196 C 356 204 354 218 344 226 L 298 266 L 254 226 L 314 178 L 256 142 L 176 216 Z" fill="url(#svgTopFacet)" />
        <path d="M 298 266 L 254 226 L 244 236 L 256 264 C 262 278 274 286 288 284 Z" fill="url(#svgTopShadow)" />
        <path d="M 360 304 L 272 384 C 264 392 248 392 240 384 L 164 316 C 156 308 158 294 168 286 L 214 246 L 258 286 L 198 334 L 256 370 L 336 296 Z" fill="url(#svgBottomFacet)" />
        <path d="M 214 246 L 258 286 L 268 276 L 256 248 C 250 234 238 226 224 228 Z" fill="url(#svgBottomShadow)" />
      </g>
    </svg>
  );

  return (
    <div
      className={`flex ${isHorizontal ? 'flex-row items-center' : 'flex-col items-center justify-center'} ${current.gap} ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        {/* Ambient Neon Cyan Aura */}
        {glow && (
          <div
            className="absolute rounded-full pointer-events-none -z-10 blur-xl opacity-75"
            style={{
              width: `${current.icon * 1.5}px`,
              height: `${current.icon * 1.5}px`,
              background:
                'radial-gradient(circle, rgba(0,240,255,0.45) 0%, rgba(0,102,255,0.2) 60%, transparent 100%)',
            }}
          />
        )}

        {/* Authentic Zenin Chatt Emblem */}
        {!imgFailed ? (
          <img
            src="/emblem.png"
            alt="Zenin Chatt Logo"
            width={current.icon}
            height={current.icon}
            onError={() => setImgFailed(true)}
            className="object-contain rounded-xl drop-shadow-[0_0_14px_rgba(0,240,255,0.5)] transition-transform duration-300 hover:scale-105 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        ) : (
          renderSvgFallback()
        )}
      </div>

      {withText && (
        <div
          className={`flex flex-col ${isHorizontal ? 'items-start text-left' : 'items-center text-center'} select-none`}
        >
          <span
            className={`font-['Pacifico',cursive] tracking-wide leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-[#DCF3FF] to-[#38BDF8] drop-shadow-[0_2px_10px_rgba(0,240,255,0.4)] ${current.text}`}
          >
            Zenin Chatt
          </span>

          {withSlogan && (
            <div
              className={`text-[#38BDF8] font-semibold tracking-widest mt-2 uppercase flex items-center gap-2 ${current.slogan}`}
            >
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
