import React, { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (isAuthenticated) {
              navigateTo('app-chat');
            } else {
              navigateTo('login');
            }
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigateTo]);

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Subtle Tech Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,114,255,0.12),transparent)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-700">
        {/* Logo */}
        <Logo size="xl" withText={true} withSlogan={true} glow={true} className="mb-12" />

        {/* Progress bar container */}
        <div className="w-full max-w-[260px] flex flex-col items-center gap-3">
          <div className="w-full h-1.5 bg-[#0b1329] border border-[#00f0ff]/20 rounded-full overflow-hidden p-0.5 shadow-[0_0_15px_rgba(0,114,255,0.2)]">
            <div
              className="h-full bg-gradient-to-r from-[#00F0FF] via-[#0099FF] to-[#0055FF] rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_#00F0FF]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-xs text-[#94A3B8]">
            <span className="tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_6px_#00F0FF]" />
              Chargement...
            </span>
            <span className="text-[#00F0FF] font-mono font-medium">{Math.min(progress, 100)}%</span>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={() => navigateTo('login')}
          className="mt-8 text-xs text-[#64748B] hover:text-[#00F0FF] transition-colors cursor-pointer py-1.5 px-3 rounded-full border border-transparent hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5"
        >
          Passer l'introduction →
        </button>
      </div>

      {/* Footer minimal tag */}
      <div className="absolute bottom-6 text-[11px] text-[#475569] tracking-wider">
        Zenin Chatt • Version 1.0.0
      </div>
    </div>
  );
};
