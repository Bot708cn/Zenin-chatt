import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { RegisterScreen } from './pages/RegisterScreen';
import { PendingScreen } from './pages/PendingScreen';
import { MainChatView } from './pages/MainChatView';
import { FriendsView } from './pages/FriendsView';
import { UserSettingsView } from './pages/UserSettingsView';
import { AdminLoginScreen } from './pages/AdminLoginScreen';
import { AdminDashboardView } from './pages/AdminDashboardView';
import { AdminUsersView } from './pages/AdminUsersView';
import { AdminRequestsView } from './pages/AdminRequestsView';
import { AdminMessagesView } from './pages/AdminMessagesView';
import { AdminBansView } from './pages/AdminBansView';
import { AdminSettingsView } from './pages/AdminSettingsView';
import { LoggedOutScreen } from './pages/LoggedOutScreen';

const AppContent: React.FC = () => {
  const { currentScreen } = useAuth();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'pending':
        return <PendingScreen />;
      case 'app-chat':
        return <MainChatView />;
      case 'app-friends':
        return <FriendsView />;
      case 'app-settings':
        return <UserSettingsView />;
      case 'admin-login':
        return <AdminLoginScreen />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'admin-requests':
        return <AdminRequestsView />;
      case 'admin-messages':
        return <AdminMessagesView />;
      case 'admin-bans':
        return <AdminBansView />;
      case 'admin-settings':
        return <AdminSettingsView />;
      case 'logged-out':
        return <LoggedOutScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-white selection:bg-[#00F0FF]/30 selection:text-white">
      {renderScreen()}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
