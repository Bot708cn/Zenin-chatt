import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Ban, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { api } from '../api/client';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminUsersView: React.FC = () => {
  const { navigateTo } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [counts, setCounts] = useState({ all: 0, online: 0, banned: 0 });
  const [filter, setFilter] = useState<'all' | 'online' | 'banned'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Ban confirmation modal
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');

  const fetchUsers = async () => {
    if (!api.getAdminToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getAdminUsers(filter, query);
      setUsers(data.users || []);
      setCounts(data.counts || { all: 0, online: 0, banned: 0 });
    } catch (e: any) {
      if (e?.status !== 401) {
        console.error('Failed to fetch admin users:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, query]);

  const handleBanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToBan) return;
    try {
      await api.banUser(userToBan.id, banReason || 'Infraction aux conditions d’utilisation');
      setUserToBan(null);
      setBanReason('');
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
      alert('Erreur lors du débannissement.');
    }
  };

  return (
    <AdminLayout
      currentTab="users"
      title="Utilisateurs"
      subtitle="Gestion des étudiants inscrits et permissions"
    >
      <div className="flex flex-col gap-5">
        {/* Top Controls: Search & Tabs matching Storyboard Screen 8 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-[#050A18] border border-[#00F0FF]/20 rounded-2xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Tous ({counts.all})
            </button>
            <button
              onClick={() => setFilter('online')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'online'
                  ? 'bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              En ligne ({counts.online})
            </button>
            <button
              onClick={() => setFilter('banned')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'banned'
                  ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Bannis ({counts.banned})
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#00F0FF]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#475569] outline-none transition-all focus:ring-1 focus:ring-[#00F0FF]/30"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(0,114,255,0.1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050A18] text-[#94A3B8] uppercase tracking-wider font-semibold border-b border-[#00F0FF]/15">
                <tr>
                  <th className="py-4 px-6">Nom</th>
                  <th className="py-4 px-6">Email / Facebook</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00F0FF]/10 text-white">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#64748B]">
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#64748B]">
                      Aucun utilisateur trouvé pour ces critères.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#091326]/60 transition-colors">
                      {/* Nom & Avatar */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#00F0FF]/30"
                          />
                          <div>
                            <span className="font-bold text-white text-sm block">{user.name}</span>
                            <span className="text-[10px] text-[#64748B]">ID: {user.id.slice(0, 10)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-6 text-[#94A3B8] font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Statut matching Storyboard: • En ligne / • Hors ligne / Banni */}
                      <td className="py-3.5 px-6">
                        {user.banned ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-[10px] text-red-400 font-semibold">
                            <Ban className="w-3 h-3" />
                            Banni
                          </span>
                        ) : user.isOnline ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_6px_#00F0FF]" />
                            En ligne
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0E172A] border border-white/10 text-[10px] text-[#64748B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#475569]" />
                            Hors ligne
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigateTo('admin-messages')}
                            className="p-2 rounded-xl bg-[#0B162C] hover:bg-[#0066FF]/30 border border-[#00F0FF]/20 text-[#00F0FF] transition-all cursor-pointer"
                            title="Voir ses conversations"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {user.banned ? (
                            <button
                              onClick={() => handleUnban(user.id)}
                              className="px-3 py-1.5 rounded-xl bg-[#00F0FF]/20 hover:bg-[#00F0FF]/40 border border-[#00F0FF]/40 text-[#00F0FF] text-[11px] font-semibold transition-all cursor-pointer"
                              title="Débannir l'utilisateur"
                            >
                              Débannir
                            </button>
                          ) : (
                            <button
                              onClick={() => setUserToBan(user)}
                              className="p-2 rounded-xl bg-[#1D111E] hover:bg-red-950/60 border border-red-500/30 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                              title="Bannir l'utilisateur"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {userToBan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#070E20] border border-red-500/40 rounded-3xl p-6 shadow-[0_0_35px_rgba(239,68,68,0.2)]">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              Bannir l'étudiant {userToBan.name}
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              L'utilisateur ne pourra plus se connecter, ses sessions actives seront invalidées et il ne pourra plus envoyer de messages.
            </p>

            <form onSubmit={handleBanSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                  Raison du bannissement
                </label>
                <input
                  type="text"
                  required
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Ex: Non-respect des règles de discussion"
                  className="w-full bg-[#050B17] border border-red-500/30 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setUserToBan(null)}
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
