import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Users, 
  Mail, 
  Clock, 
  MoreVertical, 
  Crown, 
  Send, 
  RefreshCw,
  X,
  UserPlus,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Member {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
}

interface Invite {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invited_by_name: string;
  invited_at: string;
  status: 'pending' | 'active' | 'inactive';
}

export const TeamManagementModal: React.FC<TeamManagementModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user, company, userRole } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'members' | 'pending' | 'invite'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const isOwner = userRole?.role === 'owner';

  const fetchMembers = async () => {
    if (!company) return;
    setLoading(true);

    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at')
        .eq('company_id', company.id);

      if (error) throw error;

      // Fetch profiles for each user
      const membersList: Member[] = [];
      for (const role of roleData || []) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', role.user_id)
          .maybeSingle();

        if (profileData) {
          membersList.push({
            id: role.user_id,
            user_id: role.user_id,
            email: profileData.email,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            role: role.role as Member['role'],
            joined_at: role.created_at,
          });
        }
      }

      setMembers(membersList);
    } catch (error) {
      console.error('Error fetching members:', error);
    }

    setLoading(false);
  };

  const fetchInvites = async () => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from('company_members')
        .select('*')
        .eq('company_id', company.id)
        .eq('status', 'pending');

      if (error) throw error;

      setInvites((data || []).map(invite => ({
        id: invite.id,
        email: invite.email,
        role: invite.role as Invite['role'],
        invited_by_name: 'Você',
        invited_at: invite.invited_at,
        status: invite.status as Invite['status'],
      })));
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  useEffect(() => {
    if (open && company) {
      fetchMembers();
      fetchInvites();
    }
  }, [open, company]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !user) return;

    setInviteLoading(true);

    try {
      const { error } = await supabase
        .from('company_members')
        .insert({
          company_id: company.id,
          email: inviteEmail,
          role: inviteRole,
          invited_by: user.id,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Convite enviado!',
        description: `Um convite foi enviado para ${inviteEmail}`,
      });

      setInviteEmail('');
      setInviteMessage('');
      setInviteRole('member');
      fetchInvites();
      setActiveTab('pending');
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar convite',
        description: error.message,
        variant: 'destructive',
      });
    }

    setInviteLoading(false);
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('company_members')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      toast({
        title: 'Convite cancelado',
        description: 'O convite foi removido.',
      });

      fetchInvites();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!company) return;

    try {
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', company.id);

      await supabase
        .from('profiles')
        .update({ company_id: null })
        .eq('user_id', userId);

      toast({
        title: 'Membro removido',
        description: 'O membro foi removido da equipe.',
      });

      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleChangeRole = async (userId: string, newRole: Member['role']) => {
    if (!company) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId)
        .eq('company_id', company.id);

      if (error) throw error;

      toast({
        title: 'Função atualizada',
        description: 'A função do membro foi alterada.',
      });

      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Proprietário',
      admin: 'Admin',
      member: 'Membro',
      viewer: 'Visualizador',
    };
    return labels[role] || role;
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const tabs = [
    { id: 'members', label: 'Membros Ativos', count: members.length },
    { id: 'pending', label: 'Convites Pendentes', count: invites.length },
    { id: 'invite', label: 'Convidar Novo' },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[800px] max-h-[600px] p-0 bg-transparent border-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(24,24,27,0.98), rgba(18,18,20,0.95))',
          border: '2px solid rgba(0,255,148,0.2)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <DialogHeader className="p-8 pb-6 border-b border-zinc-800">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <Users className="w-7 h-7 text-[#00FF94]" />
            Gerenciar Equipe
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-1">
            Convide colaboradores para acessar seus prompts
          </p>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-8 border-b border-zinc-800">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-4 font-medium text-sm transition-all border-b-[3px] border-transparent",
                  activeTab === tab.id 
                    ? "text-white border-[#00FF94]" 
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                {tab.label}
                {'count' in tab && tab.count > 0 && (
                  <span 
                    className={cn(
                      "ml-2 px-2 py-0.5 rounded-full text-xs",
                      activeTab === tab.id 
                        ? "bg-[#00FF94]/20 text-[#00FF94]" 
                        : "bg-zinc-700 text-gray-300"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
          {/* Members tab */}
          {activeTab === 'members' && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-[#00FF94] animate-spin" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum membro na equipe</p>
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-xl transition-all",
                      "bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: member.avatar_url 
                            ? `url(${member.avatar_url}) center/cover`
                            : 'linear-gradient(135deg, #00FF94, #00D97E)',
                        }}
                      >
                        {!member.avatar_url && (
                          <span className="text-black">{getInitials(member.full_name)}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {member.role === 'owner' && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                          <p className="text-white font-semibold">
                            {member.full_name || 'Sem nome'}
                          </p>
                        </div>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          Entrou em {formatDate(member.joined_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Role selector/badge */}
                      {member.role === 'owner' ? (
                        <span 
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: 'rgba(234,179,8,0.2)',
                            color: '#EAB308',
                          }}
                        >
                          Proprietário
                        </span>
                      ) : isOwner ? (
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleChangeRole(member.user_id, value as Member['role'])}
                        >
                          <SelectTrigger className="w-[130px] bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Membro</SelectItem>
                            <SelectItem value="viewer">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span 
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: 'rgba(0,255,148,0.2)',
                            color: '#00FF94',
                          }}
                        >
                          {getRoleLabel(member.role)}
                        </span>
                      )}

                      {/* Actions menu */}
                      {isOwner && member.role !== 'owner' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end"
                            className="bg-zinc-800 border-zinc-700"
                          >
                            <DropdownMenuItem 
                              onClick={() => handleRemoveMember(member.user_id)}
                              className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                            >
                              Remover da equipe
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pending invites tab */}
          {activeTab === 'pending' && (
            <div className="space-y-3">
              {invites.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum convite pendente</p>
                </div>
              ) : (
                invites.map((invite) => (
                  <div
                    key={invite.id}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-xl transition-all",
                      "bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{invite.email}</p>
                        <p className="text-gray-500 text-sm">
                          Convidado por {invite.invited_by_name} • {formatDate(invite.invited_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400"
                      >
                        Pendente
                      </span>
                      <button
                        onClick={() => handleCancelInvite(invite.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Invite new tab */}
          {activeTab === 'invite' && (
            <form onSubmit={handleSendInvite} className="space-y-6">
              <AuthInput
                label="E-mail do colaborador *"
                type="email"
                icon={Mail}
                placeholder="colaborador@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <p className="text-gray-500 text-xs -mt-4">
                Você pode convidar vários separando por vírgula
              </p>

              <div className="space-y-2">
                <label className="block text-white font-semibold text-sm">
                  Função *
                </label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as typeof inviteRole)}>
                  <SelectTrigger className="w-full bg-black/40 border-2 border-zinc-700/60 rounded-xl text-white py-3.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="admin" className="py-3">
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-gray-400 text-xs">Pode gerenciar equipe e todos os prompts</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="member" className="py-3">
                      <div>
                        <p className="font-medium">Membro</p>
                        <p className="text-gray-400 text-xs">Pode criar e editar prompts</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer" className="py-3">
                      <div>
                        <p className="font-medium">Visualizador</p>
                        <p className="text-gray-400 text-xs">Apenas visualizar prompts</p>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-white font-semibold text-sm">
                  Mensagem de convite (opcional)
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Olá! Convido você para colaborar..."
                  className={cn(
                    "w-full bg-black/40 border-2 border-zinc-700/60 rounded-xl text-gray-200 text-base placeholder:text-gray-500 transition-all duration-300 min-h-[100px] p-4",
                    "focus:outline-none focus:border-[#00FF94] focus:ring-4 focus:ring-[#00FF94]/20"
                  )}
                />
              </div>

              <AuthButton 
                type="submit" 
                loading={inviteLoading}
                loadingText="Enviando..."
                className="mt-4"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Convite
              </AuthButton>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
