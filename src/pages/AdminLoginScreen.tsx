import React, { useState } from 'react';
import { Lock, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const AdminLoginScreen: React.FC = () => {
  const { adminLogin, navigateTo, error, clearError } = useAuth();
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretCode.trim()) return;

    setLoading(true);
    try {
      await adminLogin(secretCode.trim());
    } catch (e) {
      // Handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleFillTestCode = () => {
    setSecretCode('z?e?n?i?n?#?c?h?a?t?t?');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#0070F3]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-[#070E1E]/90 border border-[#00F0FF]/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,114,255,0.2)] flex flex-col items-center">
        {/* Return to user app */}
        <div className="w-full flex justify-start mb-2">
          <button
            onClick={() => navigateTo('login')}
            className="text-xs text-[#64748B] hover:text-[#00F0FF] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Espace étudiant</span>
          </button>
        </div>

        {/* Logo */}
        <Logo size="lg" withText={true} glow={true} className="mb-6" />

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mb-6">
          Accès administrateur
        </h1>

        {/* Error notification */}
        {error && (
          <div className="w-full mb-4 p-3.5 rounded-xl bg-[#1E1120] border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <span className="flex-1 leading-relaxed">{error}</span>
            <button
              onClick={clearError}
              className="text-gray-400 hover:text-white text-xs cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5 tracking-wide">
              Code secret administrateur
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#00F0FF]/70 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Entrez le code secret"
                className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-[#00F0FF]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Valider</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Storyboard #6 Test code display */}
        <div className="w-full mt-6 pt-5 border-t border-[#00F0FF]/15 flex flex-col items-center gap-2">
          <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
            <span>Code secret initial de test :</span>
          </div>

          <button
            type="button"
            onClick={handleFillTestCode}
            className="font-mono text-xs text-[#00F0FF] hover:underline bg-[#00F0FF]/10 px-3 py-1.5 rounded-xl border border-[#00F0FF]/30 tracking-wider transition-all cursor-pointer"
            title="Cliquer pour insérer automatiquement"
          >
            z?e?n?i?n?#?c?h?a?t?t?
          </button>
        </div>
      </div>
    </div>
  );
};
