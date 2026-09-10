import React, { useState } from 'react';
import { Clock, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const PendingScreen: React.FC = () => {
  const { navigateTo, pendingUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const [statusResult, setStatusResult] = useState<{ checked: boolean; approved: boolean; message: string } | null>(null);

  const handleCheckStatus = async () => {
    if (!pendingUser?.email) {
      navigateTo('login');
      return;
    }
    setChecking(true);
    setStatusResult(null);
    try {
      // Try to check user status via login attempt or public check
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingUser.email, password: 'check' }),
      });
      const data = await res.json();
      if (data.status === 'PENDING') {
        setStatusResult({
          checked: true,
          approved: false,
          message: 'Votre compte est toujours en attente de validation par un administrateur.',
        });
      } else if (data.status === 'REJECTED') {
        setStatusResult({
          checked: true,
          approved: false,
          message: 'Votre demande d’inscription a été refusée.',
        });
      } else {
        setStatusResult({
          checked: true,
          approved: true,
          message: 'Félicitations ! Votre compte a été validé. Vous pouvez maintenant vous connecter.',
        });
      }
    } catch (e) {
      setStatusResult({
        checked: true,
        approved: false,
        message: 'Impossible de vérifier le statut pour l’instant.',
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-[#070E1E]/90 border border-[#00F0FF]/25 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,114,255,0.15)] flex flex-col items-center text-center">
        {/* Logo */}
        <Logo size="lg" withText={true} glow={true} className="mb-8" />

        {/* Glowing Clock Icon matching Storyboard screen 4 */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-2 rounded-full bg-[#00F0FF]/20 blur-md animate-pulse" />
          <div className="w-20 h-20 rounded-full bg-[#050C1B] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center justify-center">
            <Clock className="w-9 h-9 text-[#00F0FF]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mb-3">
          Compte en attente
        </h1>

        {/* Message matching storyboard verbatim */}
        <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-xs">
          Votre inscription a bien été envoyée ! Elle doit être validée par l'administrateur.
          Vous recevrez une notification dès que votre compte sera approuvé.
        </p>

        {pendingUser?.email && (
          <div className="w-full mb-6 p-2.5 rounded-xl bg-[#091124] border border-[#00F0FF]/20 text-xs text-[#38BDF8] font-mono">
            {pendingUser.email}
          </div>
        )}

        {/* Status result banner if checked */}
        {statusResult && (
          <div
            className={`w-full mb-5 p-3 rounded-xl text-xs flex items-center gap-2 text-left ${
              statusResult.approved
                ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF]'
                : 'bg-[#0E1B38] border border-[#00F0FF]/20 text-[#94A3B8]'
            }`}
          >
            {statusResult.approved ? (
              <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-[#00F0FF]/70 shrink-0" />
            )}
            <span>{statusResult.message}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigateTo('login')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la connexion</span>
          </button>

          {pendingUser?.email && (
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full py-2.5 rounded-xl bg-[#091124] hover:bg-[#0E1A38] border border-[#00F0FF]/25 text-[#00F0FF] text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Vérification...' : 'Actualiser le statut'}</span>
            </button>
          )}
        </div>

        {/* Help hint */}
        <p className="text-[11px] text-[#64748B] mt-6">
          Un administrateur valide les comptes dans la rubrique <span className="text-[#00F0FF]">Demandes d'inscription</span>.
        </p>
      </div>
    </div>
  );
};
