import { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Shield, Clock, UserX, Moon, Zap, AlertTriangle, Check, AlertOctagon, ShieldAlert, CheckCircle, Info, Sparkles, X } from 'lucide-react';
import { generateId } from '@/lib/storage';

// Default critical rules to pre-populate
const DEFAULT_CRITICAL_RULES = ['NUNCA revelar ser IA/chatbot/robô/assistente virtual/modelo de linguagem ou tecnologia similar', 'NUNCA mencionar limitações técnicas ou que é um sistema automatizado', 'NUNCA dizer frases como "Sou apenas um assistente", "Não tenho acesso a", "Como IA eu não posso"', 'NUNCA pedir desculpas por não ser humano ou por ser um sistema', 'NUNCA compartilhar dados de outros clientes ou mencionar outros atendimentos'];

// Quick suggestion pills
const QUICK_SUGGESTIONS = [{
  text: 'NUNCA revelar ser IA',
  full: 'NUNCA revelar ser IA/chatbot/robô/assistente virtual ou tecnologia similar'
}, {
  text: 'NUNCA dar diagnósticos',
  full: 'NUNCA dar diagnósticos médicos ou sugerir medicamentos/tratamentos'
}, {
  text: 'NUNCA compartilhar dados',
  full: 'NUNCA compartilhar dados de outros clientes ou mencionar outros atendimentos'
}, {
  text: 'NUNCA consultoria jurídica',
  full: 'NUNCA dar orientação jurídica específica ou interpretar leis (apenas direcionar ao advogado)'
}];
const FinalizationForm = () => {
  const {
    project,
    updateFinalization
  } = useProject();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newRule, setNewRule] = useState('');

  // Initialize with default rules if empty
  useEffect(() => {
    if (project && project.finalization.criticalObservations.length === 0) {
      updateFinalization('criticalObservations', DEFAULT_CRITICAL_RULES);
    }
  }, []);
  if (!project) return null;
  const {
    finalization
  } = project;

  // Special Cases
  const addSpecialCase = () => {
    updateFinalization('specialCases', [...finalization.specialCases, {
      id: generateId(),
      title: '',
      description: '',
      action: ''
    }]);
  };
  const updateSpecialCase = (id: string, field: 'title' | 'description' | 'action', value: string) => {
    const newCases = finalization.specialCases.map(c => c.id === id ? {
      ...c,
      [field]: value
    } : c);
    updateFinalization('specialCases', newCases);
  };
  const removeSpecialCase = (id: string) => {
    updateFinalization('specialCases', finalization.specialCases.filter(c => c.id !== id));
  };

  // Critical Observations
  const addObservation = (text: string = '') => {
    if (text.trim()) {
      updateFinalization('criticalObservations', [...finalization.criticalObservations, text.trim()]);
      setNewRule('');
      setShowAddModal(false);
    }
  };
  const updateObservation = (index: number, value: string) => {
    const newObs = [...finalization.criticalObservations];
    newObs[index] = value;
    updateFinalization('criticalObservations', newObs);
  };
  const removeObservation = (index: number) => {
    updateFinalization('criticalObservations', finalization.criticalObservations.filter((_, i) => i !== index));
  };
  const addEssentialRules = () => {
    const existingRules = new Set(finalization.criticalObservations.map(r => r.toLowerCase()));
    const newRules = DEFAULT_CRITICAL_RULES.filter(rule => !existingRules.has(rule.toLowerCase()));
    if (newRules.length > 0) {
      updateFinalization('criticalObservations', [...finalization.criticalObservations, ...newRules]);
    }
  };

  // Check if rule is about AI identity (most critical)
  const isAIIdentityRule = (rule: string) => {
    const lower = rule.toLowerCase();
    return lower.includes('ia') || lower.includes('chatbot') || lower.includes('robô') || lower.includes('assistente virtual') || lower.includes('modelo de linguagem') || lower.includes('automatizado') || lower.includes('sistema');
  };

  // Check if rule is medical/legal (special critical)
  const isMedicalLegalRule = (rule: string) => {
    const lower = rule.toLowerCase();
    return lower.includes('médic') || lower.includes('diagnóstic') || lower.includes('medicament') || lower.includes('jurídic') || lower.includes('legal') || lower.includes('advogado') || lower.includes('tratamento') || lower.includes('dosagem');
  };

  // Get border color based on rule type
  const getRuleBorderColor = (rule: string) => {
    if (isAIIdentityRule(rule)) return '#DC2626'; // Red for AI identity
    if (isMedicalLegalRule(rule)) return '#991B1B'; // Dark red for medical/legal
    return '#F97316'; // Orange for other critical
  };

  // Premium Section Badge Component
  const SectionBadge = ({
    number,
    variant = 'primary'
  }: {
    number: number;
    variant?: 'primary' | 'critical';
  }) => <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 ${variant === 'critical' ? 'animate-pulse' : ''}`} style={{
    background: variant === 'critical' ? 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)' : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
    boxShadow: variant === 'critical' ? '0 0 25px rgba(220, 38, 38, 0.5)' : '0 0 25px hsla(var(--primary), 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.2)'
  }}>
      <span className="text-white font-black text-xl">{number}</span>
    </div>;

  // Premium Card Component
  const PremiumCard = ({
    children,
    className = '',
    variant = 'default'
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'critical';
  }) => <div className={`p-6 rounded-2xl transition-all duration-300 ${className}`} style={{
    background: variant === 'critical' ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(20, 20, 20, 0.6) 100%)' : 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 100%)',
    border: variant === 'critical' ? '3px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(60, 60, 60, 0.5)',
    backdropFilter: 'blur(20px)',
    boxShadow: variant === 'critical' ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(220, 38, 38, 0.15)' : '0 4px 20px rgba(0,0,0,0.3)'
  }}>
      {children}
    </div>;

  // Premium Radio Option Component
  const RadioOption = ({
    value,
    currentValue,
    title,
    description,
    children
  }: {
    value: string;
    currentValue: string;
    title: string;
    description: string;
    children?: React.ReactNode;
  }) => {
    const isSelected = value === currentValue;
    return <label className="group relative block cursor-pointer transition-all duration-300" style={{
      transform: isSelected ? 'scale(1.01)' : 'scale(1)'
    }}>
        <div className="relative p-6 rounded-2xl transition-all duration-300 overflow-hidden" style={{
        background: isSelected ? 'linear-gradient(135deg, rgba(0, 255, 148, 0.08) 0%, rgba(0, 255, 148, 0.03) 100%)' : 'linear-gradient(135deg, rgba(24, 24, 27, 0.6) 0%, rgba(39, 39, 42, 0.4) 100%)',
        border: isSelected ? '2px solid rgba(0, 255, 148, 0.8)' : '2px solid rgba(60, 60, 60, 0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: isSelected ? '0 0 30px rgba(0, 255, 148, 0.2), 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(0, 255, 148, 0.05)' : '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
          {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{
          background: 'linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)'
        }} />}

          <div className="flex items-start gap-5">
            <div className="relative mt-0.5">
              <RadioGroupItem value={value} className="sr-only" />
              <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300" style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: isSelected ? '3px solid hsl(var(--primary))' : '3px solid rgba(100, 100, 100, 0.5)'
            }}>
                {isSelected && <div className="w-3 h-3 rounded-full animate-scale-in" style={{
                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
                boxShadow: '0 0 12px rgba(0, 255, 148, 0.8)'
              }} />}
              </div>
            </div>

            <div className="flex-1">
              <span className="text-lg font-semibold block transition-colors duration-300" style={{
              color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
            }}>
                {title}
              </span>
              <span className="text-base text-gray-300 mt-1 block leading-relaxed">
                {description}
              </span>
              {children}
            </div>
          </div>
        </div>
      </label>;
  };

  // Premium Add Button
  const AddButton = ({
    onClick,
    disabled = false,
    variant = 'primary',
    label = 'Adicionar'
  }: {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'critical';
    label?: string;
  }) => <Button onClick={onClick} disabled={disabled} className="gap-2 transition-all duration-300 hover:scale-105 active:scale-98" style={{
    background: disabled ? 'rgba(60, 60, 60, 0.5)' : variant === 'critical' ? 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)' : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
    color: disabled ? 'rgba(150, 150, 150, 0.8)' : 'white',
    boxShadow: disabled ? 'none' : variant === 'critical' ? '0 4px 14px rgba(220, 38, 38, 0.4)' : '0 4px 14px hsla(var(--primary), 0.4)',
    border: 'none',
    fontWeight: '700',
    padding: '12px 24px',
    borderRadius: '12px'
  }}>
      <ShieldAlert className="w-5 h-5" />
      {label}
    </Button>;

  // Empty State Component
  const EmptyState = ({
    icon: Icon,
    text,
    subtext
  }: {
    icon: React.ElementType;
    text: string;
    subtext: string;
  }) => <div className="py-16 px-10 text-center rounded-2xl transition-all duration-300" style={{
    border: '2px dashed rgba(0, 255, 148, 0.3)',
    background: 'radial-gradient(circle at center, rgba(30, 30, 30, 0.4) 0%, transparent 70%)',
    backdropFilter: 'blur(4px)'
  }}>
      <Icon className="w-20 h-20 mx-auto mb-6 animate-pulse" style={{
      color: 'rgba(100, 100, 100, 0.6)'
    }} strokeWidth={1} />
      <p className="text-gray-300 text-xl font-semibold mb-2">{text}</p>
      <p className="text-gray-400 text-base max-w-sm mx-auto">{subtext}</p>
    </div>;

  // Critical Empty State
  const CriticalEmptyState = () => <div className="py-12 px-8 text-center rounded-2xl transition-all duration-300 animate-pulse" style={{
    border: '2px dashed rgba(220, 38, 38, 0.5)',
    background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.08) 0%, transparent 70%)'
  }}>
      <div className="relative inline-block mb-6">
        <AlertOctagon className="w-20 h-20 text-red-500/50" strokeWidth={1} />
        <X className="absolute -top-2 -right-2 w-8 h-8 text-red-500" />
      </div>
      <p className="text-red-400 text-xl font-bold mb-2">
        ATENÇÃO: Nenhuma observação crítica configurada
      </p>
      <p className="text-gray-400 text-base max-w-md mx-auto mb-6">
        Recomendamos adicionar ao menos regras sobre não revelar identidade de IA
      </p>
      <Button onClick={addEssentialRules} className="gap-2 font-bold" style={{
      background: 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)',
      boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)'
    }}>
        <Sparkles className="w-5 h-5" />
        Adicionar Regras Essenciais
      </Button>
    </div>;

  // Critical Rule Card Component
  const CriticalRuleCard = ({
    rule,
    index
  }: {
    rule: string;
    index: number;
  }) => {
    const borderColor = getRuleBorderColor(rule);
    const isAI = isAIIdentityRule(rule);
    return <div className="group relative flex items-start gap-4 p-5 rounded-xl transition-all duration-300 animate-fade-in" style={{
      background: `linear-gradient(135deg, ${borderColor}15 0%, rgba(40, 40, 40, 0.4) 100%)`,
      border: `1px solid ${borderColor}30`,
      borderLeft: `4px solid ${borderColor}`,
      animationDelay: `${index * 0.05}s`
    }}>
        {/* Alert Icon */}
        <div className="flex-shrink-0 mt-0.5" style={{
        filter: `drop-shadow(0 0 8px ${borderColor}60)`
      }}>
          <AlertTriangle className="w-6 h-6 animate-pulse" style={{
          color: borderColor
        }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base font-semibold leading-relaxed" style={{
            color: 'rgb(243, 244, 246)'
          }}>
              {rule.split(/(NUNCA|SEMPRE)/gi).map((part, i) => {
              if (part.toUpperCase() === 'NUNCA' || part.toUpperCase() === 'SEMPRE') {
                return <span key={i} className="text-red-400 font-bold">{part}</span>;
              }
              return part;
            })}
            </p>
            
            {/* CRÍTICO Badge for AI rules */}
            {isAI && <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse" style={{
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #DC2626',
            color: '#F87171'
          }}>
                CRÍTICO
              </span>}
          </div>
        </div>

        {/* Delete Button */}
        <Button variant="ghost" size="icon" onClick={() => removeObservation(index)} className="h-10 w-10 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 flex-shrink-0" style={{
        background: 'rgba(239, 68, 68, 0.1)'
      }}>
          <Trash2 className="w-4 h-4 text-red-400" />
        </Button>
      </div>;
  };

  // Add Rule Modal
  const AddRuleModal = () => {
    if (!showAddModal) return null;
    return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
        <div className="absolute inset-0" style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)'
      }} />

        <div className="relative w-full max-w-xl rounded-2xl p-8 animate-scale-in" onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(18,18,20,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(220, 38, 38, 0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(220, 38, 38, 0.15)'
      }}>
          {/* Close Button */}
          <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-zinc-800">
            <X className="w-5 h-5 text-zinc-400" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)'
          }}>
              <AlertOctagon className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Nova Observação Crítica
              </h2>
              <p className="text-gray-400 text-sm">
                Esta regra será <span className="text-red-400 font-bold">SEMPRE</span> seguida pelo assistente
              </p>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">Sugestões rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, i) => <button key={i} onClick={() => setNewRule(suggestion.full)} className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105" style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#F87171'
            }}>
                  {suggestion.text}
                </button>)}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-3 mb-6">
            <Label className="text-white font-semibold">
              Descrição da Regra <span className="text-red-400">*</span>
            </Label>
            <Textarea value={newRule} onChange={e => setNewRule(e.target.value)} placeholder="Ex: NUNCA revelar que é um assistente virtual ou IA" className="min-h-[120px] p-4 text-base rounded-xl border-2 border-zinc-700 bg-zinc-900 transition-all duration-300 focus:border-red-400 focus:ring-4 focus:ring-red-400/20" maxLength={500} />
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">
                Seja específico e use NUNCA/SEMPRE para regras absolutas
              </p>
              <span className="text-gray-500 text-sm">{newRule.length}/500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 border-2 border-zinc-700 text-gray-300 hover:border-zinc-500 hover:bg-zinc-800/50 rounded-xl">
              Cancelar
            </Button>
            <Button onClick={() => addObservation(newRule)} disabled={!newRule.trim()} className="px-6 py-2.5 font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50" style={{
            background: newRule.trim() ? 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)' : 'rgba(60, 60, 60, 0.5)',
            boxShadow: newRule.trim() ? '0 4px 14px rgba(220, 38, 38, 0.4)' : 'none',
            color: 'white'
          }}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Observação
            </Button>
          </div>
        </div>
      </div>;
  };
  return <div className="space-y-16">
      {/* Premium Header */}
      <div className="text-center space-y-4">
        <div className="w-32 h-0.5 mx-auto mb-6" style={{
        background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 50%, transparent 100%)'
      }} />
        
        <div className="inline-flex items-center justify-center gap-3 mb-2">
          <Shield className="w-8 h-8" style={{
          color: 'hsl(var(--primary))',
          filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.5))'
        }} />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 70%) 50%, hsl(var(--primary)) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundSize: '200% 200%'
        }}>
            Casos Especiais e Finalização
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed" style={{
        lineHeight: '1.6'
      }}>
          Configure comportamentos especiais e finalize as configurações do seu assistente
        </p>
      </div>

      {/* Section 1: No Response */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <SectionBadge number={1} />
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold" style={{
              color: 'hsl(var(--primary))'
            }}>
                Cliente não responde
              </h2>
              <p className="text-sm text-gray-400">Defina o comportamento quando não há resposta</p>
            </div>
          </div>
        </div>

        <PremiumCard>
          <Label className="text-lg font-semibold text-foreground mb-6 block">
            O que fazer se o cliente parar de responder?
          </Label>
          
          <RadioGroup value={finalization.noResponseBehavior} onValueChange={value => updateFinalization('noResponseBehavior', value as any)} className="space-y-4">
            <RadioOption value="aguardar" currentValue={finalization.noResponseBehavior} title="Aguardar silenciosamente" description="O assistente não envia mais mensagens até o cliente retomar" />
            
            <RadioOption value="lembrete" currentValue={finalization.noResponseBehavior} title="Enviar lembrete após um tempo" description='"Ainda está aí? Posso ajudar?"'>
              {finalization.noResponseBehavior === 'lembrete' && <div className="flex items-center gap-4 mt-4 animate-fade-in">
                  <span className="text-base text-gray-300">Aguardar</span>
                  <div className="relative">
                    <Input type="number" value={finalization.reminderMinutes} onChange={e => updateFinalization('reminderMinutes', parseInt(e.target.value) || 30)} min={5} max={120} className="w-24 h-12 text-center text-2xl font-bold border-0" style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '12px',
                  color: 'hsl(var(--primary))'
                }} />
                  </div>
                  <span className="px-4 py-3 rounded-lg text-gray-300 font-medium" style={{
                background: 'rgba(40, 40, 40, 0.8)',
                border: '1px solid rgba(60, 60, 60, 0.5)'
              }}>
                    minutos
                  </span>
                </div>}
            </RadioOption>
            
            <RadioOption value="finalizar" currentValue={finalization.noResponseBehavior} title="Finalizar atendimento automaticamente" description="Encerra e permite que cliente recomece depois" />
          </RadioGroup>
        </PremiumCard>
      </section>

      {/* Section 2: Aggressive Client */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <SectionBadge number={2} />
          <div className="flex items-center gap-3">
            <UserX className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold" style={{
              color: 'hsl(var(--primary))'
            }}>
                Cliente agressivo ou muito insatisfeito
              </h2>
              <p className="text-sm text-gray-400">Como lidar com situações difíceis</p>
            </div>
          </div>
        </div>

        <PremiumCard>
          <Label htmlFor="aggressiveClient" className="text-lg font-semibold text-foreground mb-4 block">
            Como o assistente deve reagir?
          </Label>
          
          <Textarea id="aggressiveClient" value={finalization.aggressiveClientBehavior} onChange={e => updateFinalization('aggressiveClientBehavior', e.target.value)} placeholder={`Ex: Manter profissionalismo, demonstrar empatia e transferir para humano se persistir.\n\n"Entendo sua situação. Vou transferir você para nossa equipe que poderá ajudar melhor."`} className="min-h-[180px] resize-y text-base leading-relaxed transition-all duration-300" style={{
          background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(25, 25, 25, 0.6) 100%)',
          border: '2px solid rgba(60, 60, 60, 0.5)',
          borderRadius: '16px',
          padding: '20px',
          color: 'hsl(var(--foreground))',
          lineHeight: '1.8'
        }} />
          
          <p className="text-sm text-gray-400 mt-3 flex items-center gap-2">
            <span className="text-primary">💡</span>
            Descreva a postura e exemplos de resposta para situações de conflito
          </p>
        </PremiumCard>
      </section>

      {/* Section 3: Outside Hours */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <SectionBadge number={3} />
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold" style={{
              color: 'hsl(var(--primary))'
            }}>
                Atendimento fora do horário
              </h2>
              <p className="text-sm text-gray-400">Comportamento fora do expediente</p>
            </div>
          </div>
        </div>

        <PremiumCard>
          <Label className="text-lg font-semibold text-foreground mb-6 block">
            O que fazer quando cliente escreve fora do horário?
          </Label>
          
          <RadioGroup value={finalization.outsideHoursBehavior} onValueChange={value => updateFinalization('outsideHoursBehavior', value as any)} className="space-y-4">
            <RadioOption value="informar" currentValue={finalization.outsideHoursBehavior} title="Informar horário e não atender" description='"Nosso horário é Seg-Sex 8h-18h. Retornaremos no próximo dia útil."' />
            
            <RadioOption value="qualificar" currentValue={finalization.outsideHoursBehavior} title="Informar horário mas permitir qualificação" description="Coleta dados básicos mesmo fora do horário para retorno posterior" />
            
            <RadioOption value="atender" currentValue={finalization.outsideHoursBehavior} title="Atender normalmente (IA 24/7)" description="Assistente funciona 24 horas, 7 dias por semana" />
          </RadioGroup>
        </PremiumCard>
      </section>

      {/* Section 4: Custom Special Cases */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SectionBadge number={4} />
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-xl font-bold" style={{
                color: 'hsl(var(--primary))'
              }}>
                  Situações específicas do seu negócio
                </h2>
                <p className="text-sm text-gray-400">Casos personalizados (opcional)</p>
              </div>
            </div>
          </div>
          
          {finalization.specialCases.length < 5 && <Button onClick={addSpecialCase} className="gap-2 transition-all duration-300 hover:scale-105" style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
          boxShadow: '0 4px 14px hsla(var(--primary), 0.4)',
          fontWeight: '700',
          padding: '12px 24px',
          borderRadius: '12px'
        }}>
              <Plus className="w-5 h-5" strokeWidth={3} />
              Adicionar
            </Button>}
        </div>

        <PremiumCard>
          {finalization.specialCases.length === 0 ? <EmptyState icon={Zap} text="Nenhum caso especial adicionado" subtext='Clique em "Adicionar" para criar situações específicas do seu negócio' /> : <div className="space-y-4">
              {finalization.specialCases.map((specialCase, index) => <div key={specialCase.id} className="group p-6 rounded-xl space-y-4 transition-all duration-300 animate-fade-in" style={{
            background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.5) 0%, rgba(30, 30, 30, 0.3) 100%)',
            border: '1px solid rgba(60, 60, 60, 0.5)',
            animationDelay: `${index * 0.05}s`
          }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{
                color: 'hsl(var(--primary))'
              }}>
                      Caso {index + 1}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => removeSpecialCase(specialCase.id)} className="h-10 w-10 rounded-xl transition-all duration-300 opacity-50 group-hover:opacity-100" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">Situação:</Label>
                    <Input value={specialCase.title} onChange={e => updateSpecialCase(specialCase.id, 'title', e.target.value)} placeholder="Ex: Cliente solicita desconto especial" className="border-0 bg-black/40 h-12 text-base font-medium" style={{
                borderRadius: '10px'
              }} />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">Ação:</Label>
                    <Input value={specialCase.action} onChange={e => updateSpecialCase(specialCase.id, 'action', e.target.value)} placeholder="Ex: Transferir para setor comercial" className="border-0 bg-black/40 h-12 text-base" style={{
                borderRadius: '10px'
              }} />
                  </div>
                </div>)}
              
              <p className="text-xs text-gray-500 mt-4">
                {finalization.specialCases.length} de 5 casos adicionados
              </p>
            </div>}
        </PremiumCard>
      </section>

      {/* Section 5: Critical Reminders - EXPANDED */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <SectionBadge number={5} variant="critical" />
            <div className="flex items-center gap-3">
              
              <div>
                <h2 className="text-xl font-black flex items-center gap-2 flex-wrap" style={{
                color: '#F87171'
              }}>
                  
                  Lembretes importantes (NUNCA ESQUEÇA)
                </h2>
                <p className="text-sm text-gray-400">
                  Regras críticas que o assistente <span className="text-red-400 font-bold">SEMPRE</span> deve seguir, especialmente sobre identidade
                </p>
              </div>
            </div>
          </div>
          
          {finalization.criticalObservations.length < 15 && <AddButton onClick={() => setShowAddModal(true)} variant="critical" label="Adicionar Regra Crítica" />}
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{finalization.criticalObservations.length} observações críticas configuradas</span>
          {finalization.criticalObservations.length > 10 && <span className="text-yellow-400 ml-2">(Máximo recomendado: 15)</span>}
        </div>

        <PremiumCard variant="critical">
          {finalization.criticalObservations.length === 0 ? <CriticalEmptyState /> : <div className="space-y-3">
              {finalization.criticalObservations.map((obs, index) => <CriticalRuleCard key={index} rule={obs} index={index} />)}
              
              {/* Add Essential Rules Button */}
              {finalization.criticalObservations.length < 5 && <button onClick={addEssentialRules} className="w-full p-4 rounded-xl border-2 border-dashed border-zinc-700 text-gray-400 hover:text-gray-300 hover:border-zinc-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Adicionar regras essenciais recomendadas
                </button>}
            </div>}
        </PremiumCard>
      </section>

      {/* Footer Success State */}
      <div className="p-6 rounded-2xl text-center" style={{
      background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.08) 0%, rgba(30, 30, 30, 0.4) 100%)',
      border: '1px solid rgba(0, 255, 148, 0.2)'
    }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Check className="w-6 h-6" style={{
          color: 'hsl(var(--primary))'
        }} />
          <span className="text-lg font-semibold" style={{
          color: 'hsl(var(--primary))'
        }}>
            Quase lá!
          </span>
        </div>
        <p className="text-base text-gray-300">
          Revise as configurações e clique em <span className="font-bold text-primary">"Gerar Prompt"</span> para finalizar
        </p>
      </div>

      {/* Add Rule Modal */}
      <AddRuleModal />
    </div>;
};
export default FinalizationForm;