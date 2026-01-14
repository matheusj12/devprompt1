import { useProject } from '@/contexts/ProjectContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, MessageSquare, AlertTriangle, Settings, Check, Shield } from 'lucide-react';
import { generateId } from '@/lib/storage';

const MESSAGE_FORMATTING_OPTIONS = [
  'Máximo 3-4 linhas por mensagem',
  'Máximo 1-2 perguntas por vez',
  'Evitar uso excessivo de markdown',
  'Consolidar informações relacionadas',
];

const RulesForm = () => {
  const { project, updateRules } = useProject();

  if (!project) return null;

  const { rules } = project;

  // Message Formatting
  const toggleFormatting = (option: string, checked: boolean) => {
    const newFormatting = checked
      ? [...rules.messageFormatting, option]
      : rules.messageFormatting.filter((f) => f !== option);
    updateRules('messageFormatting', newFormatting);
  };

  // Business Rules
  const addBusinessRule = () => {
    updateRules('businessRules', [
      ...rules.businessRules,
      { id: generateId(), text: '' },
    ]);
  };

  const updateBusinessRule = (id: string, text: string) => {
    const newRules = rules.businessRules.map((r) =>
      r.id === id ? { ...r, text } : r
    );
    updateRules('businessRules', newRules);
  };

  const removeBusinessRule = (id: string) => {
    updateRules(
      'businessRules',
      rules.businessRules.filter((r) => r.id !== id)
    );
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 70%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Regras e Validações
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Defina limites e diretrizes para garantir respostas consistentes e seguras
        </p>
      </div>

      {/* Section 1: Communication Rules */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
              boxShadow: '0 0 25px hsla(var(--primary), 0.4)',
            }}
          >
            <span className="text-primary-foreground font-bold text-lg">1</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <h2 
                className="text-xl font-bold"
                style={{ color: 'hsl(var(--primary))' }}
              >
                Regras de Comunicação
              </h2>
              <p className="text-sm text-muted-foreground">Como o assistente deve formatar suas respostas</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold text-foreground block">
            Formatação de Mensagens
          </Label>
          <div className="grid gap-3">
            {MESSAGE_FORMATTING_OPTIONS.map((option, index) => {
              const isChecked = rules.messageFormatting.includes(option);
              return (
                <label
                  key={option}
                  className="group relative block cursor-pointer transition-all duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div 
                    className="flex items-center gap-4 p-5 rounded-xl transition-all duration-300"
                    style={{
                      background: isChecked 
                        ? 'linear-gradient(135deg, rgba(0, 255, 148, 0.1) 0%, transparent 100%)'
                        : 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 100%)',
                      border: isChecked 
                        ? '2px solid rgba(0, 255, 148, 0.4)' 
                        : '1px solid rgba(60, 60, 60, 0.5)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: isChecked 
                        ? '0 0 20px rgba(0, 255, 148, 0.1)' 
                        : 'none',
                      transform: isChecked ? 'scale(1.01)' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.border = '1px solid rgba(0, 255, 148, 0.3)';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.border = '1px solid rgba(60, 60, 60, 0.5)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {/* Custom Checkbox */}
                    <div className="relative">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => toggleFormatting(option, checked as boolean)}
                        className="sr-only"
                        aria-label={option}
                      />
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300"
                        style={{
                          background: isChecked 
                            ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)'
                            : 'rgba(60, 60, 60, 0.5)',
                          border: isChecked ? 'none' : '2px solid rgba(100, 100, 100, 0.5)',
                          boxShadow: isChecked ? '0 0 15px hsla(var(--primary), 0.5)' : 'none',
                        }}
                      >
                        {isChecked && (
                          <Check className="w-4 h-4 text-primary-foreground animate-scale-in" />
                        )}
                      </div>
                    </div>

                    <span 
                      className="font-medium transition-colors duration-300"
                      style={{
                        color: isChecked ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                      }}
                    >
                      {option}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
      </div>

      {/* Section 2: Content Restrictions */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
              boxShadow: '0 0 25px hsla(var(--primary), 0.4)',
            }}
          >
            <span className="text-primary-foreground font-bold text-lg">2</span>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <div>
              <h2 
                className="text-xl font-bold"
                style={{ color: 'hsl(var(--primary))' }}
              >
                Restrições de Conteúdo
              </h2>
              <p className="text-sm text-muted-foreground">Limites e proibições importantes</p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 100%)',
            border: '1px solid rgba(60, 60, 60, 0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Important Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span 
              className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide"
              style={{
                background: 'rgba(251, 146, 60, 0.2)',
                color: '#fb923c',
                border: '1px solid rgba(251, 146, 60, 0.3)',
              }}
            >
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Importante
            </span>
          </div>

          <Label 
            htmlFor="contentRestrictions" 
            className="text-base font-semibold text-foreground mb-3 flex items-center gap-2"
          >
            O que o assistente NUNCA deve fazer
            <span className="text-primary">*</span>
          </Label>

          <div className="relative">
            <Textarea
              id="contentRestrictions"
              value={rules.contentRestrictions}
              onChange={(e) => updateRules('contentRestrictions', e.target.value)}
              placeholder={`Ex:\n• NUNCA dar diagnósticos médicos\n• NUNCA prometer resultados\n• NUNCA negociar valores\n• NUNCA compartilhar dados de outros clientes`}
              className="min-h-[200px] resize-y transition-all duration-300"
              style={{
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(60, 60, 60, 0.5)',
                borderRadius: '12px',
                padding: '16px',
                color: 'hsl(var(--foreground))',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(0, 255, 148, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 148, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(60, 60, 60, 0.5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
            <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
            Liste todas as ações que o assistente está proibido de fazer
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
      </div>

      {/* Section 3: Operational Limits */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
                boxShadow: '0 0 25px hsla(var(--primary), 0.4)',
              }}
            >
              <span className="text-primary-foreground font-bold text-lg">3</span>
            </div>
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <div>
                <h2 
                  className="text-xl font-bold"
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  Limites Operacionais
                </h2>
                <p className="text-sm text-muted-foreground">Regras específicas do seu negócio</p>
              </div>
            </div>
          </div>

          {rules.businessRules.length < 10 && (
            <Button 
              onClick={addBusinessRule} 
              className="gap-2 transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
                color: 'hsl(var(--primary-foreground))',
                boxShadow: '0 4px 20px hsla(var(--primary), 0.4)',
                border: 'none',
                fontWeight: '600',
              }}
              aria-label="Adicionar nova regra de negócio"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          )}
        </div>

        <div 
          className="p-6 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 100%)',
            border: '1px solid rgba(60, 60, 60, 0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Label className="text-base font-semibold text-foreground mb-4 block">
            Regras de Negócio Específicas
          </Label>

          <div className="space-y-3">
            {rules.businessRules.length === 0 ? (
              <div 
                className="py-12 text-center rounded-xl transition-all duration-300"
                style={{
                  border: '2px dashed rgba(60, 60, 60, 0.5)',
                  background: 'rgba(20, 20, 20, 0.3)',
                }}
              >
                <Settings className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-sm">
                  Nenhuma regra adicionada ainda
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Clique em "Adicionar" para criar uma regra
                </p>
              </div>
            ) : (
              rules.businessRules.map((rule, index) => (
                <div 
                  key={rule.id} 
                  className="group flex gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div 
                    className="flex-1 relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.05) 0%, transparent 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(60, 60, 60, 0.5)',
                    }}
                  >
                    <Input
                      value={rule.text}
                      onChange={(e) => updateBusinessRule(rule.id, e.target.value)}
                      placeholder="Ex: Valor mínimo: R$ 600,00"
                      className="border-0 bg-transparent h-12 px-4"
                      style={{
                        color: 'hsl(var(--foreground))',
                      }}
                      aria-label={`Regra de negócio ${index + 1}`}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeBusinessRule(rule.id)}
                    className="h-12 w-12 rounded-xl transition-all duration-300 opacity-50 group-hover:opacity-100"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                    }}
                    aria-label="Remover regra"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {rules.businessRules.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
              {rules.businessRules.length} de 10 regras adicionadas
            </p>
          )}
        </div>
      </section>

      {/* Footer Tip */}
      <div 
        className="p-4 rounded-xl text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.5) 0%, rgba(20, 20, 20, 0.3) 100%)',
          border: '1px solid rgba(60, 60, 60, 0.3)',
        }}
      >
        <p className="text-sm text-muted-foreground">
          🛡️ <span className="font-medium">Dica de segurança:</span> Quanto mais específicas forem suas restrições, mais seguro será seu assistente.
        </p>
      </div>
    </div>
  );
};

export default RulesForm;
