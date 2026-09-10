import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const RegisterScreen: React.FC = () => {
  const { register, navigateTo, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError('Le nom complet est obligatoire.');
      return;
    }
    if (!email.trim()) {
      setLocalError('L’adresse email est obligatoire.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, confirmPassword);
    } catch (err: any) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const currentError = localError || error;

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#0070F3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-[#070E1E]/90 border border-[#00F0FF]/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,114,255,0.15)] flex flex-col items-center">
        {/* Logo */}
        <Logo size="lg" withText={true} glow={true} className="mb-4" />

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Créer un compte
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Entrez vos informations
          </p>
        </div>

        {/* Error notification */}
        {currentError && (
          <div className="w-full mb-4 p-3.5 rounded-xl bg-[#1E1120] border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0 shadow-[0_0_6px_#ef4444]" />
            <span className="flex-1 leading-relaxed">{currentError}</span>
            <button
              onClick={() => {
                setLocalError(null);
                clearError();
              }}
              className="text-gray-400 hover:text-white text-xs cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
          {/* Nom complet */}
          <div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#00F0FF]/70 pointer-events-none">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom complet"
                className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-[#00F0FF]/20"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#00F0FF]/70 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-[#00F0FF]/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#00F0FF]/70 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
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

          {/* Confirm Password */}
          <div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#00F0FF]/70 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:ring-2 focus:ring-[#00F0FF]/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-[#64748B] hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* S'inscrire Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>S'inscrire</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="w-full flex items-center gap-3 my-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#00F0FF]/20" />
          <span className="text-xs text-[#64748B] font-medium uppercase tracking-wider">ou</span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#00F0FF]/20" />
        </div>

        {/* S'inscrire avec Facebook */}
        <button
          type="button"
          onClick={() => {
            alert('Pour activer Facebook OAuth, renseignez FACEBOOK_APP_ID dans le fichier .env');
          }}
          className="w-full py-3 px-5 rounded-2xl bg-[#091124] border border-[#00F0FF]/25 hover:border-[#00F0FF]/60 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#0E1A38] cursor-pointer"
        >
          <svg className="w-4 h-4 fill-[#00F0FF]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>S'inscrire avec Facebook</span>
        </button>

        {/* Footer link */}
        <div className="w-full mt-6 pt-4 border-t border-[#00F0FF]/15 flex items-center justify-center gap-1.5 text-xs text-[#94A3B8]">
          <span>Déjà un compte ?</span>
          <button
            onClick={() => navigateTo('login')}
            className="text-[#00F0FF] font-semibold hover:underline cursor-pointer tracking-wide"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};
