import { useProject } from '@/contexts/ProjectContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Calendar, UserRound, CreditCard, FileText, MessageCircle, Sparkles } from 'lucide-react';

interface AdvancedResource {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
  icon: React.ElementType;
}

const ADVANCED_RESOURCES: AdvancedResource[] = [
  {
    id: 'agendamento',
    name: 'Sistema de Agendamento',
    description: 'Permite ao assistente buscar horários, criar, atualizar e cancelar agendamentos',
    toolIds: ['buscar_janelas', 'criar_agendamento', 'buscar_agendamentos', 'atualizar_agendamento', 'cancelar_agendamento'],
    icon: Calendar,
  },
  {
    id: 'transferencia',
    name: 'Transferência para Humano',
    description: 'Permite escalar atendimento quando necessário',
    toolIds: ['escalar_humano', 'notificar_transferencia'],
    icon: UserRound,
  },
  {
    id: 'cobrancas',
    name: 'Geração de Cobranças',
    description: 'Cria e gerencia links de pagamento',
    toolIds: ['criar_cobranca'],
    icon: CreditCard,
  },
  {
    id: 'arquivos',
    name: 'Acesso a Arquivos',
    description: 'Lista e envia documentos ao cliente',
    toolIds: ['listar_arquivos', 'baixar_arquivo'],
    icon: FileText,
  },
  {
    id: 'comunicacao',
    name: 'Preferências de Comunicação',
    description: 'Altera preferências entre áudio e texto',
    toolIds: ['alterar_preferencia'],
    icon: MessageCircle,
  },
];

const BASIC_RESOURCES = [
  { name: 'Análise e reflexão interna', description: 'O assistente analisa a situação antes de responder' },
  { name: 'Reações limitadas (emojis)', description: 'Pode reagir com emojis às mensagens' },
  { name: 'Envio de links/contatos separados', description: 'Envia informações importantes em mensagens separadas' },
];

const ToolsForm = () => {
  const { project, updateTools } = useProject();

  if (!project) return null;

  const { tools } = project;

  const isResourceEnabled = (resource: AdvancedResource): boolean => {
    return resource.toolIds.every((toolId) => 
      tools.tools.find((t) => t.id === toolId)?.enabled
    );
  };

  const toggleResource = (resource: AdvancedResource, enabled: boolean) => {
    const newTools = tools.tools.map((t) => {
      if (resource.toolIds.includes(t.id)) {
        return { ...t, enabled };
      }
      return t;
    });
    updateTools('tools', newTools);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 70%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ferramentas Disponíveis
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Personalize as capacidades do seu assistente com recursos poderosos
        </p>
      </div>

      {/* Basic Resources - Always Included */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsla(var(--primary), 0.3) 0%, hsla(var(--primary), 0.1) 100%)',
                boxShadow: '0 0 20px hsla(var(--primary), 0.2)',
              }}
            >
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Recursos Básicos</h2>
              <p className="text-sm text-muted-foreground">Funcionalidades essenciais</p>
            </div>
          </div>
          <span 
            className="px-3 py-1 text-xs font-semibold rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsla(var(--primary), 0.2) 0%, hsla(var(--primary), 0.1) 100%)',
              color: 'hsl(var(--primary))',
              border: '1px solid hsla(var(--primary), 0.3)',
            }}
          >
            Sempre Incluído
          </span>
        </div>

        <div className="grid gap-4">
          {BASIC_RESOURCES.map((resource, index) => (
            <div
              key={resource.name}
              className="group relative p-5 rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.08) 0%, rgba(0, 255, 148, 0.02) 100%)',
                border: '1px solid rgba(0, 255, 148, 0.25)',
                backdropFilter: 'blur(10px)',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
                    boxShadow: '0 0 15px hsla(var(--primary), 0.5)',
                  }}
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{resource.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span 
            className="px-4 py-1 text-xs font-medium rounded-full bg-background"
            style={{
              border: '1px solid hsla(var(--border), 0.5)',
              color: 'hsl(var(--muted-foreground))',
            }}
          >
            Personalize seu assistente
          </span>
        </div>
      </div>

      {/* Advanced Resources - Optional */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(100, 100, 100, 0.3) 0%, rgba(100, 100, 100, 0.1) 100%)',
                border: '1px solid rgba(100, 100, 100, 0.3)',
              }}
            >
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Recursos Avançados</h2>
              <p className="text-sm text-muted-foreground">Adicione funcionalidades extras</p>
            </div>
          </div>
          <span 
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              background: 'rgba(100, 100, 100, 0.2)',
              color: 'hsl(var(--muted-foreground))',
              border: '1px solid rgba(100, 100, 100, 0.3)',
            }}
          >
            Opcional
          </span>
        </div>

        <div className="grid gap-4">
          {ADVANCED_RESOURCES.map((resource, index) => {
            const isEnabled = isResourceEnabled(resource);
            const IconComponent = resource.icon;
            
            return (
              <label
                key={resource.id}
                className="group relative block cursor-pointer transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div 
                  className="p-5 rounded-xl transition-all duration-300"
                  style={{
                    background: isEnabled 
                      ? 'linear-gradient(135deg, rgba(0, 255, 148, 0.12) 0%, rgba(0, 255, 148, 0.04) 100%)'
                      : 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.6) 100%)',
                    border: isEnabled 
                      ? '2px solid rgba(0, 255, 148, 0.5)' 
                      : '1px solid rgba(60, 60, 60, 0.5)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isEnabled 
                      ? '0 0 30px rgba(0, 255, 148, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                    transform: isEnabled ? 'scale(1.01)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isEnabled) {
                      e.currentTarget.style.border = '1px solid rgba(0, 255, 148, 0.3)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 148, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isEnabled) {
                      e.currentTarget.style.border = '1px solid rgba(60, 60, 60, 0.5)';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.03)';
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Custom Checkbox */}
                    <div className="relative mt-0.5">
                      <Checkbox
                        checked={isEnabled}
                        onCheckedChange={(checked) => toggleResource(resource, checked as boolean)}
                        className="sr-only"
                      />
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300"
                        style={{
                          background: isEnabled 
                            ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)'
                            : 'rgba(60, 60, 60, 0.5)',
                          border: isEnabled 
                            ? 'none' 
                            : '2px solid rgba(100, 100, 100, 0.5)',
                          boxShadow: isEnabled 
                            ? '0 0 15px hsla(var(--primary), 0.5)' 
                            : 'none',
                        }}
                      >
                        {isEnabled && (
                          <Check className="w-4 h-4 text-primary-foreground animate-scale-in" />
                        )}
                      </div>
                    </div>

                    {/* Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{
                        background: isEnabled 
                          ? 'linear-gradient(135deg, hsla(var(--primary), 0.25) 0%, hsla(var(--primary), 0.1) 100%)'
                          : 'rgba(60, 60, 60, 0.3)',
                        border: isEnabled 
                          ? '1px solid hsla(var(--primary), 0.3)' 
                          : '1px solid rgba(80, 80, 80, 0.3)',
                      }}
                    >
                      <IconComponent 
                        className="w-6 h-6 transition-colors duration-300" 
                        style={{
                          color: isEnabled ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p 
                          className="font-semibold transition-colors duration-300"
                          style={{
                            color: isEnabled ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                          }}
                        >
                          {resource.name}
                        </p>
                        {isEnabled && (
                          <span 
                            className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide animate-fade-in"
                            style={{
                              background: 'hsla(var(--primary), 0.2)',
                              color: 'hsl(var(--primary))',
                            }}
                          >
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Footer Info */}
      <div 
        className="p-4 rounded-xl text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.5) 0%, rgba(20, 20, 20, 0.3) 100%)',
          border: '1px solid rgba(60, 60, 60, 0.3)',
        }}
      >
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-medium">Dica:</span> Você pode alterar essas configurações a qualquer momento editando seu prompt.
        </p>
      </div>
    </div>
  );
};

export default ToolsForm;
