import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, User as UserIcon, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { api } from '../api/client';
import { Conversation, Message } from '../types';

export const AdminMessagesView: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState('');

  const fetchConversations = async () => {
    if (!api.getAdminToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getAdminConversations();
      const convList = data.conversations || [];
      setConversations(convList);
      if (convList.length > 0 && !selectedConv) {
        setSelectedConv(convList[0]);
        loadConvMessages(convList[0].id);
      }
    } catch (e: any) {
      if (e?.status !== 401) {
        console.error('Failed to load admin conversations:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadConvMessages = async (convId: string) => {
    if (!convId || !api.getAdminToken()) return;
    setLoadingMessages(true);
    try {
      const data = await api.getAdminConversationMessages(convId);
      setMessages(data.messages || []);
    } catch (e: any) {
      if (e?.status !== 401 && e?.status !== 404) {
        console.error('Failed to fetch messages:', e);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelect = (conv: Conversation) => {
    setSelectedConv(conv);
    loadConvMessages(conv.id);
  };

  const filtered = conversations.filter(
    (c) =>
      (c.otherUser?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.lastMessage?.content || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      currentTab="messages"
      title="Messages"
      subtitle="Supervision et modération des échanges étudiants"
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)] min-h-[500px]">
        {/* Left: Conversation list */}
        <div className="w-full lg:w-80 bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-4 flex flex-col backdrop-blur-md shadow-[0_0_25px_rgba(0,114,255,0.1)] shrink-0">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-[#00F0FF]/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrer les discussions..."
              className="w-full bg-[#050B17] border border-[#00F0FF]/25 focus:border-[#00F0FF] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#475569] outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {loading ? (
              <p className="text-xs text-[#64748B] text-center py-6">Chargement...</p>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-6">Aucune conversation trouvée.</p>
            ) : (
              filtered.map((c) => {
                const isSelected = selectedConv?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#0B1733] border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'hover:bg-[#091224] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={c.otherUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#00F0FF]/30 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{c.otherUser.name}</h4>
                          <span className="text-[10px] text-[#64748B]">{c.lastMessage?.createdAt || ''}</span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                          {c.lastMessage?.content || 'Aucun message'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Messages Inspector matching Storyboard Screen 10 */}
        <div className="flex-1 bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-5 flex flex-col backdrop-blur-md shadow-[0_0_25px_rgba(0,114,255,0.1)] min-w-0">
          {selectedConv ? (
            <>
              {/* Header */}
              <div className="pb-4 mb-4 border-b border-[#00F0FF]/15 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConv.otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={selectedConv.otherUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#00F0FF]/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Discussion avec {selectedConv.otherUser.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF]">
                        Conversation ID: {selectedConv.id}
                      </span>
                    </h3>
                    <p className="text-xs text-[#94A3B8] font-mono">{selectedConv.otherUser.email}</p>
                  </div>
                </div>

                <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
                  <span>Mode modération actif</span>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {loadingMessages ? (
                  <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-xs text-[#64748B] text-center py-12">Aucun message dans ce canal.</p>
                ) : (
                  messages.map((m) => {
                    const isOther = m.senderId === selectedConv.otherUser.id;
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl text-xs max-w-lg ${
                          isOther
                            ? 'bg-[#091224] border border-[#00F0FF]/25 mr-auto'
                            : 'bg-[#0F1B38] border border-[#00B2FE]/30 ml-auto'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#00F0FF] mb-1 font-semibold">
                          <span>{isOther ? selectedConv.otherUser.name : 'Étudiant (Vous/Autre)'}</span>
                          <span className="text-[#64748B] font-mono font-normal">{m.createdAt}</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">{m.content}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <MessageSquare className="w-10 h-10 text-[#64748B] mb-3" />
              <p className="text-sm font-bold text-white">Sélectionnez une discussion</p>
              <p className="text-xs text-[#64748B] mt-1">
                Cliquez sur une discussion à gauche pour inspecter tous les messages échangés.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
