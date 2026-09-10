import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'BANNED';
  approved: boolean;
  banned: boolean;
  banReason?: string | null;
  createdAt: string;
  lastSeen: string;
  isOnline: boolean;
  facebookId?: string;
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
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'file';
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  memberIds: string[];
}

export interface ActivityLog {
  id: string;
  type: 'REGISTER' | 'APPROVE' | 'REJECT' | 'BAN' | 'UNBAN' | 'MESSAGE' | 'ADMIN_LOGIN';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  targetName?: string;
}

export interface AppSettings {
  adminSecret: string;
  appName: string;
  version: string;
  allowRegistrations: boolean;
  maintenanceMode: boolean;
}

interface DatabaseSchema {
  users: User[];
  registrationRequests: RegistrationRequest[];
  conversations: Conversation[];
  messages: Message[];
  activityLogs: ActivityLog[];
  settings: AppSettings;
  sessions: { [token: string]: { userId: string; role: 'USER' | 'ADMIN'; expiresAt: number } };
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const DB_DIR = isServerless ? path.resolve('/tmp', 'zenin-data') : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'zenin-salt-2026').digest('hex');
}

function getDefaultSeeds(): DatabaseSchema {
  const pwd = hashPassword('123456');

  const users: User[] = [
    {
      id: 'usr-mickael',
      name: 'Mickael',
      email: 'mickael@gmail.com',
      passwordHash: pwd,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'ACTIVE',
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      lastSeen: '10:24',
      isOnline: true,
    },
    {
      id: 'usr-lova',
      name: 'Lova',
      email: 'lova@outlook.com',
      passwordHash: pwd,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'ACTIVE',
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      lastSeen: '09:48',
      isOnline: true,
    },
    {
      id: 'usr-tiana',
      name: 'Tiana',
      email: 'tiana@gmail.com',
      passwordHash: pwd,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'ACTIVE',
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      lastSeen: 'Hier',
      isOnline: true,
    },
    {
      id: 'usr-rado',
      name: 'Rado',
      email: 'radosfb@yahoo.com',
      passwordHash: pwd,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'ACTIVE',
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      lastSeen: 'Hier',
      isOnline: true,
    },
    {
      id: 'usr-fanja',
      name: 'Fanja',
      email: 'fanja@gmail.com',
      passwordHash: pwd,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'ACTIVE',
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      lastSeen: 'Lun',
      isOnline: false,
    },
    {
      id: 'usr-tojo',
      name: 'Tojo',
      email: 'tojo@outlook.com',
      passwordHash: pwd,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'ACTIVE',
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      lastSeen: 'Lun',
      isOnline: true,
    },
    {
      id: 'usr-banned-demo',
      name: 'Bastien',
      email: 'bastien@gmail.com',
      passwordHash: pwd,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'BANNED',
      approved: true,
      banned: true,
      banReason: 'Comportement non conforme au règlement des révisions',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      lastSeen: 'Il y a 1 j',
      isOnline: false,
    },
    {
      id: 'usr-current',
      name: 'Zenin Student',
      email: 'etudiant@zenin.chatt',
      passwordHash: hashPassword('zenin2026'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'USER',
      status: 'ACTIVE',
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      lastSeen: 'À l’instant',
      isOnline: true,
    }
  ];

  const registrationRequests: RegistrationRequest[] = [
    {
      id: 'req-rina',
      userId: 'usr-pending-rina',
      userName: 'Rina',
      userEmail: 'rina@gmail.com',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      status: 'PENDING',
    },
    {
      id: 'req-josue',
      userId: 'usr-pending-josue',
      userName: 'Josue',
      userEmail: 'josue@outlook.com',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
      status: 'PENDING',
    },
    {
      id: 'req-mialy',
      userId: 'usr-pending-mialy',
      userName: 'Mialy',
      userEmail: 'mialy@gmail.com',
      userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      status: 'PENDING',
    }
  ];

  // Seed conversation between usr-current and usr-mickael
  const conv1Id = 'conv-mickael';
  const conversations: Conversation[] = [
    {
      id: conv1Id,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      memberIds: ['usr-current', 'usr-mickael'],
    },
    {
      id: 'conv-lova',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      memberIds: ['usr-current', 'usr-lova'],
    },
    {
      id: 'conv-tiana',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      memberIds: ['usr-current', 'usr-tiana'],
    }
  ];

  const messages: Message[] = [
    {
      id: 'msg-1',
      conversationId: conv1Id,
      senderId: 'usr-mickael',
      content: 'Salut ! Tu as fini ton exercice ?',
      createdAt: '10:22',
      read: true,
    },
    {
      id: 'msg-2',
      conversationId: conv1Id,
      senderId: 'usr-current',
      content: 'Oui, j\'ai terminé. On peut réviser ensemble ce soir ?',
      createdAt: '10:24',
      read: true,
    },
    {
      id: 'msg-3',
      conversationId: conv1Id,
      senderId: 'usr-mickael',
      content: 'Parfait ! À tout à l\'heure 😊',
      createdAt: '10:25',
      read: true,
    },
    {
      id: 'msg-4',
      conversationId: 'conv-lova',
      senderId: 'usr-lova',
      content: 'Merci beaucoup pour les notes de cours d\'hier !',
      createdAt: '09:48',
      read: true,
    },
    {
      id: 'msg-5',
      conversationId: 'conv-tiana',
      senderId: 'usr-tiana',
      content: 'On révise ensemble le module d\'algorithmes ce week-end ?',
      createdAt: 'Hier',
      read: true,
    }
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: 'act-1',
      type: 'REGISTER',
      title: 'Nouveau compte en attente',
      description: 'Rina (rina@gmail.com)',
      timestamp: 'Il y a 5 min',
      targetName: 'Rina',
    },
    {
      id: 'act-2',
      type: 'REGISTER',
      title: 'Nouveau compte en attente',
      description: 'Josue (josue@outlook.com)',
      timestamp: 'Il y a 12 min',
      targetName: 'Josue',
    },
    {
      id: 'act-3',
      type: 'APPROVE',
      title: 'Utilisateur approuvé',
      description: 'Compte activé pour Tiana',
      timestamp: 'Il y a 20 min',
      targetName: 'Tiana',
    },
    {
      id: 'act-4',
      type: 'BAN',
      title: 'Utilisateur banni',
      description: 'Bastien banni pour infraction',
      timestamp: 'Il y a 1 h',
      targetName: 'Bastien',
    }
  ];

  const adminSecret = process.env.ADMIN_SECRET || 'z?e?n?i?n?#?c?h?a?t?t?';

  return {
    users,
    registrationRequests,
    conversations,
    messages,
    activityLogs,
    settings: {
      adminSecret,
      appName: 'Zenin Chatt',
      version: '1.0.0',
      allowRegistrations: true,
      maintenanceMode: false,
    },
    sessions: {
      'token-demo-student': {
        userId: 'usr-current',
        role: 'USER',
        expiresAt: Date.now() + 365 * 86400000,
      },
      'token-demo-admin': {
        userId: 'admin-1',
        role: 'ADMIN',
        expiresAt: Date.now() + 365 * 86400000,
      },
    },
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const seeds = getDefaultSeeds();
        return {
          ...seeds,
          ...parsed,
          settings: {
            ...seeds.settings,
            ...(parsed.settings || {}),
          },
          sessions: {
            ...seeds.sessions,
            ...(parsed.sessions || {}),
          },
        };
      }
    } catch (e) {
      console.error('Error loading DB from file, resetting to defaults:', e);
    }
    const defaults = getDefaultSeeds();
    this.saveDirect(defaults);
    return defaults;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  private persist() {
    this.saveDirect(this.data);
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.persist();
    return user;
  }

  // Registration Requests
  getRegistrationRequests(): RegistrationRequest[] {
    return this.data.registrationRequests;
  }

  createRegistrationRequest(req: RegistrationRequest): RegistrationRequest {
    this.data.registrationRequests.unshift(req);
    this.persist();
    return req;
  }

  updateRegistrationRequest(id: string, status: 'APPROVED' | 'REJECTED'): RegistrationRequest | undefined {
    const req = this.data.registrationRequests.find(r => r.id === id);
    if (!req) return undefined;
    req.status = status;
    this.persist();
    return req;
  }

  removeRegistrationRequest(id: string): boolean {
    const index = this.data.registrationRequests.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.data.registrationRequests.splice(index, 1);
    this.persist();
    return true;
  }

  // Conversations & Messages
  getConversationsForUser(userId: string): Conversation[] {
    return this.data.conversations.filter(c => c.memberIds.includes(userId));
  }

  getAllConversations(): Conversation[] {
    return this.data.conversations;
  }

  getConversationById(id: string): Conversation | undefined {
    return this.data.conversations.find(c => c.id === id);
  }

  getOrCreateDirectConversation(userId1: string, userId2: string): Conversation {
    let conv = this.data.conversations.find(
      c => c.memberIds.length === 2 && c.memberIds.includes(userId1) && c.memberIds.includes(userId2)
    );
    if (!conv) {
      conv = {
        id: 'conv-' + crypto.randomBytes(6).toString('hex'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberIds: [userId1, userId2],
      };
      this.data.conversations.unshift(conv);
      this.persist();
    }
    return conv;
  }

  getMessages(conversationId: string): Message[] {
    return this.data.messages.filter(m => m.conversationId === conversationId);
  }

  getAllMessages(): Message[] {
    return this.data.messages;
  }

  addMessage(msg: Message): Message {
    this.data.messages.push(msg);
    const conv = this.getConversationById(msg.conversationId);
    if (conv) {
      conv.updatedAt = new Date().toISOString();
    }
    this.persist();
    return msg;
  }

  markMessagesAsRead(conversationId: string, currentUserId: string) {
    let changed = false;
    for (const msg of this.data.messages) {
      if (msg.conversationId === conversationId && msg.senderId !== currentUserId && !msg.read) {
        msg.read = true;
        changed = true;
      }
    }
    if (changed) this.persist();
  }

  // Logs
  getLogs(): ActivityLog[] {
    return this.data.activityLogs;
  }

  addLog(log: Omit<ActivityLog, 'id'>): ActivityLog {
    const newLog: ActivityLog = {
      ...log,
      id: 'log-' + crypto.randomBytes(4).toString('hex'),
    };
    this.data.activityLogs.unshift(newLog);
    if (this.data.activityLogs.length > 50) {
      this.data.activityLogs.pop();
    }
    this.persist();
    return newLog;
  }

  // Settings
  getSettings(): AppSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<AppSettings>): AppSettings {
    Object.assign(this.data.settings, updates);
    this.persist();
    return this.data.settings;
  }

  // Sessions
  createSession(userId: string, role: 'USER' | 'ADMIN'): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.data.sessions[token] = { userId, role, expiresAt };
    this.persist();
    return token;
  }

  validateSession(token: string): { userId: string; role: 'USER' | 'ADMIN' } | null {
    if (!token) return null;
    if (token === 'token-demo-student') {
      return { userId: 'usr-current', role: 'USER' };
    }
    if (token === 'token-demo-admin') {
      return { userId: 'admin-1', role: 'ADMIN' };
    }
    const session = this.data.sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.persist();
      return null;
    }
    // If user is banned, invalidate session
    if (session.role === 'USER') {
      const user = this.getUserById(session.userId);
      if (!user || user.banned || user.status === 'BANNED') {
        delete this.data.sessions[token];
        this.persist();
        return null;
      }
    }
    return session;
  }

  destroySession(token: string) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.persist();
    }
  }

  invalidateUserSessions(userId: string) {
    let changed = false;
    for (const [tok, sess] of Object.entries(this.data.sessions)) {
      if (sess.userId === userId) {
        delete this.data.sessions[tok];
        changed = true;
      }
    }
    if (changed) this.persist();
  }
}

export const db = new Database();
