import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageSquare,
  Ban,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { ActiveScreen } from '../types';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'users' | 'requests' | 'messages' | 'bans' | 'settings';
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  children,
  title,
  subtitle,
}) => {
  const { navigateTo, adminLogout } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.getAdminRequests();
        setPendingCount(res.requests.length);
      } catch (e) {
        // ignore
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      screen: 'admin-dashboard' as ActiveScreen,
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      screen: 'admin-users' as ActiveScreen,
    },
    {
      id: 'requests',
      label: 'Demandes d\'inscription',
      icon: UserCheck,
      badge: pendingCount,
      screen: 'admin-requests' as ActiveScreen,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      screen: 'admin-messages' as ActiveScreen,
    },
    {
      id: 'bans',
      label: 'Ban / Déban',
      icon: Ban,
      screen: 'admin-bans' as ActiveScreen,
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      screen: 'admin-settings' as ActiveScreen,
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-white flex overflow-x-hidden font-sans">
      {/* -------------------------------------------------------------
          SIDEBAR (MATCHING SCREENS 7, 8, 9, 10, 11, 12)
          ------------------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#050A18] border-r border-[#00F0FF]/15 p-5 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Close on mobile */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Logo size="sm" withText={true} glow={true} className="!items-start" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin badge */}
          <div className="mx-2 mb-6 px-3 py-1.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center gap-2 text-xs text-[#00F0FF]">
            <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
            <span className="font-semibold tracking-wider uppercase text-[10px]">Administration</span>
          </div>

          {/* Nav list */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.screen);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00B2FE] text-white shadow-[0_0_18px_rgba(0,240,255,0.35)]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#091326] border border-transparent hover:border-[#00F0FF]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00F0FF]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-white text-[#0066FF]'
                          : 'bg-red-500/90 text-white shadow-[0_0_8px_#ef4444]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout */}
        <div className="pt-4 border-t border-[#00F0FF]/15">
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-[#64748B] hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* -------------------------------------------------------------
          MAIN CONTENT VIEW AREA
          ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 bg-[#050A18]/80 border-b border-[#00F0FF]/15 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#00F0FF] hover:bg-[#00F0FF]/10 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">{title}</h1>
              {subtitle && <p className="text-[11px] text-[#94A3B8]">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('app-chat')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#091326] border border-[#00F0FF]/30 hover:border-[#00F0FF] text-xs text-[#00F0FF] transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Voir le Chat Étudiant</span>
            </button>
          </div>
        </header>

        {/* Children content with responsive padding */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
