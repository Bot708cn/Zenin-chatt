import React, { useState, useEffect } from 'react';
import { Users, Search, MessageSquare, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { User } from '../types';

export const FriendsView: React.FC = () => {
  const { navigateTo, openConversation } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingConvWith, setStartingConvWith] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!api.getUserToken()) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getUsers();
        setUsers(res.users || []);
      } catch (e: any) {
        if (e?.status !== 401) {
          console.error('Failed to fetch friends:', e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleStartChat = async (targetUserId: string) => {
    setStartingConvWith(targetUserId);
    try {
      const res = await api.startConversation(targetUserId);
      if (res.conversationId) {
        openConversation(res.conversationId);
      }
    } catch (e) {
      alert('Impossible d’ouvrir cette discussion.');
    } finally {
      setStartingConvWith(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('app-chat')}
            className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052D4] text-xs font-semibold text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
          >
            Retour au Chat
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide flex items-center gap-2.5">
              <Users className="w-6 h-6 text-[#00F0FF]" />
              Amis & Camarades d'étude
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Liste des étudiants autorisés et validés par l'administration Zenin Chatt.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#00F0FF]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un étudiant..."
              className="w-full bg-[#070E1F] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#475569] outline-none transition-all focus:ring-1 focus:ring-[#00F0FF]/30"
            />
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-[#070E1F] border border-[#00F0FF]/15 rounded-2xl p-6">
            <Users className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Aucun étudiant trouvé</p>
            <p className="text-xs text-[#64748B] mt-1">
              Tous les étudiants autorisés apparaîtront ici dès validation de leur inscription.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-[#070E20]/90 border border-[#00F0FF]/20 hover:border-[#00F0FF]/50 rounded-2xl p-4 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,114,255,0.15)] flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#00F0FF]/30"
                    />
                    {user.isOnline ? (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00F0FF] border-2 border-[#070E20] shadow-[0_0_6px_#00F0FF]" />
                    ) : (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#475569] border-2 border-[#070E20]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
                    <p className="text-[11px] text-[#94A3B8] truncate">{user.email}</p>
                    <span className="text-[10px] text-[#00F0FF] font-medium flex items-center gap-1 mt-0.5">
                      {user.isOnline ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                          En ligne
                        </>
                      ) : (
                        <span className="text-[#64748B]">Hors ligne • {user.lastSeen || 'Récemment'}</span>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartChat(user.id)}
                  disabled={startingConvWith === user.id}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer disabled:opacity-50 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{startingConvWith === user.id ? 'Ouverture...' : 'Démarrer une discussion'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
