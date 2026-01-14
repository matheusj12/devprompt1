import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  User, 
  Settings, 
  Users, 
  CreditCard, 
  LogOut,
  Building2,
  Crown,
  Menu,
  X,
  Plus,
  Check,
  HelpCircle,
  BookOpen,
  Command,
  Moon,
  Sun,
  BellOff,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { TeamManagementModal } from '@/components/auth/TeamManagementModal';
import { ProfileModal } from '@/components/auth/ProfileModal';
import { cn } from '@/lib/utils';

interface AuthHeaderProps {
  currentFolderName?: string;
  showBreadcrumb?: boolean;
  onNewPrompt?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  currentFolderName,
  showBreadcrumb = false,
  onNewPrompt,
}) => {
  const { user, profile, company, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const [darkMode, setDarkMode] = useState(true);

  // Mock notifications for demo
  const [notifications] = useState([
    {
      id: '1',
      type: 'invite',
      title: 'Novo membro na equipe',
      message: 'João Silva aceitou o convite para a equipe',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'prompt',
      title: 'Prompt atualizado',
      message: 'O prompt "Assistente de Vendas" foi modificado',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'system',
      title: 'Nova funcionalidade',
      message: 'Agora você pode organizar prompts com drag & drop!',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
    },
  ]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNewPrompt = () => {
    if (onNewPrompt) {
      onNewPrompt();
    } else {
      navigate('/');
    }
  };

  const getRoleBadge = (role: string | undefined) => {
    const labels: Record<string, string> = {
      owner: 'Owner',
      admin: 'Admin',
      member: 'Membro',
      viewer: 'Viewer',
    };
    return labels[role || 'member'] || 'Membro';
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invite':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'prompt':
        return <Sparkles className="w-4 h-4 text-[#00FF94]" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  const isOwnerOrAdmin = userRole?.role === 'owner' || userRole?.role === 'admin';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header 
        className="h-[72px] sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: 'rgba(24,24,27,0.95)',
          borderBottom: '1px solid rgba(0,255,148,0.1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        <div className="h-full w-full px-4 md:px-8 flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                style={{
                  background: 'rgba(0,255,148,0.1)',
                  boxShadow: '0 0 20px rgba(0,255,148,0.2)',
                }}
              >
                <Sparkles className="w-5 h-5 text-[#00FF94]" />
              </div>
              <span 
                className="text-xl font-bold hidden sm:block"
                style={{
                  background: 'linear-gradient(135deg, #00FF94, #00D97E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                DEV PROMPTS
              </span>
            </Link>

            {/* Breadcrumb */}
            {showBreadcrumb && currentFolderName && (
              <div className="hidden sm:flex items-center gap-2 text-gray-400 text-sm">
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-500">Pastas de Clientes</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">{currentFolderName}</span>
              </div>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {/* New Prompt Button */}
            <button
              onClick={handleNewPrompt}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-black transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
                boxShadow: '0 4px 12px rgba(0,255,148,0.3)',
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Novo Prompt</span>
            </button>

            {/* Company dropdown (if user has company) */}
            {company && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all min-w-[180px] max-w-[220px]",
                      "bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/60 hover:border-[#00FF94]/30"
                    )}
                  >
                    {company.logo_url ? (
                      <img 
                        src={company.logo_url} 
                        alt={company.name} 
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,255,148,0.2), rgba(0,255,148,0.1))',
                        }}
                      >
                        <Building2 className="w-4 h-4 text-[#00FF94]" />
                      </div>
                    )}
                    <span className="text-white text-sm font-medium truncate flex-1 text-left">
                      {company.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-[280px] bg-zinc-900/95 backdrop-blur-xl border-2 border-zinc-700 rounded-xl p-2"
                  style={{
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                  }}
                >
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Suas empresas
                    </span>
                  </div>
                  <div className="py-2">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-[#00FF94]/10 border border-[#00FF94]/30"
                    >
                      {company.logo_url ? (
                        <img 
                          src={company.logo_url} 
                          alt={company.name} 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #00FF94, #00D97E)',
                          }}
                        >
                          <Building2 className="w-5 h-5 text-black" />
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <span className="text-white font-medium block">{company.name}</span>
                        <span className="text-gray-400 text-xs">1 membro</span>
                      </div>
                      <Check className="w-5 h-5 text-[#00FF94]" />
                    </button>
                  </div>
                  <div className="h-px bg-zinc-800 my-2" />
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all border border-dashed border-[#00FF94]/30 hover:bg-[#00FF94]/5 hover:border-solid"
                  >
                    <Plus className="w-4 h-4 text-[#00FF94]" />
                    <span className="text-[#00FF94] text-sm font-medium">Criar nova empresa</span>
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    "bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/60 hover:border-[#00FF94]/30"
                  )}
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  {unreadCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-pulse"
                      style={{
                        boxShadow: '0 0 0 2px rgba(24,24,27,1)',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-[380px] bg-zinc-900/95 backdrop-blur-xl border-2 border-zinc-700 rounded-xl overflow-hidden p-0"
                style={{
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                  maxHeight: '500px',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                  <span className="text-white font-bold text-lg">Notificações</span>
                  <button className="text-[#00FF94] text-sm font-medium hover:underline">
                    Marcar todas como lidas
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all hover:bg-zinc-800/50",
                          !notification.read && "bg-zinc-800/30"
                        )}
                      >
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(39,39,42,0.8)' }}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{notification.title}</p>
                          <p className="text-gray-400 text-sm truncate">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-1">{formatTimeAgo(notification.created_at)}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-[#00FF94] flex-shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-16 px-5 text-center">
                      <BellOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">Nenhuma notificação</p>
                      <p className="text-gray-500 text-sm">Você está em dia!</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 text-center">
                  <button className="text-[#00FF94] text-sm font-medium hover:underline">
                    Ver todas as notificações
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all",
                    "bg-zinc-800/60 border-2 border-transparent hover:border-[#00FF94]/30"
                  )}
                >
                  {/* Avatar */}
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: profile?.avatar_url 
                        ? `url(${profile.avatar_url}) center/cover`
                        : 'linear-gradient(135deg, #00FF94, #00D97E)',
                      border: '2px solid #00FF94',
                    }}
                  >
                    {!profile?.avatar_url && (
                      <span className="text-black">
                        {getInitials(profile?.full_name)}
                      </span>
                    )}
                  </div>
                  
                  {/* Name and role */}
                  <div className="hidden sm:block text-left">
                    <p className="text-white text-sm font-medium max-w-[120px] truncate">
                      {profile?.full_name || 'Usuário'}
                    </p>
                    <span 
                      className="text-[#00FF94] text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-semibold uppercase tracking-wide"
                      style={{
                        background: 'rgba(0,255,148,0.15)',
                        border: '1px solid rgba(0,255,148,0.3)',
                      }}
                    >
                      {userRole?.role === 'owner' && <Crown className="w-3 h-3" />}
                      {getRoleBadge(userRole?.role)}
                    </span>
                  </div>
                  
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                align="end" 
                className="w-[280px] bg-zinc-900/95 backdrop-blur-xl border-2 border-zinc-700 rounded-xl p-3"
                style={{
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                }}
              >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                      style={{
                        background: profile?.avatar_url 
                          ? `url(${profile.avatar_url}) center/cover`
                          : 'linear-gradient(135deg, #00FF94, #00D97E)',
                        border: '2px solid #00FF94',
                      }}
                    >
                      {!profile?.avatar_url && (
                        <span className="text-black">
                          {getInitials(profile?.full_name)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">
                        {profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {profile?.email}
                      </p>
                      <span 
                        className="text-[#00FF94] text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1 font-semibold uppercase"
                        style={{
                          background: 'rgba(0,255,148,0.2)',
                        }}
                      >
                        {userRole?.role === 'owner' && <Crown className="w-3 h-3" />}
                        {getRoleBadge(userRole?.role)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <DropdownMenuItem 
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-zinc-800"
                  >
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200">Meu Perfil</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-zinc-800"
                  >
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200">Configurações</span>
                  </DropdownMenuItem>

                  {isOwnerOrAdmin && (
                    <DropdownMenuItem 
                      onClick={() => setShowTeamModal(true)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-zinc-800"
                    >
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <span className="text-gray-200">Gerenciar Equipe</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-gray-400 text-xs">1</span>
                    </DropdownMenuItem>
                  )}

                  {userRole?.role === 'owner' && (
                    <DropdownMenuItem 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-zinc-800"
                    >
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <span className="text-gray-200 block">Plano e Cobrança</span>
                        <span className="text-gray-500 text-xs">{company?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</span>
                      </div>
                    </DropdownMenuItem>
                  )}
                </div>

                <DropdownMenuSeparator className="bg-zinc-800" />

                <div className="py-2">
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-zinc-800">
                    <div className="flex items-center gap-3">
                      {darkMode ? (
                        <Moon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-gray-200">Modo Escuro</span>
                    </div>
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={setDarkMode}
                      className="data-[state=checked]:bg-[#00FF94]"
                    />
                  </div>

                  <DropdownMenuItem 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-zinc-800"
                  >
                    <Command className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200 flex-1">Atalhos</span>
                    <span className="text-gray-500 text-xs bg-zinc-800 px-2 py-0.5 rounded">⌘K</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-zinc-800" />

                <div className="py-2">
                  <DropdownMenuItem 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-zinc-800"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200">Ajuda</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-zinc-800"
                  >
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200 flex-1">Documentação</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#00FF94]/20 text-[#00FF94] text-[10px] font-semibold">Novo</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-zinc-800" />

                <div className="py-2">
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-red-500/10 text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sair da conta</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/60"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-[300px] p-6"
            style={{
              background: 'linear-gradient(180deg, rgba(24,24,27,0.98) 0%, rgba(18,18,20,0.99) 100%)',
              borderLeft: '1px solid rgba(0,255,148,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-white font-bold text-lg">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Mobile navigation items */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  handleNewPrompt();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-black"
                style={{
                  background: 'linear-gradient(135deg, #00FF94, #00D97E)',
                }}
              >
                <Plus className="w-5 h-5" />
                Novo Prompt
              </button>

              <button
                onClick={() => {
                  navigate('/meus-prompts');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-zinc-800"
              >
                <BookOpen className="w-5 h-5" />
                Meus Prompts
              </button>

              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-zinc-800"
              >
                <User className="w-5 h-5" />
                Meu Perfil
              </button>

              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TeamManagementModal 
        open={showTeamModal} 
        onOpenChange={setShowTeamModal} 
      />
      <ProfileModal 
        open={showProfileModal} 
        onOpenChange={setShowProfileModal} 
      />
    </>
  );
};
