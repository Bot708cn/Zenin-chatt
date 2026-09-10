import React, { useState, useEffect } from 'react';
import { Ban, Search, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { api } from '../api/client';
import { User } from '../types';

export const AdminBansView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal for ban reason
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState('');

  const fetchUsers = async () => {
    if (!api.getAdminToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getAdminUsers('all', search);
      setUsers(data.users || []);
    } catch (e: any) {
      if (e?.status !== 401) {
        console.error('Failed to load users for bans:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.banUser(selectedUser.id, reason || 'Infraction aux règles de l’application');
      setSelectedUser(null);
      setReason('');
      fetchUsers();
    } catch (e) {
      alert('Erreur lors du bannissement.');
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await api.unbanUser(userId);
      fetchUsers();
    } catch (e) {
      alert('Erreur lors du déblocage.');
    }
  };

  return (
    <AdminLayout
      currentTab="bans"
      title="Ban / Déban"
      subtitle="Gestion stricte des exclusions et de l'accès aux discussions"
    >
      <div className="max-w-4xl flex flex-col gap-6">
        {/* Info card */}
        <div className="p-4 rounded-2xl bg-[#070E20] border border-[#00F0FF]/20 text-xs text-[#94A3B8] flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Un utilisateur banni ne peut plus se connecter, ne reçoit plus de notifications et disparaît immédiatement de la liste des camarades d'étude pour les autres membres.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#00F0FF]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#475569] outline-none transition-all focus:ring-1 focus:ring-[#00F0FF]/30"
          />
        </div>

        {/* Table / List matching Storyboard Screen 11 */}
        <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(0,114,255,0.1)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A18] text-[#94A3B8] uppercase tracking-wider font-semibold border-b border-[#00F0FF]/15">
              <tr>
                <th className="py-4 px-6">Utilisateur</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Statut actuel</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00F0FF]/10 text-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#64748B]">
                    Chargement...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#64748B]">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#091326]/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#00F0FF]/30"
                        />
                        <span className="font-bold text-white text-sm">{user.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-[#94A3B8] font-mono text-[11px]">
                      {user.email}
                    </td>

                    <td className="py-3.5 px-6">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-[10px] text-red-400 font-semibold">
                          <Ban className="w-3 h-3" />
                          Banni ({user.banReason || 'Infraction'})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Actif
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      {user.banned ? (
                        <button
                          onClick={() => handleUnban(user.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-white text-xs font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)] hover:scale-105 transition-all cursor-pointer"
                        >
                          Débloquer
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#1D111E] hover:bg-red-950/60 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Bannir
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#070E20] border border-red-500/40 rounded-3xl p-6 shadow-[0_0_35px_rgba(239,68,68,0.25)]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              Bannir {selectedUser.name}
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Veuillez préciser la raison du bannissement pour notification :
            </p>

            <form onSubmit={handleBan} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex : Comportement inapproprié dans le groupe"
                className="w-full bg-[#050B17] border border-red-500/30 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />

              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-xs text-gray-300 hover:text-white rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                >
                  Confirmer le bannissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
