import React, { useState } from 'react';
import { Settings, ArrowLeft, User as UserIcon, Shield, LogOut, Check, Bell } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const UserSettingsView: React.FC = () => {
  const { currentUser, logout, navigateTo, refreshUserData } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.updateProfile({ name: name.trim() });
      await refreshUserData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 px-4 md:px-8 bg-[#050A17] border-b border-[#00F0FF]/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('app-chat')}
            className="p-2 rounded-xl text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="xs" withText={true} glow={false} />
        </div>

        <button
          onClick={() => navigateTo('app-chat')}
          className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052D4] text-xs font-semibold text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
        >
          Retour au Chat
        </button>
      </header>

      {/* Settings Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#00F0FF]" />
            Paramètres du compte
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Gérez vos informations personnelles et vos préférences d'étude.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-6 mb-6 shadow-[0_0_30px_rgba(0,114,255,0.12)]">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#00F0FF]/15">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.35)]"
            />
            <div>
              <h2 className="text-base font-bold text-white">{currentUser?.name}</h2>
              <p className="text-xs text-[#94A3B8] font-mono">{currentUser?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF] font-semibold">
                <Shield className="w-3 h-3" />
                Étudiant Vérifié
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                Nom complet affiché
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-[#00F0FF]/70 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none transition-all focus:ring-1 focus:ring-[#00F0FF]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                Adresse Email (Lecture seule)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full bg-[#030712] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-[#64748B] outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved ? (
                <span className="text-xs text-[#00F0FF] flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Profil mis à jour !
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-white text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Logout */}
        <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00F0FF]" />
            Sécurité & Confidentialité
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Zenin Chatt est une plateforme d'études réservée exclusivement aux étudiants autorisés.
            Vos messages et documents partagés sont réservés à votre groupe de travail.
          </p>

          <div className="pt-2">
            <button
              onClick={logout}
              className="w-full py-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter de Zenin Chatt</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
