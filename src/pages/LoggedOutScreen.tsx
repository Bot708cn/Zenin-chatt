import React from 'react';
import { LogOut, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const LoggedOutScreen: React.FC = () => {
  const { navigateTo } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#0070F3]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card matching Storyboard Screen 13 */}
      <div className="relative z-10 w-full max-w-md bg-[#070E1E]/90 border border-[#00F0FF]/25 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,114,255,0.15)] flex flex-col items-center text-center">
        {/* Logo */}
        <Logo size="lg" withText={true} glow={true} className="mb-6" />

        {/* Glowing Icon */}
        <div className="w-16 h-16 rounded-full bg-[#050C1B] border-2 border-[#00F0FF]/50 shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center mb-6">
          <LogOut className="w-7 h-7 text-[#00F0FF]" />
        </div>

        {/* Text matching Storyboard verbatim */}
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mb-2">
          Vous êtes déconnecté
        </h1>
        <p className="text-sm text-[#94A3B8] mb-8">
          À bientôt !
        </p>

        {/* Button [ Se reconnecter ] */}
        <button
          onClick={() => navigateTo('login')}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Se reconnecter</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
