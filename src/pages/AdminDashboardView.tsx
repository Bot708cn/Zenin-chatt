import React, { useState, useEffect } from 'react';
import { Users, Clock, Ban, MessageSquare, ArrowUpRight, CheckCircle2, UserPlus, ShieldAlert } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { api } from '../api/client';
import { AdminDashboardStats, ActivityLog } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardView: React.FC = () => {
  const { navigateTo } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 12,
    onlineUsers: 6,
    pendingRequests: 3,
    bannedUsers: 1,
    messagesToday: 48,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!api.getAdminToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getAdminDashboard();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (e: any) {
      if (e?.status !== 401) {
        console.error('Failed to load admin dashboard:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 4000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      id: 'total',
      label: 'Total utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      screen: 'admin-users' as const,
      color: 'text-[#00F0FF]',
      borderColor: 'border-[#00F0FF]/30',
    },
    {
      id: 'pending',
      label: 'En attente',
      value: stats.pendingRequests,
      icon: Clock,
      screen: 'admin-requests' as const,
      color: 'text-[#38BDF8]',
      borderColor: 'border-[#38BDF8]/30',
    },
    {
      id: 'banned',
      label: 'Bannis',
      value: stats.bannedUsers,
      icon: Ban,
      screen: 'admin-bans' as const,
      color: 'text-red-400',
      borderColor: 'border-red-500/30',
    },
    {
      id: 'messages',
      label: 'Messages aujourd\'hui',
      value: stats.messagesToday,
      icon: MessageSquare,
      screen: 'admin-messages' as const,
      color: 'text-[#00B2FE]',
      borderColor: 'border-[#00B2FE]/30',
    },
  ];

  return (
    <AdminLayout
      currentTab="dashboard"
      title="Tableau de bord"
      subtitle="Bienvenue, Admin"
    >
      {/* 4 Stat Cards matching Storyboard Screen 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => navigateTo(card.screen)}
              className={`bg-[#070E20]/90 border ${card.borderColor} rounded-3xl p-5 backdrop-blur-md shadow-[0_0_25px_rgba(0,114,255,0.12)] hover:border-[#00F0FF]/60 transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#94A3B8] tracking-wide">
                  {card.label}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#0B152B] border border-[#00F0FF]/25 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {loading ? '...' : card.value}
                </span>
                <span className="text-[11px] text-[#00F0FF] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Voir <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activité récente matching Storyboard Screen 7 */}
      <div className="bg-[#070E20]/90 border border-[#00F0FF]/25 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,114,255,0.1)]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#00F0FF]/15">
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            Activité récente
          </h2>
          <span className="text-xs text-[#64748B]">Mise à jour en temps réel</span>
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-xs text-[#64748B] text-center py-6">Aucune activité récente.</p>
          ) : (
            recentActivity.map((log) => {
              const isRegister = log.type === 'REGISTER';
              const isApprove = log.type === 'APPROVE';
              const isBan = log.type === 'BAN';

              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050A17] border border-[#00F0FF]/15 hover:border-[#00F0FF]/30 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#091328] border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                      {isRegister && <UserPlus className="w-4 h-4 text-[#00F0FF]" />}
                      {isApprove && <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />}
                      {isBan && <ShieldAlert className="w-4 h-4 text-red-400" />}
                      {!isRegister && !isApprove && !isBan && (
                        <Clock className="w-4 h-4 text-[#00F0FF]" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {log.title} : <span className="text-[#00F0FF]">{log.targetName || log.description}</span>
                      </h4>
                      <p className="text-[11px] text-[#94A3B8]">{log.description}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-[#64748B] font-medium shrink-0 ml-4">
                    {log.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
