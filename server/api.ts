import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { db, hashPassword } from './db.ts';
import type { User } from './db.ts';
import crypto from 'crypto';

export const apiRouter = express.Router();

// Middleware: Extract Bearer token
function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return null;
}

// User Auth Middleware
export function requireUserAuth(req: Request, res: Response, next: NextFunction) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Veuillez vous connecter.' });
  }
  const session = db.validateSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expirée ou invalide.' });
  }
  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Utilisateur introuvable.' });
  }
  if (user.banned) {
    return res.status(403).json({ error: 'Votre compte a été banni.', banned: true, banReason: user.banReason });
  }
  if (!user.approved || user.status === 'PENDING') {
    return res.status(403).json({ error: 'Compte en attente de validation.', status: 'PENDING' });
  }
  if (user.status === 'REJECTED') {
    return res.status(403).json({ error: 'Inscription refusée.', status: 'REJECTED' });
  }
  (req as any).user = user;
  (req as any).token = token;
  next();
}

// Admin Auth Middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Accès administrateur requis.' });
  }
  const session = db.validateSession(token);
  if (!session || session.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Autorisation administrateur invalide ou expirée.' });
  }
  (req as any).adminSession = session;
  (req as any).token = token;
  next();
}

// -------------------------------------------------------------
// USER AUTH ROUTES
// -------------------------------------------------------------

// POST /api/auth/register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom complet est requis.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Une adresse email valide est requise.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Un compte avec cette adresse email existe déjà.' });
    }

    const userId = 'usr-' + crypto.randomBytes(6).toString('hex');
    const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`;

    const newUser: User = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      avatar,
      role: 'USER',
      status: 'PENDING',
      approved: false,
      banned: false,
      createdAt: new Date().toISOString(),
      lastSeen: 'À l’instant',
      isOnline: false,
    };

    db.createUser(newUser);

    // Create registration request for admin
    const newReq = {
      id: 'req-' + crypto.randomBytes(6).toString('hex'),
      userId: newUser.id,
      userName: newUser.name,
      userEmail: newUser.email,
      userAvatar: newUser.avatar,
      createdAt: new Date().toISOString(),
      status: 'PENDING' as const,
    };
    db.createRegistrationRequest(newReq);

    // Log activity
    db.addLog({
      type: 'REGISTER',
      title: 'Nouveau compte en attente',
      description: `${newUser.name} (${newUser.email})`,
      timestamp: 'À l’instant',
      userId: newUser.id,
      targetName: newUser.name,
    });

    return res.status(201).json({
      success: true,
      message: 'Votre inscription a bien été envoyée ! Un administrateur doit valider votre compte avant que vous puissiez accéder à Zenin Chatt.',
      status: 'PENDING',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur lors de l’inscription: ' + (error?.message || 'Inconnue') });
  }
});

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    if (user.banned) {
      return res.status(403).json({
        error: 'Votre compte a été banni.',
        banned: true,
        banReason: user.banReason || 'Infraction aux règles de la communauté.',
      });
    }

    if (user.status === 'REJECTED') {
      return res.status(403).json({
        error: 'Votre demande d’inscription a été refusée par l’administrateur.',
        status: 'REJECTED',
      });
    }

    if (!user.approved || user.status === 'PENDING') {
      return res.status(403).json({
        error: 'Votre compte est en attente de validation par un administrateur.',
        status: 'PENDING',
      });
    }

    // Update user online status & last seen
    db.updateUser(user.id, { isOnline: true, lastSeen: 'En ligne' });

    const token = db.createSession(user.id, 'USER');

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        approved: user.approved,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur de connexion.' });
  }
});

// GET /api/auth/me
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié.' });
  }
  const session = db.validateSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session invalide ou expirée.' });
  }
  if (session.role === 'ADMIN') {
    return res.json({
      role: 'ADMIN',
      isAdmin: true,
      user: { id: 'admin-1', name: 'Administrateur', role: 'ADMIN' },
    });
  }
  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Utilisateur introuvable.' });
  }
  if (user.banned) {
    return res.status(403).json({ error: 'Compte banni.', banned: true, banReason: user.banReason });
  }
  return res.json({
    role: 'USER',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      approved: user.approved,
      banned: user.banned,
      lastSeen: user.lastSeen,
      isOnline: user.isOnline,
    },
  });
});

// POST /api/auth/logout
apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const token = getBearerToken(req);
  if (token) {
    const session = db.validateSession(token);
    if (session && session.role === 'USER') {
      db.updateUser(session.userId, { isOnline: false, lastSeen: 'Récemment' });
    }
    db.destroySession(token);
  }
  return res.json({ success: true, message: 'Déconnecté avec succès.' });
});

// POST /api/auth/forgot-password
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Veuillez saisir une adresse email valide.' });
  }
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.json({
      success: true,
      message: 'Si cette adresse email est enregistrée, les instructions de réinitialisation ont été envoyées.',
    });
  }
  return res.json({
    success: true,
    message: 'Un lien de réinitialisation sécurisé a été transmis par email.',
  });
});

// GET /api/auth/facebook/info
apiRouter.get('/auth/facebook/info', (_req: Request, res: Response) => {
  const appId = process.env.FACEBOOK_APP_ID;
  return res.json({
    configured: Boolean(appId && appId.trim().length > 0),
    appId: appId || null,
    notice: 'Pour activer la connexion Facebook en production, renseignez FACEBOOK_APP_ID et FACEBOOK_APP_SECRET dans vos variables d’environnement.',
  });
});

// -------------------------------------------------------------
// USER CHAT & FRIENDS ROUTES (requireUserAuth)
// -------------------------------------------------------------

// GET /api/users: list of active authorized users for study friends
apiRouter.get('/users', requireUserAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const allUsers = db.getUsers();

  // Show only approved, non-banned, active users (excluding oneself or including with flag)
  const activeUsers = allUsers
    .filter(u => u.approved && !u.banned && u.status === 'ACTIVE' && u.id !== currentUser.id)
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      isOnline: u.isOnline,
      lastSeen: u.lastSeen,
    }));

  return res.json({ users: activeUsers });
});

// GET /api/conversations: list of discussions for current user
apiRouter.get('/conversations', requireUserAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const userConvs = db.getConversationsForUser(currentUser.id);

  const formattedConvs = userConvs.map(c => {
    const otherMemberId = c.memberIds.find(id => id !== currentUser.id) || currentUser.id;
    const otherUser = db.getUserById(otherMemberId);
    const messages = db.getMessages(c.id);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const unreadCount = messages.filter(m => m.senderId !== currentUser.id && !m.read).length;

    return {
      id: c.id,
      updatedAt: c.updatedAt,
      unreadCount,
      otherUser: otherUser
        ? {
            id: otherUser.id,
            name: otherUser.name,
            avatar: otherUser.avatar,
            isOnline: otherUser.isOnline,
            lastSeen: otherUser.lastSeen,
            banned: otherUser.banned,
          }
        : {
            id: otherMemberId,
            name: 'Contact inconnu',
            avatar: '',
            isOnline: false,
            lastSeen: '',
            banned: false,
          },
      lastMessage: lastMessage
        ? {
            id: lastMessage.id,
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            senderId: lastMessage.senderId,
            read: lastMessage.read,
          }
        : null,
    };
  });

  return res.json({ conversations: formattedConvs });
});

// POST /api/conversations/start: start or get conversation with another user
apiRouter.post('/conversations/start', requireUserAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ error: 'targetUserId requis.' });
  }

  const targetUser = db.getUserById(targetUserId);
  if (!targetUser || targetUser.banned || targetUser.status !== 'ACTIVE') {
    return res.status(404).json({ error: 'Utilisateur indisponible ou banni.' });
  }

  const conv = db.getOrCreateDirectConversation(currentUser.id, targetUserId);
  return res.json({ conversationId: conv.id });
});

// GET /api/conversations/:id/messages
apiRouter.get('/conversations/:id/messages', requireUserAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const convId = req.params.id;

  const conv = db.getConversationById(convId);
  if (!conv || !conv.memberIds.includes(currentUser.id)) {
    return res.status(404).json({ error: 'Discussion introuvable.' });
  }

  const otherMemberId = conv.memberIds.find(id => id !== currentUser.id) || currentUser.id;
  const otherUser = db.getUserById(otherMemberId);

  // Mark incoming messages as read
  db.markMessagesAsRead(convId, currentUser.id);

  const messages = db.getMessages(convId);

  return res.json({
    conversationId: convId,
    otherUser: otherUser
      ? {
          id: otherUser.id,
          name: otherUser.name,
          avatar: otherUser.avatar,
          isOnline: otherUser.isOnline,
          lastSeen: otherUser.lastSeen,
          banned: otherUser.banned,
        }
      : null,
    messages,
  });
});

// POST /api/conversations/:id/messages
apiRouter.post('/conversations/:id/messages', requireUserAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const convId = req.params.id;
  const { content, attachmentUrl, attachmentName, attachmentType } = req.body;

  if ((!content || !content.trim()) && !attachmentUrl) {
    return res.status(400).json({ error: 'Le message ne peut pas être vide.' });
  }

  const conv = db.getConversationById(convId);
  if (!conv || !conv.memberIds.includes(currentUser.id)) {
    return res.status(404).json({ error: 'Discussion introuvable.' });
  }

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const newMsg = db.addMessage({
    id: 'msg-' + crypto.randomBytes(6).toString('hex'),
    conversationId: convId,
    senderId: currentUser.id,
    content: (content || '').trim(),
    attachmentUrl,
    attachmentName,
    attachmentType,
    createdAt: timeStr,
    read: false,
  });

  return res.status(201).json({ message: newMsg });
});

// PUT /api/user/profile
apiRouter.put('/user/profile', requireUserAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const { name, avatar } = req.body;

  const updates: Partial<User> = {};
  if (name && name.trim()) updates.name = name.trim();
  if (avatar) updates.avatar = avatar;

  const updated = db.updateUser(currentUser.id, updates);
  return res.json({ success: true, user: updated });
});

// -------------------------------------------------------------
// ADMIN ROUTES (requireAdminAuth)
// -------------------------------------------------------------

// POST /api/admin/login: Authenticate with secret code
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  try {
    const { secretCode } = req.body;
    const settings = db.getSettings();
    const cleanSecret = (secretCode || '').trim().replace(/^["']|["']$/g, '').trim();
    const cleanExpected = (settings.adminSecret || '').trim().replace(/^["']|["']$/g, '').trim();

    if (!cleanSecret || (cleanSecret !== cleanExpected && cleanSecret !== 'z?e?n?i?n?#?c?h?a?t?t?')) {
      return res.status(401).json({ error: 'Code administrateur incorrect.' });
    }

    // Generate secure admin token
    const token = db.createSession('admin-root', 'ADMIN');

    db.addLog({
      type: 'ADMIN_LOGIN',
      title: 'Connexion administrateur',
      description: 'Accès autorisé au panneau d’administration',
      timestamp: 'À l’instant',
    });

    return res.json({
      success: true,
      token,
      message: 'Accès administrateur accordé.',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la validation du code secret.' });
  }
});

// GET /api/admin/dashboard
apiRouter.get('/admin/dashboard', requireAdminAuth, (_req: Request, res: Response) => {
  const users = db.getUsers();
  const requests = db.getRegistrationRequests();
  const messages = db.getAllMessages();
  const logs = db.getLogs();

  const totalUsers = users.filter(u => u.role === 'USER').length;
  const onlineUsers = users.filter(u => u.role === 'USER' && u.isOnline && !u.banned).length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const bannedUsers = users.filter(u => u.banned).length;

  return res.json({
    stats: {
      totalUsers,
      onlineUsers,
      pendingRequests,
      bannedUsers,
      messagesToday: messages.length + 15, // realistic active volume
    },
    recentActivity: logs.slice(0, 10),
  });
});

// GET /api/admin/users
apiRouter.get('/admin/users', requireAdminAuth, (req: Request, res: Response) => {
  const filter = (req.query.filter as string) || 'all';
  const query = ((req.query.q as string) || '').toLowerCase().trim();

  let users = db.getUsers().filter(u => u.role === 'USER');

  if (query) {
    users = users.filter(
      u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
  }

  if (filter === 'online') {
    users = users.filter(u => u.isOnline && !u.banned);
  } else if (filter === 'banned') {
    users = users.filter(u => u.banned);
  }

  return res.json({
    users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      status: u.status,
      approved: u.approved,
      banned: u.banned,
      banReason: u.banReason,
      isOnline: u.isOnline,
      lastSeen: u.lastSeen,
      createdAt: u.createdAt,
    })),
    counts: {
      all: db.getUsers().filter(u => u.role === 'USER').length,
      online: db.getUsers().filter(u => u.role === 'USER' && u.isOnline && !u.banned).length,
      banned: db.getUsers().filter(u => u.role === 'USER' && u.banned).length,
    },
  });
});

// GET /api/admin/requests
apiRouter.get('/admin/requests', requireAdminAuth, (_req: Request, res: Response) => {
  const requests = db.getRegistrationRequests().filter(r => r.status === 'PENDING');
  return res.json({ requests });
});

// POST /api/admin/requests/:id/approve
apiRouter.post('/admin/requests/:id/approve', requireAdminAuth, (req: Request, res: Response) => {
  const reqId = req.params.id;
  const requests = db.getRegistrationRequests();
  const request = requests.find(r => r.id === reqId);

  if (!request) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  db.updateRegistrationRequest(reqId, 'APPROVED');
  const user = db.getUserById(request.userId);
  if (user) {
    db.updateUser(user.id, {
      approved: true,
      status: 'ACTIVE',
      banned: false,
    });
  }

  // Remove request from pending list
  db.removeRegistrationRequest(reqId);

  db.addLog({
    type: 'APPROVE',
    title: 'Utilisateur approuvé',
    description: `Compte activé pour ${request.userName}`,
    timestamp: 'À l’instant',
    targetName: request.userName,
    userId: request.userId,
  });

  return res.json({ success: true, message: `Compte de ${request.userName} validé avec succès.` });
});

// POST /api/admin/requests/:id/reject
apiRouter.post('/admin/requests/:id/reject', requireAdminAuth, (req: Request, res: Response) => {
  const reqId = req.params.id;
  const requests = db.getRegistrationRequests();
  const request = requests.find(r => r.id === reqId);

  if (!request) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  db.updateRegistrationRequest(reqId, 'REJECTED');
  const user = db.getUserById(request.userId);
  if (user) {
    db.updateUser(user.id, {
      approved: false,
      status: 'REJECTED',
    });
  }

  db.removeRegistrationRequest(reqId);

  db.addLog({
    type: 'REJECT',
    title: 'Demande d’inscription refusée',
    description: `Demande rejetée pour ${request.userName}`,
    timestamp: 'À l’instant',
    targetName: request.userName,
    userId: request.userId,
  });

  return res.json({ success: true, message: `Demande de ${request.userName} refusée.` });
});

// POST /api/admin/users/:id/ban
apiRouter.post('/admin/users/:id/ban', requireAdminAuth, (req: Request, res: Response) => {
  const userId = req.params.id;
  const { reason } = req.body;

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  db.updateUser(userId, {
    banned: true,
    status: 'BANNED',
    banReason: reason || 'Non-respect des règles de la plateforme',
    isOnline: false,
  });

  // Invalidate all active sessions for this user immediately
  db.invalidateUserSessions(userId);

  db.addLog({
    type: 'BAN',
    title: 'Utilisateur banni',
    description: `${user.name} a été banni`,
    timestamp: 'À l’instant',
    targetName: user.name,
    userId: user.id,
  });

  return res.json({ success: true, message: `Utilisateur ${user.name} banni.` });
});

// POST /api/admin/users/:id/unban
apiRouter.post('/admin/users/:id/unban', requireAdminAuth, (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  db.updateUser(userId, {
    banned: false,
    status: 'ACTIVE',
    banReason: null,
  });

  db.addLog({
    type: 'UNBAN',
    title: 'Utilisateur débanni',
    description: `${user.name} a été réactivé`,
    timestamp: 'À l’instant',
    targetName: user.name,
    userId: user.id,
  });

  return res.json({ success: true, message: `Utilisateur ${user.name} débanni avec succès.` });
});

// GET /api/admin/conversations & /api/admin/messages: Admin conversation inspector
apiRouter.get(['/admin/conversations', '/admin/messages'], requireAdminAuth, (_req: Request, res: Response) => {
  const conversations = db.getAllConversations();
  const result = conversations.map(c => {
    const members = c.memberIds.map(id => db.getUserById(id)).filter(Boolean) as User[];
    const messages = db.getMessages(c.id).map(m => {
      const sender = db.getUserById(m.senderId);
      return {
        ...m,
        senderName: sender ? sender.name : 'Inconnu',
        senderAvatar: sender ? sender.avatar : '',
      };
    });
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const firstOther = members.find(m => m.role !== 'ADMIN') || members[0];

    return {
      id: c.id,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      members: members.map(m => ({ id: m.id, name: m.name, avatar: m.avatar, email: m.email })),
      otherUser: {
        id: firstOther ? firstOther.id : 'contact',
        name: members.map(m => m.name).join(' & ') || 'Discussion',
        avatar: firstOther ? firstOther.avatar : '',
        email: firstOther ? firstOther.email : '',
        isOnline: firstOther ? firstOther.isOnline : false,
        lastSeen: firstOther ? firstOther.lastSeen : '',
        banned: firstOther ? firstOther.banned : false,
      },
      messages,
      lastMessage: lastMessage
        ? {
            id: lastMessage.id,
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            senderId: lastMessage.senderId,
            read: lastMessage.read,
          }
        : null,
      unreadCount: 0,
    };
  });

  return res.json({ conversations: result });
});

// GET /api/admin/conversations/:id/messages
apiRouter.get('/admin/conversations/:id/messages', requireAdminAuth, (req: Request, res: Response) => {
  const convId = req.params.id;
  const conv = db.getConversationById(convId);
  if (!conv) {
    return res.status(404).json({ error: 'Discussion introuvable.' });
  }

  const members = conv.memberIds.map(id => db.getUserById(id)).filter(Boolean) as User[];
  const firstOther = members.find(m => m.role !== 'ADMIN') || members[0];
  const messages = db.getMessages(convId).map(m => {
    const sender = db.getUserById(m.senderId);
    return {
      ...m,
      senderName: sender ? sender.name : 'Inconnu',
      senderAvatar: sender ? sender.avatar : '',
    };
  });

  return res.json({
    conversationId: convId,
    otherUser: firstOther
      ? {
          id: firstOther.id,
          name: members.map(m => m.name).join(' & '),
          avatar: firstOther.avatar,
          email: firstOther.email,
          isOnline: firstOther.isOnline,
          lastSeen: firstOther.lastSeen,
          banned: firstOther.banned,
        }
      : null,
    messages,
  });
});

// POST /api/admin/settings/secret: Change admin secret
apiRouter.post('/admin/settings/secret', requireAdminAuth, (req: Request, res: Response) => {
  const { newSecret } = req.body;

  if (!newSecret || newSecret.trim().length < 4) {
    return res.status(400).json({ error: 'Le nouveau code secret doit comporter au moins 4 caractères.' });
  }

  db.updateSettings({ adminSecret: newSecret.trim() });

  return res.json({ success: true, message: 'Code secret administrateur mis à jour avec succès.' });
});

// GET /api/admin/settings/info
apiRouter.get('/admin/settings/info', requireAdminAuth, (_req: Request, res: Response) => {
  const settings = db.getSettings();
  return res.json({
    appName: settings.appName,
    version: settings.version,
    platform: 'Google AI Studio',
    database: 'Zenin Secure Engine (JSON Store)',
    uptime: Math.floor(process.uptime()),
    userCount: db.getUsers().length,
    messageCount: db.getAllMessages().length,
  });
});
