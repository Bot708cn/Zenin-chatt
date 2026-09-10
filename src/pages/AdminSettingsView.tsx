import React, { useState } from 'react';
import { Settings, Lock, Check, Shield, Info, LogOut } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AdminSettingsView: React.FC = () => {
  const { adminLogout } = useAuth();
  const [newCode, setNewCode] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    if (newCode.length < 6) {
      setErrorMsg('Le code secret doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await api.updateAdminSecret(newCode.trim());
      setSaved(true);
      setNewCode('');
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setErrorMsg(e.message || 'Erreur lors de la modification du code secret.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      currentTab="settings"
      title="Paramètres"
      subtitle="Configuration de sécurité de l'espace administrateur"
    >
      <div className="max-w-2xl flex flex-col gap-6">
        {/* Modifier le code secret (Storyboard Screen 12) */}
        <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_25px_rgba(0,114,255,0.12)]">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00F0FF]" />
            Changer le code secret administrateur
          </h3>
          <p className="text-xs text-[#94A3B8] mb-5">
            Ce code est requis pour accéder à l'ensemble du panneau d'administration de Zenin Chatt.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleUpdateCode} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                Nouveau code secret
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#00F0FF]/70 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Entrez le nouveau code secret..."
                  className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#475569] outline-none focus:ring-1 focus:ring-[#00F0FF]/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved ? (
                <span className="text-xs text-[#00F0FF] flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Code secret modifié avec succès !
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? 'Modification...' : 'Modifier'}
              </button>
            </div>
          </form>
        </div>

        {/* Informations platform */}
        <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_25px_rgba(0,114,255,0.12)]">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00F0FF]" />
            Informations sur l'application
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050A17] border border-[#00F0FF]/10">
              <span className="text-[#94A3B8]">Nom de l'application</span>
              <span className="font-bold text-white">Zenin Chatt</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050A17] border border-[#00F0FF]/10">
              <span className="text-[#94A3B8]">Version</span>
              <span className="font-mono text-[#00F0FF] font-semibold">1.0.0 (Production)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050A17] border border-[#00F0FF]/10">
              <span className="text-[#94A3B8]">Architecture</span>
              <span className="text-white">Full-Stack TypeScript & Express</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050A17] border border-[#00F0FF]/10">
              <span className="text-[#94A3B8]">Espaces</span>
              <span className="text-[#38BDF8]">Espace Étudiant + Espace Administrateur</span>
            </div>
          </div>
        </div>

        {/* Déconnexion Admin */}
        <div className="pt-2">
          <button
            onClick={adminLogout}
            className="w-full py-3.5 rounded-2xl bg-[#1D111E] hover:bg-red-950/60 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion de l'espace administrateur</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};
