import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  ChevronLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  X,
  Plus
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Conversation, Message } from '../types';

export const MainChatView: React.FC = () => {
  const { currentUser, logout, navigateTo, activeConversationId, openConversation } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConv, setLoadingConv] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    name: string;
    url: string;
    type: 'image' | 'file';
  } | null>(null);

  // Mobile navigation state
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch conversations list
  const fetchConversations = async () => {
    if (!api.getUserToken()) {
      return;
    }
    try {
      const res = await api.getConversations();
      const available = res.conversations || [];
      setConversations(available);

      // Set active conv if none selected or keep updated
      if (available.length > 0) {
        const found = available.find((c) => c.id === activeConversationId);
        if (found) {
          setActiveConv(found);
        } else {
          openConversation(available[0].id);
          setActiveConv(available[0]);
        }
      } else {
        setActiveConv(null);
      }
    } catch (e: any) {
      if (e?.status !== 401) {
        console.error('Failed to fetch conversations:', e);
      }
    }
  };

  // Fetch messages for active conversation
  const fetchActiveMessages = async (convId: string) => {
    if (!convId || !api.getUserToken()) return;
    try {
      const res = await api.getMessages(convId);
      setMessages(res.messages || []);
    } catch (e: any) {
      if (e?.status !== 401 && e?.status !== 404) {
        console.error('Failed to fetch messages:', e);
      }
    }
  };

  // Polling for real-time messages & updates every 2.5 seconds
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      if (api.getUserToken()) {
        fetchConversations();
        if (activeConversationId) {
          fetchActiveMessages(activeConversationId);
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeConversationId]);

  // When active conversation changes, load messages immediately
  useEffect(() => {
    if (activeConversationId) {
      setLoadingConv(true);
      fetchActiveMessages(activeConversationId).finally(() => setLoadingConv(false));
    }
  }, [activeConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    openConversation(conv.id);
    setActiveConv(conv);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;
    if (!activeConv) return;

    const contentToSend = inputText.trim();
    const attachmentToSend = selectedAttachment;

    // Optimistic message
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      conversationId: activeConv.id,
      senderId: currentUser?.id || 'usr-current',
      content: contentToSend,
      attachmentUrl: attachmentToSend?.url,
      attachmentName: attachmentToSend?.name,
      attachmentType: attachmentToSend?.type,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');
    setSelectedAttachment(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    try {
      const res = await api.sendMessage(activeConv.id, {
        content: contentToSend,
        attachmentUrl: attachmentToSend?.url,
        attachmentName: attachmentToSend?.name,
        attachmentType: attachmentToSend?.type,
      });
      // Replace optimistic message
      setMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? res.message : m)));
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const addEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleSimulateAttachment = (type: 'image' | 'file') => {
    if (type === 'image') {
      setSelectedAttachment({
        name: 'notes_revision_math.png',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
        type: 'image',
      });
    } else {
      setSelectedAttachment({
        name: 'Exercices_Algorithmes_S2.pdf',
        url: '#',
        type: 'file',
      });
    }
    setShowAttachmentMenu(false);
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emojisList = ['👍', '😊', '📚', '✍️', '💡', '🔥', '🎓', '✨', '🙌', '🚀', '💻', '🤝'];

  return (
    <div className="relative h-screen w-full bg-[#030712] text-white flex overflow-hidden font-sans select-none">
      {/* -------------------------------------------------------------
          LEFT DESKTOP SIDEBAR (NAVIGATION)
          ------------------------------------------------------------- */}
      <aside className="hidden md:flex flex-col items-center justify-between w-20 lg:w-64 bg-[#050A17] border-r border-[#00F0FF]/15 p-4 py-6 z-20 shrink-0">
        <div className="flex flex-col items-center lg:items-start w-full">
          {/* Logo */}
          <div className="mb-8 w-full flex justify-center lg:justify-start lg:px-2">
            <div className="hidden lg:block">
              <Logo size="sm" withText={true} glow={true} className="!items-start" />
            </div>
            <div className="lg:hidden">
              <Logo size="sm" withText={false} glow={true} />
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2 w-full">
            <button
              onClick={() => navigateTo('app-chat')}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00B2FE] text-white shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 shrink-0 text-white" />
              <span className="hidden lg:inline text-sm font-semibold tracking-wide">Discussions</span>
            </button>

            <button
              onClick={() => navigateTo('app-friends')}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-[#091326] border border-transparent hover:border-[#00F0FF]/20 transition-all cursor-pointer"
            >
              <Users className="w-5 h-5 shrink-0 text-[#00F0FF]" />
              <span className="hidden lg:inline text-sm font-medium">Amis / Étudiants</span>
            </button>

            <button
              onClick={() => navigateTo('app-settings')}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-[#091326] border border-transparent hover:border-[#00F0FF]/20 transition-all cursor-pointer"
            >
              <SettingsIcon className="w-5 h-5 shrink-0 text-[#00F0FF]" />
              <span className="hidden lg:inline text-sm font-medium">Paramètres</span>
            </button>
          </nav>
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="w-full flex flex-col gap-3 pt-4 border-t border-[#00F0FF]/15">
          <div className="flex items-center gap-3 px-2">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.name || 'Profil'}
                className="w-10 h-10 rounded-full object-cover border border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00F0FF] border-2 border-[#050A17] shadow-[0_0_6px_#00F0FF]" />
            </div>
            <div className="hidden lg:flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{currentUser?.name || 'Étudiant'}</span>
              <span className="text-[10px] text-[#00F0FF] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                En ligne
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2 rounded-xl text-[#64748B] hover:text-red-400 hover:bg-red-950/20 transition-all text-xs cursor-pointer"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* -------------------------------------------------------------
          MIDDLE COLUMN: CONVERSATION LIST (SCREEN 5)
          ------------------------------------------------------------- */}
      <section
        className={`w-full md:w-80 lg:w-96 bg-[#040814] border-r border-[#00F0FF]/15 flex flex-col h-full z-10 shrink-0 ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Top Header & Search */}
        <div className="p-4 border-b border-[#00F0FF]/15 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
              Discussions
            </h2>
            <button
              onClick={() => navigateTo('app-friends')}
              className="p-1.5 rounded-lg bg-[#0066FF]/20 hover:bg-[#0066FF]/40 border border-[#00F0FF]/30 text-[#00F0FF] transition-all cursor-pointer"
              title="Nouvelle discussion"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input matching Storyboard */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#00F0FF]/70 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un contact..."
              className="w-full bg-[#081022] border border-[#00F0FF]/20 focus:border-[#00F0FF] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#475569] outline-none transition-all focus:ring-1 focus:ring-[#00F0FF]/30"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
              <p className="text-xs text-[#64748B]">Aucune discussion trouvée.</p>
              <button
                onClick={() => navigateTo('app-friends')}
                className="mt-3 text-xs text-[#00F0FF] hover:underline cursor-pointer"
              >
                Parcourir les étudiants autorisés →
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`relative w-full p-3 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A1633] border border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,114,255,0.2)]'
                      : 'hover:bg-[#070E20] border border-transparent hover:border-[#00F0FF]/15'
                  }`}
                >
                  {/* Avatar with Online Badge */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={conv.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#00F0FF]/30"
                    />
                    {conv.otherUser.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00F0FF] border-2 border-[#040814] shadow-[0_0_8px_#00F0FF]" />
                    )}
                  </div>

                  {/* Name & Last Message Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {conv.otherUser.name}
                      </h3>
                      <span className="text-[11px] text-[#64748B] shrink-0 font-medium">
                        {conv.lastMessage?.createdAt || 'Récemment'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#94A3B8] truncate pr-2">
                        {conv.lastMessage?.content || 'Nouvelle conversation'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-[10px] font-bold text-white flex items-center justify-center shrink-0 shadow-[0_0_8px_#00F0FF]">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile Navigation bar for quick switching */}
        <div className="md:hidden flex items-center justify-around p-3 border-t border-[#00F0FF]/15 bg-[#050A17]">
          <button
            onClick={() => navigateTo('app-chat')}
            className="flex flex-col items-center text-[#00F0FF] text-[10px] gap-1"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => navigateTo('app-friends')}
            className="flex flex-col items-center text-[#64748B] hover:text-white text-[10px] gap-1"
          >
            <Users className="w-5 h-5" />
            <span>Amis</span>
          </button>
          <button
            onClick={() => navigateTo('app-settings')}
            className="flex flex-col items-center text-[#64748B] hover:text-white text-[10px] gap-1"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Paramètres</span>
          </button>
          <button
            onClick={logout}
            className="flex flex-col items-center text-[#64748B] hover:text-red-400 text-[10px] gap-1"
          >
            <LogOut className="w-5 h-5" />
            <span>Sortir</span>
          </button>
        </div>
      </section>

      {/* -------------------------------------------------------------
          RIGHT COLUMN: ACTIVE CHAT CONVERSATION (SCREEN 5)
          ------------------------------------------------------------- */}
      <main
        className={`flex-1 flex flex-col h-full bg-[#02050E] relative z-0 ${
          showMobileChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConv ? (
          <>
            {/* Active Chat Header */}
            <div className="h-16 px-4 md:px-6 bg-[#040917]/90 border-b border-[#00F0FF]/15 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-2 rounded-xl text-[#00F0FF] hover:bg-[#00F0FF]/10 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Avatar with Status */}
                <div className="relative">
                  <img
                    src={activeConv.otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={activeConv.otherUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.25)]"
                  />
                  {activeConv.otherUser.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00F0FF] border-2 border-[#040917] shadow-[0_0_6px_#00F0FF]" />
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    {activeConv.otherUser.name}
                  </h2>
                  <p className="text-[11px] text-[#00F0FF] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                    {activeConv.otherUser.isOnline ? 'En ligne' : `Vu ${activeConv.otherUser.lastSeen}`}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('app-friends')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081329] border border-[#00F0FF]/25 hover:border-[#00F0FF] text-xs text-[#00F0FF] transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Voir le profil</span>
                </button>
                <button
                  onClick={() => alert('Options de la conversation : Zenin Chatt v1.0.0')}
                  className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#081329] transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {/* Security info banner */}
              <div className="flex justify-center my-2">
                <div className="px-3.5 py-1.5 rounded-full bg-[#081329]/80 border border-[#00F0FF]/20 text-[11px] text-[#38BDF8] flex items-center gap-2 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                  Discussion privée d'étude protégée et chiffrée
                </div>
              </div>

              {loadingConv ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id || msg.senderId === 'usr-current';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`relative max-w-[85%] sm:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? 'bg-gradient-to-r from-[#0066FF] to-[#00A6FF] text-white shadow-[0_4px_16px_rgba(0,114,255,0.3)] rounded-tr-xs'
                            : 'bg-[#091224] border border-[#00F0FF]/20 text-white rounded-tl-xs shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                        }`}
                      >
                        {/* Image attachment if any */}
                        {msg.attachmentUrl && msg.attachmentType === 'image' && (
                          <div className="mb-2 rounded-xl overflow-hidden border border-[#00F0FF]/30">
                            <img
                              src={msg.attachmentUrl}
                              alt="Fichier attaché"
                              className="w-full max-h-56 object-cover"
                            />
                          </div>
                        )}

                        {/* File attachment preview */}
                        {msg.attachmentUrl && msg.attachmentType === 'file' && (
                          <div className="mb-2 p-2.5 rounded-xl bg-black/30 border border-white/20 flex items-center gap-2.5 text-xs">
                            <FileText className="w-4 h-4 text-[#00F0FF]" />
                            <span className="truncate font-medium">{msg.attachmentName || 'Document'}</span>
                          </div>
                        )}

                        {/* Message content */}
                        <p className="break-words select-text">{msg.content}</p>

                        {/* Time & Read Check */}
                        <div
                          className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                            isMine ? 'text-white/80' : 'text-[#64748B]'
                          }`}
                        >
                          <span>{msg.createdAt}</span>
                          {isMine && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Attachment Preview Box */}
            {selectedAttachment && (
              <div className="px-4 py-2 bg-[#091226] border-t border-[#00F0FF]/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#00F0FF]">
                  {selectedAttachment.type === 'image' ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span className="font-medium truncate max-w-xs">{selectedAttachment.name}</span>
                </div>
                <button
                  onClick={() => setSelectedAttachment(null)}
                  className="p-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Message Input Bar (Storyboard #5) */}
            <div className="p-3 md:p-4 bg-[#040917]/90 border-t border-[#00F0FF]/15 relative">
              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-18 left-4 z-30 p-3 bg-[#070E20] border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.25)] flex flex-wrap gap-2 max-w-[240px]">
                  {emojisList.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => addEmoji(em)}
                      className="text-xl p-1.5 hover:bg-[#00F0FF]/20 rounded-xl transition-all cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              {/* Attachment Picker Popover */}
              {showAttachmentMenu && (
                <div className="absolute bottom-18 left-12 z-30 p-2 bg-[#070E20] border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.25)] flex flex-col gap-1 min-w-[180px]">
                  <button
                    type="button"
                    onClick={() => handleSimulateAttachment('image')}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#00F0FF]/20 rounded-xl transition-all cursor-pointer text-left"
                  >
                    <ImageIcon className="w-4 h-4 text-[#00F0FF]" />
                    <span>Envoyer une image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateAttachment('file')}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#00F0FF]/20 rounded-xl transition-all cursor-pointer text-left"
                  >
                    <FileText className="w-4 h-4 text-[#00F0FF]" />
                    <span>Envoyer un document (PDF)</span>
                  </button>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 relative flex items-center bg-[#070F22] border border-[#00F0FF]/25 focus-within:border-[#00F0FF] rounded-2xl px-3 py-1.5 transition-all focus-within:ring-2 focus-within:ring-[#00F0FF]/20">
                  {/* Action buttons inside input */}
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachmentMenu(!showAttachmentMenu);
                        setShowEmojiPicker(false);
                      }}
                      className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors cursor-pointer"
                      title="Joindre un fichier"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowAttachmentMenu(false);
                      }}
                      className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors cursor-pointer"
                      title="Emojis"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Écrivez un message..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-[#475569] outline-none py-1.5"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedAttachment}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] hover:from-[#0052D4] hover:to-[#00D4FF] text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_18px_rgba(0,240,255,0.35)] hover:shadow-[0_0_24px_rgba(0,240,255,0.5)] cursor-pointer disabled:opacity-40 shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Logo size="md" withText={false} glow={true} className="mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Sélectionnez une discussion</h3>
            <p className="text-xs text-[#94A3B8] max-w-xs">
              Choisissez un camarade d'étude dans la liste de gauche pour échanger vos révisions.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
