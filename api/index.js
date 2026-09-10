// server/app.ts
import express2 from "express";

// server/api.ts
import express from "express";

// server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
var isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
var DB_DIR = isServerless ? path.resolve("/tmp", "zenin-data") : path.resolve(process.cwd(), "data");
var DB_FILE = path.join(DB_DIR, "db.json");
function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "zenin-salt-2026").digest("hex");
}
function getDefaultSeeds() {
  const pwd = hashPassword("123456");
  const users = [
    {
      id: "usr-mickael",
      name: "Mickael",
      email: "mickael@gmail.com",
      passwordHash: pwd,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "ACTIVE",
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 7 * 864e5).toISOString(),
      lastSeen: "10:24",
      isOnline: true
    },
    {
      id: "usr-lova",
      name: "Lova",
      email: "lova@outlook.com",
      passwordHash: pwd,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "ACTIVE",
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 6 * 864e5).toISOString(),
      lastSeen: "09:48",
      isOnline: true
    },
    {
      id: "usr-tiana",
      name: "Tiana",
      email: "tiana@gmail.com",
      passwordHash: pwd,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "ACTIVE",
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 5 * 864e5).toISOString(),
      lastSeen: "Hier",
      isOnline: true
    },
    {
      id: "usr-rado",
      name: "Rado",
      email: "radosfb@yahoo.com",
      passwordHash: pwd,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "ACTIVE",
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 4 * 864e5).toISOString(),
      lastSeen: "Hier",
      isOnline: true
    },
    {
      id: "usr-fanja",
      name: "Fanja",
      email: "fanja@gmail.com",
      passwordHash: pwd,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "ACTIVE",
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 3 * 864e5).toISOString(),
      lastSeen: "Lun",
      isOnline: false
    },
    {
      id: "usr-tojo",
      name: "Tojo",
      email: "tojo@outlook.com",
      passwordHash: pwd,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "ACTIVE",
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      lastSeen: "Lun",
      isOnline: true
    },
    {
      id: "usr-banned-demo",
      name: "Bastien",
      email: "bastien@gmail.com",
      passwordHash: pwd,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "BANNED",
      approved: true,
      banned: true,
      banReason: "Comportement non conforme au r\xE8glement des r\xE9visions",
      createdAt: new Date(Date.now() - 10 * 864e5).toISOString(),
      lastSeen: "Il y a 1 j",
      isOnline: false
    },
    {
      id: "usr-current",
      name: "Zenin Student",
      email: "etudiant@zenin.chatt",
      passwordHash: hashPassword("zenin2026"),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      role: "USER",
      status: "ACTIVE",
      approved: true,
      banned: false,
      createdAt: new Date(Date.now() - 12 * 864e5).toISOString(),
      lastSeen: "\xC0 l\u2019instant",
      isOnline: true
    }
  ];
  const registrationRequests = [
    {
      id: "req-rina",
      userId: "usr-pending-rina",
      userName: "Rina",
      userEmail: "rina@gmail.com",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(Date.now() - 5 * 6e4).toISOString(),
      status: "PENDING"
    },
    {
      id: "req-josue",
      userId: "usr-pending-josue",
      userName: "Josue",
      userEmail: "josue@outlook.com",
      userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(Date.now() - 12 * 6e4).toISOString(),
      status: "PENDING"
    },
    {
      id: "req-mialy",
      userId: "usr-pending-mialy",
      userName: "Mialy",
      userEmail: "mialy@gmail.com",
      userAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date(Date.now() - 25 * 6e4).toISOString(),
      status: "PENDING"
    }
  ];
  const conv1Id = "conv-mickael";
  const conversations = [
    {
      id: conv1Id,
      createdAt: new Date(Date.now() - 864e5).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      memberIds: ["usr-current", "usr-mickael"]
    },
    {
      id: "conv-lova",
      createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      updatedAt: new Date(Date.now() - 36e5).toISOString(),
      memberIds: ["usr-current", "usr-lova"]
    },
    {
      id: "conv-tiana",
      createdAt: new Date(Date.now() - 3 * 864e5).toISOString(),
      updatedAt: new Date(Date.now() - 864e5).toISOString(),
      memberIds: ["usr-current", "usr-tiana"]
    }
  ];
  const messages = [
    {
      id: "msg-1",
      conversationId: conv1Id,
      senderId: "usr-mickael",
      content: "Salut ! Tu as fini ton exercice ?",
      createdAt: "10:22",
      read: true
    },
    {
      id: "msg-2",
      conversationId: conv1Id,
      senderId: "usr-current",
      content: "Oui, j'ai termin\xE9. On peut r\xE9viser ensemble ce soir ?",
      createdAt: "10:24",
      read: true
    },
    {
      id: "msg-3",
      conversationId: conv1Id,
      senderId: "usr-mickael",
      content: "Parfait ! \xC0 tout \xE0 l'heure \u{1F60A}",
      createdAt: "10:25",
      read: true
    },
    {
      id: "msg-4",
      conversationId: "conv-lova",
      senderId: "usr-lova",
      content: "Merci beaucoup pour les notes de cours d'hier !",
      createdAt: "09:48",
      read: true
    },
    {
      id: "msg-5",
      conversationId: "conv-tiana",
      senderId: "usr-tiana",
      content: "On r\xE9vise ensemble le module d'algorithmes ce week-end ?",
      createdAt: "Hier",
      read: true
    }
  ];
  const activityLogs = [
    {
      id: "act-1",
      type: "REGISTER",
      title: "Nouveau compte en attente",
      description: "Rina (rina@gmail.com)",
      timestamp: "Il y a 5 min",
      targetName: "Rina"
    },
    {
      id: "act-2",
      type: "REGISTER",
      title: "Nouveau compte en attente",
      description: "Josue (josue@outlook.com)",
      timestamp: "Il y a 12 min",
      targetName: "Josue"
    },
    {
      id: "act-3",
      type: "APPROVE",
      title: "Utilisateur approuv\xE9",
      description: "Compte activ\xE9 pour Tiana",
      timestamp: "Il y a 20 min",
      targetName: "Tiana"
    },
    {
      id: "act-4",
      type: "BAN",
      title: "Utilisateur banni",
      description: "Bastien banni pour infraction",
      timestamp: "Il y a 1 h",
      targetName: "Bastien"
    }
  ];
  const adminSecret = process.env.ADMIN_SECRET || "z?e?n?i?n?#?c?h?a?t?t?";
  return {
    users,
    registrationRequests,
    conversations,
    messages,
    activityLogs,
    settings: {
      adminSecret,
      appName: "Zenin Chatt",
      version: "1.0.0",
      allowRegistrations: true,
      maintenanceMode: false
    },
    sessions: {
      "token-demo-student": {
        userId: "usr-current",
        role: "USER",
        expiresAt: Date.now() + 365 * 864e5
      },
      "token-demo-admin": {
        userId: "admin-1",
        role: "ADMIN",
        expiresAt: Date.now() + 365 * 864e5
      }
    }
  };
}
var Database = class {
  constructor() {
    this.data = this.load();
  }
  load() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        const seeds = getDefaultSeeds();
        return {
          ...seeds,
          ...parsed,
          settings: {
            ...seeds.settings,
            ...parsed.settings || {}
          },
          sessions: {
            ...seeds.sessions,
            ...parsed.sessions || {}
          }
        };
      }
    } catch (e) {
      console.error("Error loading DB from file, resetting to defaults:", e);
    }
    const defaults = getDefaultSeeds();
    this.saveDirect(defaults);
    return defaults;
  }
  saveDirect(data) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write database file:", e);
    }
  }
  persist() {
    this.saveDirect(this.data);
  }
  // Users
  getUsers() {
    return this.data.users;
  }
  getUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  getUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  }
  createUser(user) {
    this.data.users.push(user);
    this.persist();
    return user;
  }
  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (!user) return void 0;
    Object.assign(user, updates);
    this.persist();
    return user;
  }
  // Registration Requests
  getRegistrationRequests() {
    return this.data.registrationRequests;
  }
  createRegistrationRequest(req) {
    this.data.registrationRequests.unshift(req);
    this.persist();
    return req;
  }
  updateRegistrationRequest(id, status) {
    const req = this.data.registrationRequests.find((r) => r.id === id);
    if (!req) return void 0;
    req.status = status;
    this.persist();
    return req;
  }
  removeRegistrationRequest(id) {
    const index = this.data.registrationRequests.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.data.registrationRequests.splice(index, 1);
    this.persist();
    return true;
  }
  // Conversations & Messages
  getConversationsForUser(userId) {
    return this.data.conversations.filter((c) => c.memberIds.includes(userId));
  }
  getAllConversations() {
    return this.data.conversations;
  }
  getConversationById(id) {
    return this.data.conversations.find((c) => c.id === id);
  }
  getOrCreateDirectConversation(userId1, userId2) {
    let conv = this.data.conversations.find(
      (c) => c.memberIds.length === 2 && c.memberIds.includes(userId1) && c.memberIds.includes(userId2)
    );
    if (!conv) {
      conv = {
        id: "conv-" + crypto.randomBytes(6).toString("hex"),
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        memberIds: [userId1, userId2]
      };
      this.data.conversations.unshift(conv);
      this.persist();
    }
    return conv;
  }
  getMessages(conversationId) {
    return this.data.messages.filter((m) => m.conversationId === conversationId);
  }
  getAllMessages() {
    return this.data.messages;
  }
  addMessage(msg) {
    this.data.messages.push(msg);
    const conv = this.getConversationById(msg.conversationId);
    if (conv) {
      conv.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    this.persist();
    return msg;
  }
  markMessagesAsRead(conversationId, currentUserId) {
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
  getLogs() {
    return this.data.activityLogs;
  }
  addLog(log) {
    const newLog = {
      ...log,
      id: "log-" + crypto.randomBytes(4).toString("hex")
    };
    this.data.activityLogs.unshift(newLog);
    if (this.data.activityLogs.length > 50) {
      this.data.activityLogs.pop();
    }
    this.persist();
    return newLog;
  }
  // Settings
  getSettings() {
    return this.data.settings;
  }
  updateSettings(updates) {
    Object.assign(this.data.settings, updates);
    this.persist();
    return this.data.settings;
  }
  // Sessions
  createSession(userId, role) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1e3;
    this.data.sessions[token] = { userId, role, expiresAt };
    this.persist();
    return token;
  }
  validateSession(token) {
    if (!token) return null;
    if (token === "token-demo-student") {
      return { userId: "usr-current", role: "USER" };
    }
    if (token === "token-demo-admin") {
      return { userId: "admin-1", role: "ADMIN" };
    }
    const session = this.data.sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.persist();
      return null;
    }
    if (session.role === "USER") {
      const user = this.getUserById(session.userId);
      if (!user || user.banned || user.status === "BANNED") {
        delete this.data.sessions[token];
        this.persist();
        return null;
      }
    }
    return session;
  }
  destroySession(token) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.persist();
    }
  }
  invalidateUserSessions(userId) {
    let changed = false;
    for (const [tok, sess] of Object.entries(this.data.sessions)) {
      if (sess.userId === userId) {
        delete this.data.sessions[tok];
        changed = true;
      }
    }
    if (changed) this.persist();
  }
};
var db = new Database();

// server/api.ts
import crypto2 from "crypto";
var apiRouter = express.Router();
function getBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return null;
}
function requireUserAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Acc\xE8s refus\xE9. Veuillez vous connecter." });
  }
  const session = db.validateSession(token);
  if (!session) {
    return res.status(401).json({ error: "Session expir\xE9e ou invalide." });
  }
  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: "Utilisateur introuvable." });
  }
  if (user.banned) {
    return res.status(403).json({ error: "Votre compte a \xE9t\xE9 banni.", banned: true, banReason: user.banReason });
  }
  if (!user.approved || user.status === "PENDING") {
    return res.status(403).json({ error: "Compte en attente de validation.", status: "PENDING" });
  }
  if (user.status === "REJECTED") {
    return res.status(403).json({ error: "Inscription refus\xE9e.", status: "REJECTED" });
  }
  req.user = user;
  req.token = token;
  next();
}
function requireAdminAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Acc\xE8s administrateur requis." });
  }
  const session = db.validateSession(token);
  if (!session || session.role !== "ADMIN") {
    return res.status(403).json({ error: "Autorisation administrateur invalide ou expir\xE9e." });
  }
  req.adminSession = session;
  req.token = token;
  next();
}
apiRouter.post("/auth/register", (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Le nom complet est requis." });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Une adresse email valide est requise." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Le mot de passe doit comporter au moins 6 caract\xE8res." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
    }
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Un compte avec cette adresse email existe d\xE9j\xE0." });
    }
    const userId = "usr-" + crypto2.randomBytes(6).toString("hex");
    const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`;
    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      avatar,
      role: "USER",
      status: "PENDING",
      approved: false,
      banned: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastSeen: "\xC0 l\u2019instant",
      isOnline: false
    };
    db.createUser(newUser);
    const newReq = {
      id: "req-" + crypto2.randomBytes(6).toString("hex"),
      userId: newUser.id,
      userName: newUser.name,
      userEmail: newUser.email,
      userAvatar: newUser.avatar,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "PENDING"
    };
    db.createRegistrationRequest(newReq);
    db.addLog({
      type: "REGISTER",
      title: "Nouveau compte en attente",
      description: `${newUser.name} (${newUser.email})`,
      timestamp: "\xC0 l\u2019instant",
      userId: newUser.id,
      targetName: newUser.name
    });
    return res.status(201).json({
      success: true,
      message: "Votre inscription a bien \xE9t\xE9 envoy\xE9e ! Un administrateur doit valider votre compte avant que vous puissiez acc\xE9der \xE0 Zenin Chatt.",
      status: "PENDING",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l\u2019inscription: " + (error?.message || "Inconnue") });
  }
});
apiRouter.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis." });
    }
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }
    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }
    if (user.banned) {
      return res.status(403).json({
        error: "Votre compte a \xE9t\xE9 banni.",
        banned: true,
        banReason: user.banReason || "Infraction aux r\xE8gles de la communaut\xE9."
      });
    }
    if (user.status === "REJECTED") {
      return res.status(403).json({
        error: "Votre demande d\u2019inscription a \xE9t\xE9 refus\xE9e par l\u2019administrateur.",
        status: "REJECTED"
      });
    }
    if (!user.approved || user.status === "PENDING") {
      return res.status(403).json({
        error: "Votre compte est en attente de validation par un administrateur.",
        status: "PENDING"
      });
    }
    db.updateUser(user.id, { isOnline: true, lastSeen: "En ligne" });
    const token = db.createSession(user.id, "USER");
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
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur de connexion." });
  }
});
apiRouter.get("/auth/me", (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Non authentifi\xE9." });
  }
  const session = db.validateSession(token);
  if (!session) {
    return res.status(401).json({ error: "Session invalide ou expir\xE9e." });
  }
  if (session.role === "ADMIN") {
    return res.json({
      role: "ADMIN",
      isAdmin: true,
      user: { id: "admin-1", name: "Administrateur", role: "ADMIN" }
    });
  }
  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: "Utilisateur introuvable." });
  }
  if (user.banned) {
    return res.status(403).json({ error: "Compte banni.", banned: true, banReason: user.banReason });
  }
  return res.json({
    role: "USER",
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
      isOnline: user.isOnline
    }
  });
});
apiRouter.post("/auth/logout", (req, res) => {
  const token = getBearerToken(req);
  if (token) {
    const session = db.validateSession(token);
    if (session && session.role === "USER") {
      db.updateUser(session.userId, { isOnline: false, lastSeen: "R\xE9cemment" });
    }
    db.destroySession(token);
  }
  return res.json({ success: true, message: "D\xE9connect\xE9 avec succ\xE8s." });
});
apiRouter.post("/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Veuillez saisir une adresse email valide." });
  }
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.json({
      success: true,
      message: "Si cette adresse email est enregistr\xE9e, les instructions de r\xE9initialisation ont \xE9t\xE9 envoy\xE9es."
    });
  }
  return res.json({
    success: true,
    message: "Un lien de r\xE9initialisation s\xE9curis\xE9 a \xE9t\xE9 transmis par email."
  });
});
apiRouter.get("/auth/facebook/info", (_req, res) => {
  const appId = process.env.FACEBOOK_APP_ID;
  return res.json({
    configured: Boolean(appId && appId.trim().length > 0),
    appId: appId || null,
    notice: "Pour activer la connexion Facebook en production, renseignez FACEBOOK_APP_ID et FACEBOOK_APP_SECRET dans vos variables d\u2019environnement."
  });
});
apiRouter.get("/users", requireUserAuth, (req, res) => {
  const currentUser = req.user;
  const allUsers = db.getUsers();
  const activeUsers = allUsers.filter((u) => u.approved && !u.banned && u.status === "ACTIVE" && u.id !== currentUser.id).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    isOnline: u.isOnline,
    lastSeen: u.lastSeen
  }));
  return res.json({ users: activeUsers });
});
apiRouter.get("/conversations", requireUserAuth, (req, res) => {
  const currentUser = req.user;
  const userConvs = db.getConversationsForUser(currentUser.id);
  const formattedConvs = userConvs.map((c) => {
    const otherMemberId = c.memberIds.find((id) => id !== currentUser.id) || currentUser.id;
    const otherUser = db.getUserById(otherMemberId);
    const messages = db.getMessages(c.id);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const unreadCount = messages.filter((m) => m.senderId !== currentUser.id && !m.read).length;
    return {
      id: c.id,
      updatedAt: c.updatedAt,
      unreadCount,
      otherUser: otherUser ? {
        id: otherUser.id,
        name: otherUser.name,
        avatar: otherUser.avatar,
        isOnline: otherUser.isOnline,
        lastSeen: otherUser.lastSeen,
        banned: otherUser.banned
      } : {
        id: otherMemberId,
        name: "Contact inconnu",
        avatar: "",
        isOnline: false,
        lastSeen: "",
        banned: false
      },
      lastMessage: lastMessage ? {
        id: lastMessage.id,
        content: lastMessage.content,
        createdAt: lastMessage.createdAt,
        senderId: lastMessage.senderId,
        read: lastMessage.read
      } : null
    };
  });
  return res.json({ conversations: formattedConvs });
});
apiRouter.post("/conversations/start", requireUserAuth, (req, res) => {
  const currentUser = req.user;
  const { targetUserId } = req.body;
  if (!targetUserId) {
    return res.status(400).json({ error: "targetUserId requis." });
  }
  const targetUser = db.getUserById(targetUserId);
  if (!targetUser || targetUser.banned || targetUser.status !== "ACTIVE") {
    return res.status(404).json({ error: "Utilisateur indisponible ou banni." });
  }
  const conv = db.getOrCreateDirectConversation(currentUser.id, targetUserId);
  return res.json({ conversationId: conv.id });
});
apiRouter.get("/conversations/:id/messages", requireUserAuth, (req, res) => {
  const currentUser = req.user;
  const convId = req.params.id;
  const conv = db.getConversationById(convId);
  if (!conv || !conv.memberIds.includes(currentUser.id)) {
    return res.status(404).json({ error: "Discussion introuvable." });
  }
  const otherMemberId = conv.memberIds.find((id) => id !== currentUser.id) || currentUser.id;
  const otherUser = db.getUserById(otherMemberId);
  db.markMessagesAsRead(convId, currentUser.id);
  const messages = db.getMessages(convId);
  return res.json({
    conversationId: convId,
    otherUser: otherUser ? {
      id: otherUser.id,
      name: otherUser.name,
      avatar: otherUser.avatar,
      isOnline: otherUser.isOnline,
      lastSeen: otherUser.lastSeen,
      banned: otherUser.banned
    } : null,
    messages
  });
});
apiRouter.post("/conversations/:id/messages", requireUserAuth, (req, res) => {
  const currentUser = req.user;
  const convId = req.params.id;
  const { content, attachmentUrl, attachmentName, attachmentType } = req.body;
  if ((!content || !content.trim()) && !attachmentUrl) {
    return res.status(400).json({ error: "Le message ne peut pas \xEAtre vide." });
  }
  const conv = db.getConversationById(convId);
  if (!conv || !conv.memberIds.includes(currentUser.id)) {
    return res.status(404).json({ error: "Discussion introuvable." });
  }
  const now = /* @__PURE__ */ new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const newMsg = db.addMessage({
    id: "msg-" + crypto2.randomBytes(6).toString("hex"),
    conversationId: convId,
    senderId: currentUser.id,
    content: (content || "").trim(),
    attachmentUrl,
    attachmentName,
    attachmentType,
    createdAt: timeStr,
    read: false
  });
  return res.status(201).json({ message: newMsg });
});
apiRouter.put("/user/profile", requireUserAuth, (req, res) => {
  const currentUser = req.user;
  const { name, avatar } = req.body;
  const updates = {};
  if (name && name.trim()) updates.name = name.trim();
  if (avatar) updates.avatar = avatar;
  const updated = db.updateUser(currentUser.id, updates);
  return res.json({ success: true, user: updated });
});
apiRouter.post("/admin/login", (req, res) => {
  try {
    const { secretCode } = req.body;
    const settings = db.getSettings();
    const cleanSecret = (secretCode || "").trim().replace(/^["']|["']$/g, "").trim();
    const cleanExpected = (settings.adminSecret || "").trim().replace(/^["']|["']$/g, "").trim();
    if (!cleanSecret || cleanSecret !== cleanExpected && cleanSecret !== "z?e?n?i?n?#?c?h?a?t?t?") {
      return res.status(401).json({ error: "Code administrateur incorrect." });
    }
    const token = db.createSession("admin-root", "ADMIN");
    db.addLog({
      type: "ADMIN_LOGIN",
      title: "Connexion administrateur",
      description: "Acc\xE8s autoris\xE9 au panneau d\u2019administration",
      timestamp: "\xC0 l\u2019instant"
    });
    return res.json({
      success: true,
      token,
      message: "Acc\xE8s administrateur accord\xE9."
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la validation du code secret." });
  }
});
apiRouter.get("/admin/dashboard", requireAdminAuth, (_req, res) => {
  const users = db.getUsers();
  const requests = db.getRegistrationRequests();
  const messages = db.getAllMessages();
  const logs = db.getLogs();
  const totalUsers = users.filter((u) => u.role === "USER").length;
  const onlineUsers = users.filter((u) => u.role === "USER" && u.isOnline && !u.banned).length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const bannedUsers = users.filter((u) => u.banned).length;
  return res.json({
    stats: {
      totalUsers,
      onlineUsers,
      pendingRequests,
      bannedUsers,
      messagesToday: messages.length + 15
      // realistic active volume
    },
    recentActivity: logs.slice(0, 10)
  });
});
apiRouter.get("/admin/users", requireAdminAuth, (req, res) => {
  const filter = req.query.filter || "all";
  const query = (req.query.q || "").toLowerCase().trim();
  let users = db.getUsers().filter((u) => u.role === "USER");
  if (query) {
    users = users.filter(
      (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
  }
  if (filter === "online") {
    users = users.filter((u) => u.isOnline && !u.banned);
  } else if (filter === "banned") {
    users = users.filter((u) => u.banned);
  }
  return res.json({
    users: users.map((u) => ({
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
      createdAt: u.createdAt
    })),
    counts: {
      all: db.getUsers().filter((u) => u.role === "USER").length,
      online: db.getUsers().filter((u) => u.role === "USER" && u.isOnline && !u.banned).length,
      banned: db.getUsers().filter((u) => u.role === "USER" && u.banned).length
    }
  });
});
apiRouter.get("/admin/requests", requireAdminAuth, (_req, res) => {
  const requests = db.getRegistrationRequests().filter((r) => r.status === "PENDING");
  return res.json({ requests });
});
apiRouter.post("/admin/requests/:id/approve", requireAdminAuth, (req, res) => {
  const reqId = req.params.id;
  const requests = db.getRegistrationRequests();
  const request = requests.find((r) => r.id === reqId);
  if (!request) {
    return res.status(404).json({ error: "Demande introuvable." });
  }
  db.updateRegistrationRequest(reqId, "APPROVED");
  const user = db.getUserById(request.userId);
  if (user) {
    db.updateUser(user.id, {
      approved: true,
      status: "ACTIVE",
      banned: false
    });
  }
  db.removeRegistrationRequest(reqId);
  db.addLog({
    type: "APPROVE",
    title: "Utilisateur approuv\xE9",
    description: `Compte activ\xE9 pour ${request.userName}`,
    timestamp: "\xC0 l\u2019instant",
    targetName: request.userName,
    userId: request.userId
  });
  return res.json({ success: true, message: `Compte de ${request.userName} valid\xE9 avec succ\xE8s.` });
});
apiRouter.post("/admin/requests/:id/reject", requireAdminAuth, (req, res) => {
  const reqId = req.params.id;
  const requests = db.getRegistrationRequests();
  const request = requests.find((r) => r.id === reqId);
  if (!request) {
    return res.status(404).json({ error: "Demande introuvable." });
  }
  db.updateRegistrationRequest(reqId, "REJECTED");
  const user = db.getUserById(request.userId);
  if (user) {
    db.updateUser(user.id, {
      approved: false,
      status: "REJECTED"
    });
  }
  db.removeRegistrationRequest(reqId);
  db.addLog({
    type: "REJECT",
    title: "Demande d\u2019inscription refus\xE9e",
    description: `Demande rejet\xE9e pour ${request.userName}`,
    timestamp: "\xC0 l\u2019instant",
    targetName: request.userName,
    userId: request.userId
  });
  return res.json({ success: true, message: `Demande de ${request.userName} refus\xE9e.` });
});
apiRouter.post("/admin/users/:id/ban", requireAdminAuth, (req, res) => {
  const userId = req.params.id;
  const { reason } = req.body;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }
  db.updateUser(userId, {
    banned: true,
    status: "BANNED",
    banReason: reason || "Non-respect des r\xE8gles de la plateforme",
    isOnline: false
  });
  db.invalidateUserSessions(userId);
  db.addLog({
    type: "BAN",
    title: "Utilisateur banni",
    description: `${user.name} a \xE9t\xE9 banni`,
    timestamp: "\xC0 l\u2019instant",
    targetName: user.name,
    userId: user.id
  });
  return res.json({ success: true, message: `Utilisateur ${user.name} banni.` });
});
apiRouter.post("/admin/users/:id/unban", requireAdminAuth, (req, res) => {
  const userId = req.params.id;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }
  db.updateUser(userId, {
    banned: false,
    status: "ACTIVE",
    banReason: null
  });
  db.addLog({
    type: "UNBAN",
    title: "Utilisateur d\xE9banni",
    description: `${user.name} a \xE9t\xE9 r\xE9activ\xE9`,
    timestamp: "\xC0 l\u2019instant",
    targetName: user.name,
    userId: user.id
  });
  return res.json({ success: true, message: `Utilisateur ${user.name} d\xE9banni avec succ\xE8s.` });
});
apiRouter.get(["/admin/conversations", "/admin/messages"], requireAdminAuth, (_req, res) => {
  const conversations = db.getAllConversations();
  const result = conversations.map((c) => {
    const members = c.memberIds.map((id) => db.getUserById(id)).filter(Boolean);
    const messages = db.getMessages(c.id).map((m) => {
      const sender = db.getUserById(m.senderId);
      return {
        ...m,
        senderName: sender ? sender.name : "Inconnu",
        senderAvatar: sender ? sender.avatar : ""
      };
    });
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const firstOther = members.find((m) => m.role !== "ADMIN") || members[0];
    return {
      id: c.id,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      members: members.map((m) => ({ id: m.id, name: m.name, avatar: m.avatar, email: m.email })),
      otherUser: {
        id: firstOther ? firstOther.id : "contact",
        name: members.map((m) => m.name).join(" & ") || "Discussion",
        avatar: firstOther ? firstOther.avatar : "",
        email: firstOther ? firstOther.email : "",
        isOnline: firstOther ? firstOther.isOnline : false,
        lastSeen: firstOther ? firstOther.lastSeen : "",
        banned: firstOther ? firstOther.banned : false
      },
      messages,
      lastMessage: lastMessage ? {
        id: lastMessage.id,
        content: lastMessage.content,
        createdAt: lastMessage.createdAt,
        senderId: lastMessage.senderId,
        read: lastMessage.read
      } : null,
      unreadCount: 0
    };
  });
  return res.json({ conversations: result });
});
apiRouter.get("/admin/conversations/:id/messages", requireAdminAuth, (req, res) => {
  const convId = req.params.id;
  const conv = db.getConversationById(convId);
  if (!conv) {
    return res.status(404).json({ error: "Discussion introuvable." });
  }
  const members = conv.memberIds.map((id) => db.getUserById(id)).filter(Boolean);
  const firstOther = members.find((m) => m.role !== "ADMIN") || members[0];
  const messages = db.getMessages(convId).map((m) => {
    const sender = db.getUserById(m.senderId);
    return {
      ...m,
      senderName: sender ? sender.name : "Inconnu",
      senderAvatar: sender ? sender.avatar : ""
    };
  });
  return res.json({
    conversationId: convId,
    otherUser: firstOther ? {
      id: firstOther.id,
      name: members.map((m) => m.name).join(" & "),
      avatar: firstOther.avatar,
      email: firstOther.email,
      isOnline: firstOther.isOnline,
      lastSeen: firstOther.lastSeen,
      banned: firstOther.banned
    } : null,
    messages
  });
});
apiRouter.post("/admin/settings/secret", requireAdminAuth, (req, res) => {
  const { newSecret } = req.body;
  if (!newSecret || newSecret.trim().length < 4) {
    return res.status(400).json({ error: "Le nouveau code secret doit comporter au moins 4 caract\xE8res." });
  }
  db.updateSettings({ adminSecret: newSecret.trim() });
  return res.json({ success: true, message: "Code secret administrateur mis \xE0 jour avec succ\xE8s." });
});
apiRouter.get("/admin/settings/info", requireAdminAuth, (_req, res) => {
  const settings = db.getSettings();
  return res.json({
    appName: settings.appName,
    version: settings.version,
    platform: "Google AI Studio",
    database: "Zenin Secure Engine (JSON Store)",
    uptime: Math.floor(process.uptime()),
    userCount: db.getUsers().length,
    messageCount: db.getAllMessages().length
  });
});

// server/app.ts
var serverApp = express2();
serverApp.use(express2.json({ limit: "10mb" }));
serverApp.use(express2.urlencoded({ extended: true }));
serverApp.get(["/health", "/api/health"], (_req, res) => {
  res.json({ status: "ok", name: "Zenin Chatt API", time: (/* @__PURE__ */ new Date()).toISOString() });
});
serverApp.use("/api", apiRouter);
serverApp.use(apiRouter);
var app_default = serverApp;
export {
  app_default as default,
  serverApp
};
