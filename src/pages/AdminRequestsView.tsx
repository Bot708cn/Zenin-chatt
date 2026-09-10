import React, { useState, useEffect } from 'react';
import { UserCheck, Check, X, Clock, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { api } from '../api/client';
import { RegistrationRequest } from '../types';

export const AdminRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchRequests = async () => {
    if (!api.getAdminToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getAdminRequests();
      setRequests(data.requests || []);
    } catch (e: any) {
      if (e?.status !== 401) {
        console.error('Failed to fetch requests:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    setActionInProgress(id);
    try {
      await api.approveRequest(id);
      fetchRequests();
    } catch (e) {
      alert('Erreur lors de la validation.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Voulez-vous vraiment refuser cette inscription ?')) return;
    setActionInProgress(id);
    try {
      await api.rejectRequest(id);
      fetchRequests();
    } catch (e) {
      alert('Erreur lors du refus.');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <AdminLayout
      currentTab="requests"
      title="Demandes d'inscription"
      subtitle="Validation manuelle des nouveaux étudiants"
    >
      <div className="max-w-4xl">
        <div className="mb-6">
          <p className="text-xs text-[#94A3B8]">
            Zenin Chatt fonctionne sur invitation et validation stricte. Tout nouvel étudiant doit être validé ici avant de pouvoir accéder aux discussions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-12 text-center shadow-[0_0_30px_rgba(0,114,255,0.1)]">
            <div className="w-14 h-14 rounded-2xl bg-[#0B152B] border border-[#00F0FF]/30 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-7 h-7 text-[#00F0FF]" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Aucune demande en attente</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Toutes les inscriptions ont été traitées. Les nouvelles demandes des étudiants apparaîtront ici automatiquement en temps réel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-[#070E20]/90 border border-[#00F0FF]/25 hover:border-[#00F0FF]/50 rounded-3xl p-5 backdrop-blur-md shadow-[0_0_25px_rgba(0,114,255,0.12)] flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={req.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={req.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{req.name}</h3>
                      <p className="text-xs text-[#38BDF8] font-mono truncate">{req.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mb-5 bg-[#050A17] py-1 px-2.5 rounded-lg w-fit border border-[#00F0FF]/10">
                    <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Inscrit {req.createdAt}</span>
                  </div>
                </div>

                {/* Actions matching Storyboard Screen 9: [ Valider ] and [ Refuser ] */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#00F0FF]/15">
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={actionInProgress === req.id}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider</span>
                  </button>

                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={actionInProgress === req.id}
                    className="px-4 py-2.5 rounded-xl bg-[#1D111E] hover:bg-red-950/60 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Refuser</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
