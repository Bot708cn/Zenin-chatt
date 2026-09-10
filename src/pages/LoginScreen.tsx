import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, HelpCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const LoginScreen: React.FC = () => {
  const { login, navigateTo, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // Facebook OAuth info modal
  const [showFacebookModal, setShowFacebookModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudentLogin = async () => {
    setEmail('etudiant@zenin.chatt');
    setPassword('zenin2026');
    setLoading(true);
    try {
      await login('etudiant@zenin.chatt', 'zenin2026');
    } catch (err) {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotStatus(res.message);
    } catch (e: any) {
      setForgotStatus(e.message || 'Erreur lors de l’envoi.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0070F3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md bg-[#070E1E]/90 border border-[#00F0FF]/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,114,255,0.15)] flex flex-col items-center">
        {/* Logo */}
        <Logo size="lg" withText={true} glow={true} className="mb-6" />

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mb-6">
          Se connecter
        </h1>

        {/* Global Error Banner */}
        {error && (
          <div className="w-full mb-4 p-3.5 rounded-xl bg-[#1E1120] border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0 shadow-[0_0_6px_#ef4444]" />
            <span className="flex-1 leading-relaxed">{error}</span>
            <button
              onClick={clearError}
              className="text-gray-400 hover:text-white text-xs cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Buttons as in Storyboard:
            1. [ Se connecter avec Email ]
            2. [ Se connecter avec Facebook ] */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowEmailForm(true)}
            className={`w-full py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              showEmailForm
                ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-white shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] scale-[1.01]'
                : 'bg-[#0B152B] border border-[#00F0FF]/30 text-white hover:border-[#00F0FF]/60'
            }`}
          >
            <Mail className="w-4 h-4 text-white" />
            <span>Se connecter avec Email</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFacebookModal(true)}
            className="w-full py-3 px-5 rounded-2xl bg-[#091124] border border-[#00F0FF]/25 hover:border-[#00F0FF]/60 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#0E1A38] cursor-pointer"
          >
            {/* Facebook F Logo in clean monochrome / blue */}
            <svg className="w-4 h-4 fill-[#00F0FF]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continuer avec Facebook</span>
          </button>
        </div>

        {/* Separator */}
        <div className="w-full flex items-center gap-3 my-2 mb-6">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#00F0FF]/20" />
          <span className="text-xs text-[#64748B] font-medium uppercase tracking-wider">ou</span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#00F0FF]/20" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5 tracking-wide">
              Adresse Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#00F0FF]/70 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="etudiant@zenin.chatt"
                className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-[#00F0FF]/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#94A3B8] tracking-wide">
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-[#00F0FF]/80 hover:text-[#00F0FF] hover:underline cursor-pointer"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#00F0FF]/70 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-[#00F0FF]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#64748B] hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Link */}
        <div className="w-full mt-4 p-2.5 rounded-xl bg-[#091124] border border-[#00F0FF]/20 flex items-center justify-between">
          <div className="text-[11px] text-[#94A3B8]">
            <span className="text-[#00F0FF] font-medium">Test rapide :</span> Compte étudiant de démo
          </div>
          <button
            type="button"
            onClick={handleDemoStudentLogin}
            className="text-[11px] text-white bg-[#0066FF]/40 hover:bg-[#0066FF] border border-[#00F0FF]/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
          >
            Remplir & Connexion
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="w-full mt-6 pt-5 border-t border-[#00F0FF]/15 flex flex-col items-center gap-3">
          <div className="text-xs text-[#94A3B8] flex items-center gap-1.5">
            <span>Pas encore de compte ?</span>
            <button
              onClick={() => navigateTo('register')}
              className="text-[#00F0FF] font-semibold hover:underline cursor-pointer tracking-wide"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#091124] border border-[#00F0FF]/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.25)]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00F0FF]" />
              Réinitialisation du mot de passe
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Saisissez l'adresse email associée à votre compte Zenin Chatt pour recevoir les instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="votre-email@exemple.com"
                className="w-full bg-[#050B17] border border-[#00F0FF]/30 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#00F0FF]"
              />

              {forgotStatus && (
                <div className="text-xs text-[#00F0FF] bg-[#00F0FF]/10 p-2.5 rounded-lg border border-[#00F0FF]/20">
                  {forgotStatus}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStatus(null);
                  }}
                  className="px-3.5 py-2 text-xs text-gray-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-[0_0_12px_#00F0FF]/40"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Facebook OAuth Clean Modal / Notice */}
      {showFacebookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#091124] border border-[#00F0FF]/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.25)]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] font-bold text-xs">f</span>
              Connexion Facebook OAuth
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
              L'intégration Facebook SSO est prête dans l'architecture backend. Pour connecter les utilisateurs avec Facebook en environnement de production réel, configurez vos variables dans le fichier <code className="text-[#00F0FF]">.env</code> :
            </p>
            <div className="bg-[#030712] border border-[#00F0FF]/20 p-2.5 rounded-xl font-mono text-[11px] text-[#38BDF8] mb-4 space-y-1">
              <div>FACEBOOK_APP_ID="votre_id"</div>
              <div>FACEBOOK_APP_SECRET="votre_secret"</div>
            </div>
            <p className="text-[11px] text-[#64748B] mb-4">
              En attendant, vous pouvez utiliser la connexion Email classique ou le compte étudiant de démonstration.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowFacebookModal(false)}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052D4] text-white text-xs font-medium rounded-xl cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
