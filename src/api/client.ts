import { User, RegistrationRequest, Conversation, Message, ActivityLog, AdminDashboardStats } from '../types';

class ApiClient {
  private userToken: string | null = null;
  private adminToken: string | null = null;

  constructor() {
    this.userToken = localStorage.getItem('zenin_user_token');
    this.adminToken = localStorage.getItem('zenin_admin_token');
  }

  setUserToken(token: string | null) {
    this.userToken = token;
    if (token) {
      localStorage.setItem('zenin_user_token', token);
    } else {
      localStorage.removeItem('zenin_user_token');
    }
  }

  setAdminToken(token: string | null) {
    this.adminToken = token;
    if (token) {
      localStorage.setItem('zenin_admin_token', token);
    } else {
      localStorage.removeItem('zenin_admin_token');
    }
  }

  getUserToken() {
    return this.userToken;
  }

  getAdminToken() {
    return this.adminToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, isAdmin = false): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = isAdmin ? this.adminToken : this.userToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || 'Une erreur est survenue.');
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data as T;
  }

  // Auth User
  async register(params: { name: string; email: string; password: string; confirmPassword: string }) {
    return this.request<{ success: boolean; message: string; status: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async login(params: { email: string; password: string }) {
    const data = await this.request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    if (data.token) {
      this.setUserToken(data.token);
    }
    return data;
  }

  async getMe(isAdmin = false) {
    return this.request<{ role: 'USER' | 'ADMIN'; user: User; isAdmin?: boolean }>('/auth/me', {}, isAdmin);
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      this.setUserToken(null);
    }
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getFacebookInfo() {
    return this.request<{ configured: boolean; appId: string | null; notice: string }>('/auth/facebook/info');
  }

  // Chat & Users
  async getUsers() {
    return this.request<{ users: User[] }>('/users');
  }

  async getConversations() {
    return this.request<{ conversations: Conversation[] }>('/conversations');
  }

  async getMessages(conversationId: string) {
    return this.request<{ conversationId: string; otherUser: any; messages: Message[] }>(
      `/conversations/${conversationId}/messages`
    );
  }

  async sendMessage(conversationId: string, payload: { content?: string; attachmentUrl?: string; attachmentName?: string; attachmentType?: 'image' | 'file' }) {
    return this.request<{ message: Message }>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async startConversation(targetUserId: string) {
    return this.request<{ conversationId: string }>('/conversations/start', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
  }

  async updateProfile(updates: { name?: string; avatar?: string }) {
    return this.request<{ success: boolean; user: User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Admin
  async adminLogin(secretCode: string) {
    const data = await this.request<{ success: boolean; token: string; message: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ secretCode }),
    });
    if (data.token) {
      this.setAdminToken(data.token);
    }
    return data;
  }

  async adminLogout() {
    this.setAdminToken(null);
  }

  async getAdminDashboard() {
    return this.request<{ stats: AdminDashboardStats; recentActivity: ActivityLog[] }>('/admin/dashboard', {}, true);
  }

  async getAdminUsers(filter: 'all' | 'online' | 'banned' = 'all', query = '') {
    const q = new URLSearchParams({ filter, q: query }).toString();
    return this.request<{ users: User[]; counts: { all: number; online: number; banned: number } }>(
      `/admin/users?${q}`,
      {},
      true
    );
  }

  async getAdminRequests() {
    return this.request<{ requests: RegistrationRequest[] }>('/admin/requests', {}, true);
  }

  async approveRequest(requestId: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/requests/${requestId}/approve`, {
      method: 'POST',
    }, true);
  }

  async rejectRequest(requestId: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/requests/${requestId}/reject`, {
      method: 'POST',
    }, true);
  }

  async banUser(userId: string, reason?: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }, true);
  }

  async unbanUser(userId: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/users/${userId}/unban`, {
      method: 'POST',
    }, true);
  }

  async getAdminMessages() {
    return this.request<{
      conversations: Array<{
        id: string;
        createdAt: string;
        updatedAt: string;
        members: Array<{ id: string; name: string; avatar: string; email: string }>;
        messages: Message[];
        lastMessage: Message | null;
      }>;
    }>('/admin/messages', {}, true);
  }

  async getAdminConversations() {
    return this.request<{ conversations: Conversation[] }>('/admin/conversations', {}, true);
  }

  async getAdminConversationMessages(convId: string) {
    return this.request<{ conversationId: string; otherUser: any; messages: Message[] }>(
      `/admin/conversations/${convId}/messages`,
      {},
      true
    );
  }

  async updateAdminSecret(newSecret: string) {
    return this.request<{ success: boolean; message: string }>('/admin/settings/secret', {
      method: 'POST',
      body: JSON.stringify({ newSecret }),
    }, true);
  }

  async getAdminSettingsInfo() {
    return this.request<{
      appName: string;
      version: string;
      platform: string;
      database: string;
      uptime: number;
      userCount: number;
      messageCount: number;
    }>('/admin/settings/info', {}, true);
  }
}

export const api = new ApiClient();
