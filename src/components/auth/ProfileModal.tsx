import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  User, 
  Camera, 
  Lock, 
  Globe, 
  Bell, 
  Shield, 
  Save,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState(profile?.full_name || '');

  const handleSaveProfile = async () => {
    setLoading(true);

    const { error } = await updateProfile({
      full_name: fullName,
    });

    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas alterações foram salvas.',
      });
    }

    setLoading(false);
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

  const formatDate = (date: string | undefined | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'preferences', label: 'Preferências', icon: Bell },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[700px] max-h-[600px] p-0 bg-transparent border-0 overflow-hidden"
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
            <User className="w-7 h-7 text-[#00FF94]" />
            Meu Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-[200px] border-r border-zinc-800 p-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all mb-1",
                  activeSection === section.id
                    ? "bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/30"
                    : "text-gray-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-[450px] overflow-y-auto custom-scrollbar">
            {activeSection === 'profile' && (
              <div className="space-y-8">
                {/* Avatar section */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div 
                      className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold"
                      style={{
                        background: profile?.avatar_url 
                          ? `url(${profile.avatar_url}) center/cover`
                          : 'linear-gradient(135deg, #00FF94, #00D97E)',
                        border: '4px solid #00FF94',
                        boxShadow: '0 8px 32px rgba(0,255,148,0.3)',
                      }}
                    >
                      {!profile?.avatar_url && (
                        <span className="text-black">
                          {getInitials(profile?.full_name)}
                        </span>
                      )}
                    </div>
                    <button 
                      className={cn(
                        "absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center",
                        "bg-zinc-800 border-2 border-zinc-700 hover:border-[#00FF94] transition-colors"
                      )}
                    >
                      <Camera className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <button className="mt-3 text-[#00FF94] text-sm hover:underline">
                    Trocar foto
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-5">
                  <AuthInput
                    label="Nome Completo"
                    type="text"
                    icon={User}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <div className="space-y-2">
                    <label className="block text-white font-semibold text-sm">
                      E-mail
                    </label>
                    <div className="w-full bg-zinc-800/60 border-2 border-zinc-700/60 rounded-xl text-gray-400 py-3.5 px-4">
                      {profile?.email}
                    </div>
                    <p className="text-gray-500 text-xs">
                      O e-mail não pode ser alterado
                    </p>
                  </div>
                </div>

                {/* Account info */}
                <div className="bg-zinc-800/40 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Conta criada em</span>
                    <span className="text-white">{formatDate(profile?.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Último login</span>
                    <span className="text-white">{formatDate(profile?.last_login)}</span>
                  </div>
                </div>

                {/* Save button */}
                <AuthButton onClick={handleSaveProfile} loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </AuthButton>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Senha</h3>
                  <button 
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl transition-all",
                      "bg-zinc-800/40 border border-zinc-700 hover:border-zinc-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Alterar senha</p>
                        <p className="text-gray-500 text-sm">Última alteração: nunca</p>
                      </div>
                    </div>
                    <span className="text-[#00FF94] text-sm">Alterar</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Autenticação em dois fatores</h3>
                  <div 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl",
                      "bg-zinc-800/40 border border-zinc-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">2FA</p>
                        <p className="text-gray-500 text-sm">Adicione uma camada extra de segurança</p>
                      </div>
                    </div>
                    <span className="text-yellow-400 text-sm">Em breve</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Idioma e Região</h3>
                  <div 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl",
                      "bg-zinc-800/40 border border-zinc-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Português (Brasil)</p>
                        <p className="text-gray-500 text-sm">Fuso horário: Brasília</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Notificações por E-mail</h3>
                  
                  {[
                    { label: 'Novos convites de equipe', enabled: true },
                    { label: 'Atividade nos seus prompts', enabled: true },
                    { label: 'Atualizações do sistema', enabled: false },
                  ].map((pref, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl",
                        "bg-zinc-800/40 border border-zinc-700"
                      )}
                    >
                      <span className="text-white">{pref.label}</span>
                      <div 
                        className={cn(
                          "w-12 h-6 rounded-full relative cursor-pointer transition-all",
                          pref.enabled 
                            ? "bg-gradient-to-r from-[#00FF94] to-[#00D97E]" 
                            : "bg-zinc-700"
                        )}
                      >
                        <div 
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            pref.enabled ? "right-1" : "left-1"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
