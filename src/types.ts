export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'BANNED';
  approved: boolean;
  banned: boolean;
  banReason?: string | null;
  lastSeen: string;
  isOnline: boolean;
  createdAt?: string;
}

export interface RegistrationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'file';
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  updatedAt: string;
  unreadCount: number;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen: string;
    banned?: boolean;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    read: boolean;
  } | null;
}

export interface ActivityLog {
  id: string;
  type: 'REGISTER' | 'APPROVE' | 'REJECT' | 'BAN' | 'UNBAN' | 'MESSAGE' | 'ADMIN_LOGIN';
  title: string;
  description: string;
  timestamp: string;
  targetName?: string;
  userId?: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  onlineUsers: number;
  pendingRequests: number;
  bannedUsers: number;
  messagesToday: number;
}

export type ActiveScreen =
  | 'splash'
  | 'login'
  | 'register'
  | 'pending'
  | 'app-chat'
  | 'app-friends'
  | 'app-settings'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-requests'
  | 'admin-messages'
  | 'admin-bans'
  | 'admin-settings'
  | 'logged-out';
