import { useProject } from '@/contexts/ProjectContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Lightbulb, GitBranch, MessageSquare, ClipboardList, Calendar, Users, HelpCircle, Check, X } from 'lucide-react';
import { generateId } from '@/lib/storage';
import { useState } from 'react';

// Opening message suggestions
const OPENING_SUGGESTIONS = [
  {
    category: 'Clínicas/Saúde',
    message: 'Olá! Sou [nome], assistente da [empresa]. Como posso ajudá-lo hoje?',
    icon: '🏥',
  },
  {
    category: 'Advocacia',
    message: 'Bom dia/tarde! Sou [nome], assistente da [escritório]. Como posso auxiliá-lo?',
    icon: '⚖️',
  },
  {
    category: 'B2B/Atacado',
    message: 'Olá! Sou [nome], da [empresa]. Atendemos apenas lojistas com CNPJ. Como posso ajudar?',
    icon: '🏢',
  },
  {
    category: 'Suporte/FAQ',
    message: 'Olá! Sou [nome], assistente virtual. Estou aqui para tirar suas dúvidas!',
    icon: '💬',
  },
];

const FlowsForm = () => {
  const { project, updateFlows } = useProject();
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!project) return null;

  const { flows, identity } = project;
  const assistantType = identity.type;

  // Apply opening message suggestion
  const applySuggestion = (message: string) => {
    const filledMessage = message
      .replace('[nome]', identity.name || '[nome]')
      .replace('[empresa]', identity.companyName || '[empresa]')
      .replace('[escritório]', identity.companyName || '[escritório]');
    updateFlows('openingMessage', filledMessage);
    setShowSuggestions(false);
  };

  // Qualification Questions
  const addQuestion = () => {
    updateFlows('qualificationQuestions', [...flows.qualificationQuestions, '']);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...flows.qualificationQuestions];
    newQuestions[index] = value;
    updateFlows('qualificationQuestions', newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = flows.qualificationQuestions.filter((_, i) => i !== index);
    updateFlows('qualificationQuestions', newQuestions.length > 0 ? newQuestions : ['']);
  };

  // Required Data for Scheduling
  const schedulingDataOptions = [
    { id: 'nome_completo', label: 'Nome completo', icon: '👤' },
    { id: 'data_nascimento', label: 'Data de nascimento', icon: '📅' },
    { id: 'telefone', label: 'Telefone', icon: '📱' },
    { id: 'cpf', label: 'CPF', icon: '🪪' },
    { id: 'email', label: 'E-mail', icon: '✉️' },
    { id: 'observacoes', label: 'Observações/Queixas', icon: '📝' },
  ];

  const toggleSchedulingData = (id: string, checked: boolean) => {
    const newData = checked
      ? [...flows.requiredDataForScheduling, id]
      : flows.requiredDataForScheduling.filter((d) => d !== id);
    updateFlows('requiredDataForScheduling', newData);
  };

  // Qualification Criteria
  const addCriteria = () => {
    updateFlows('qualificationCriteria', [
      ...flows.qualificationCriteria,
      { id: generateId(), text: '', required: true },
    ]);
  };

  const updateCriteria = (id: string, field: 'text' | 'required', value: string | boolean) => {
    const newCriteria = flows.qualificationCriteria.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    updateFlows('qualificationCriteria', newCriteria);
  };

  const removeCriteria = (id: string) => {
    updateFlows(
      'qualificationCriteria',
      flows.qualificationCriteria.filter((c) => c.id !== id)
    );
  };

  // Objections
  const addObjection = () => {
    updateFlows('objections', [
      ...flows.objections,
      { id: generateId(), objection: '', response: '' },
    ]);
  };

  const updateObjection = (id: string, field: 'objection' | 'response', value: string) => {
    const newObjections = flows.objections.map((o) =>
      o.id === id ? { ...o, [field]: value } : o
    );
    updateFlows('objections', newObjections);
  };

  const removeObjection = (id: string) => {
    updateFlows(
      'objections',
      flows.objections.filter((o) => o.id !== id)
    );
  };

  // Transfer Situations
  const addTransferSituation = () => {
    updateFlows('transferSituations', [...flows.transferSituations, '']);
  };

  const updateTransferSituation = (index: number, value: string) => {
    const newSituations = [...flows.transferSituations];
    newSituations[index] = value;
    updateFlows('transferSituations', newSituations);
  };

  const removeTransferSituation = (index: number) => {
    const newSituations = flows.transferSituations.filter((_, i) => i !== index);
    updateFlows('transferSituations', newSituations.length > 0 ? newSituations : ['']);
  };

  // FAQ Items
  const addFaqItem = () => {
    updateFlows('faqItems', [...flows.faqItems, { question: '', answer: '' }]);
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const newItems = [...flows.faqItems];
    newItems[index] = { ...newItems[index], [field]: value };
    updateFlows('faqItems', newItems);
  };

  const removeFaqItem = (index: number) => {
    updateFlows(
      'faqItems',
      flows.faqItems.filter((_, i) => i !== index)
    );
  };

  // Support Topics
  const supportTopicOptions = [
    { label: 'Dúvidas sobre produtos', icon: '📦' },
    { label: 'Problemas técnicos', icon: '🔧' },
    { label: 'Política de troca/devolução', icon: '🔄' },
    { label: 'Garantia', icon: '🛡️' },
    { label: 'Rastreamento de pedidos', icon: '📍' },
    { label: 'Outros', icon: '💬' },
  ];

  const toggleSupportTopic = (topic: string, checked: boolean) => {
    const newTopics = checked
      ? [...flows.supportTopics, topic]
      : flows.supportTopics.filter((t) => t !== topic);
    updateFlows('supportTopics', newTopics);
  };

  // Premium Section Header Component
  const SectionHeader = ({ number, title, subtitle, icon: Icon }: { number: number; title: string; subtitle: string; icon: React.ElementType }) => (
    <div className="flex items-center gap-4 mb-8">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
          boxShadow: '0 0 25px hsla(var(--primary), 0.4)',
        }}
      >
        <span className="text-primary-foreground font-bold text-lg">{number}</span>
      </div>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <div>
          <h2 
            className="text-xl font-bold"
            style={{ color: 'hsl(var(--primary))' }}
          >
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  // Premium Card Component
  const PremiumCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div 
      className={`p-6 rounded-xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 100%)',
        border: '1px solid rgba(60, 60, 60, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </div>
  );

  // Premium Add Button
  const AddButton = ({ onClick, disabled = false, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) => (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className="gap-2 transition-all duration-300 hover:scale-105"
      style={{
        background: disabled ? 'rgba(60, 60, 60, 0.5)' : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
        color: disabled ? 'rgba(150, 150, 150, 0.8)' : 'hsl(var(--primary-foreground))',
        boxShadow: disabled ? 'none' : '0 4px 20px hsla(var(--primary), 0.4)',
        border: 'none',
        fontWeight: '600',
      }}
    >
      <Plus className="w-4 h-4" />
      {children}
    </Button>
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <GitBranch className="w-6 h-6 text-primary" />
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 70%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Fluxos de Atendimento
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Configure os fluxos de atendimento do assistente para cada situação
        </p>
      </div>

      {/* Section 1: Initial Flow */}
      <section className="space-y-6">
        <SectionHeader 
          number={1} 
          title="Fluxo de Atendimento Inicial" 
          subtitle="Primeira impressão e qualificação"
          icon={MessageSquare}
        />

        {/* Opening Message */}
        <PremiumCard>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <Label className="text-lg font-semibold text-primary">
              Mensagem de Abertura
            </Label>
            <span className="text-destructive">*</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Como o assistente deve cumprimentar o cliente
          </p>

          <div className="relative">
            <Textarea
              id="openingMessage"
              value={flows.openingMessage}
              onChange={(e) => updateFlows('openingMessage', e.target.value)}
              placeholder="Ex: Olá! Sou a Maria, da Clínica Moreira. Como posso ajudá-lo hoje?"
              className="min-h-[120px] resize-y transition-all duration-300 font-mono text-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(60, 60, 60, 0.5)',
                borderRadius: '12px',
                padding: '16px',
                color: 'hsl(var(--foreground))',
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

          {/* Suggestions Toggle */}
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-2 mt-4 transition-all duration-300 text-sm font-medium group"
            style={{
              color: 'hsl(var(--primary))',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              textUnderlineOffset: '4px',
            }}
          >
            <Lightbulb className="w-4 h-4 group-hover:animate-pulse" />
            {showSuggestions ? 'Ocultar sugestões' : 'Ver sugestões de abertura'}
          </button>

          {/* Suggestions Cards */}
          {showSuggestions && (
            <div className="mt-6 grid gap-4 animate-fade-in">
              {OPENING_SUGGESTIONS.map((suggestion, index) => (
                <div
                  key={index}
                  className="group p-5 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 148, 0.05) 0%, transparent 100%)',
                    border: '1px solid rgba(60, 60, 60, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(0, 255, 148, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(60, 60, 60, 0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => applySuggestion(suggestion.message)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{suggestion.icon}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {suggestion.category}
                    </span>
                  </div>
                  <p className="text-sm text-foreground italic mb-3">"{suggestion.message}"</p>
                  <span 
                    className="text-xs font-semibold transition-colors"
                    style={{ color: 'hsl(var(--primary))' }}
                  >
                    Clique para usar →
                  </span>
                </div>
              ))}
            </div>
          )}
        </PremiumCard>

        {/* Qualification Questions */}
        <PremiumCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <Label className="text-lg font-semibold text-foreground">
                Perguntas de Qualificação Inicial
              </Label>
            </div>
            {flows.qualificationQuestions.length < 5 && (
              <AddButton onClick={addQuestion}>
                Adicionar
              </AddButton>
            )}
          </div>

          <div className="space-y-3">
            {flows.qualificationQuestions.length === 0 || (flows.qualificationQuestions.length === 1 && flows.qualificationQuestions[0] === '') ? (
              <div 
                className="py-12 text-center rounded-xl transition-all duration-300"
                style={{
                  border: '2px dashed rgba(60, 60, 60, 0.5)',
                  background: 'rgba(20, 20, 20, 0.3)',
                }}
              >
                <ClipboardList className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-sm">
                  Nenhuma pergunta adicionada
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Clique em "Adicionar" para criar perguntas de qualificação
                </p>
              </div>
            ) : (
              flows.qualificationQuestions.map((question, index) => (
                <div 
                  key={index} 
                  className="group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 animate-fade-in"
                  style={{
                    background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.5) 0%, rgba(30, 30, 30, 0.3) 100%)',
                    border: '1px solid rgba(60, 60, 60, 0.5)',
                    animationDelay: `${index * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(0, 255, 148, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(60, 60, 60, 0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* Number Badge */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(0, 255, 148, 0.2)',
                      color: 'hsl(var(--primary))',
                    }}
                  >
                    <span className="font-bold text-sm">{index + 1}</span>
                  </div>

                  {/* Input */}
                  <Input
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder="Ex: Você é servidor público?"
                    className="flex-1 border-0 bg-transparent h-10 text-foreground font-medium"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '0 16px',
                    }}
                  />

                  {/* Delete Button */}
                  {flows.qualificationQuestions.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeQuestion(index)}
                      className="h-10 w-10 rounded-lg transition-all duration-300 opacity-50 group-hover:opacity-100"
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
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>

          {flows.qualificationQuestions.length > 0 && flows.qualificationQuestions[0] !== '' && (
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
              {flows.qualificationQuestions.filter(q => q !== '').length} de 5 perguntas adicionadas
            </p>
          )}
        </PremiumCard>
      </section>

      {/* Section 2: Type-specific flows */}
      {assistantType === 'atendimento' && (
        <section className="space-y-6">
          <SectionHeader 
            number={2} 
            title="Configurações de Agendamento" 
            subtitle="Dados e políticas de agendamento"
            icon={Calendar}
          />

          <PremiumCard>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <Label className="text-lg font-semibold text-foreground">
                Dados Necessários para Agendamento
              </Label>
              <span className="text-destructive">*</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {schedulingDataOptions.map((option) => {
                const isChecked = flows.requiredDataForScheduling.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="group flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
                    style={{
                      background: isChecked 
                        ? 'linear-gradient(135deg, rgba(0, 255, 148, 0.1) 0%, transparent 100%)'
                        : 'rgba(30, 30, 30, 0.5)',
                      border: isChecked 
                        ? '1px solid rgba(0, 255, 148, 0.4)' 
                        : '1px solid rgba(60, 60, 60, 0.5)',
                    }}
                  >
                    <div className="relative">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => toggleSchedulingData(option.id, checked as boolean)}
                        className="sr-only"
                      />
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center transition-all duration-300"
                        style={{
                          background: isChecked 
                            ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)'
                            : 'rgba(60, 60, 60, 0.5)',
                          border: isChecked ? 'none' : '2px solid rgba(100, 100, 100, 0.5)',
                        }}
                      >
                        {isChecked && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <span className="text-lg">{option.icon}</span>
                    <span className={`text-sm font-medium ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </PremiumCard>

          <div className="grid md:grid-cols-2 gap-4">
            <PremiumCard>
              <Label htmlFor="cancellationPolicy" className="text-base font-semibold text-foreground mb-3 block">
                📋 Política de Cancelamento
              </Label>
              <Textarea
                id="cancellationPolicy"
                value={flows.cancellationPolicy}
                onChange={(e) => updateFlows('cancellationPolicy', e.target.value)}
                placeholder="Ex: Cancelamento até 24h antes sem custo"
                className="min-h-[100px] resize-y"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(60, 60, 60, 0.5)',
                  borderRadius: '12px',
                }}
              />
            </PremiumCard>

            <PremiumCard>
              <Label htmlFor="reschedulingPolicy" className="text-base font-semibold text-foreground mb-3 block">
                🔄 Política de Reagendamento
              </Label>
              <Textarea
                id="reschedulingPolicy"
                value={flows.reschedulingPolicy}
                onChange={(e) => updateFlows('reschedulingPolicy', e.target.value)}
                placeholder="Ex: Reagendamento permitido até 2h antes"
                className="min-h-[100px] resize-y"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(60, 60, 60, 0.5)',
                  borderRadius: '12px',
                }}
              />
            </PremiumCard>
          </div>
        </section>
      )}

      {assistantType === 'qualificacao' && (
        <section className="space-y-6">
          <SectionHeader 
            number={2} 
            title="Qualificação de Leads" 
            subtitle="Critérios e tratamento de objeções"
            icon={Users}
          />

          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold text-foreground">
                  Critérios de Qualificação
                </Label>
              </div>
              <AddButton onClick={addCriteria}>
                Adicionar
              </AddButton>
            </div>

            <div className="space-y-3">
              {flows.qualificationCriteria.map((criteria, index) => (
                <div 
                  key={criteria.id} 
                  className="group flex gap-3 items-center p-4 rounded-xl transition-all duration-300 animate-fade-in"
                  style={{
                    background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.5) 0%, rgba(30, 30, 30, 0.3) 100%)',
                    border: '1px solid rgba(60, 60, 60, 0.5)',
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <Input
                    value={criteria.text}
                    onChange={(e) => updateCriteria(criteria.id, 'text', e.target.value)}
                    placeholder="Ex: Tempo de trabalho >= 6 meses"
                    className="flex-1 border-0 bg-black/30"
                    style={{ borderRadius: '8px' }}
                  />
                  <select
                    value={criteria.required ? 'obrigatorio' : 'desejavel'}
                    onChange={(e) => updateCriteria(criteria.id, 'required', e.target.value === 'obrigatorio')}
                    className="h-10 px-3 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(60, 60, 60, 0.5)',
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    <option value="obrigatorio">Obrigatório</option>
                    <option value="desejavel">Desejável</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeCriteria(criteria.id)}
                    className="h-10 w-10 rounded-lg opacity-50 group-hover:opacity-100"
                    style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold text-foreground">
                  Tratamento de Objeções
                </Label>
              </div>
              {flows.objections.length < 5 && (
                <AddButton onClick={addObjection}>
                  Adicionar
                </AddButton>
              )}
            </div>

            <div className="space-y-4">
              {flows.objections.map((obj, index) => (
                <div 
                  key={obj.id} 
                  className="group p-5 rounded-xl space-y-4 animate-fade-in"
                  style={{
                    background: 'rgba(30, 30, 30, 0.5)',
                    border: '1px solid rgba(60, 60, 60, 0.5)',
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Objeção {index + 1}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-50 group-hover:opacity-100" 
                      onClick={() => removeObjection(obj.id)}
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <Input
                    value={obj.objection}
                    onChange={(e) => updateObjection(obj.id, 'objection', e.target.value)}
                    placeholder="Ex: Tenho medo de perder"
                    className="border-0 bg-black/30"
                    style={{ borderRadius: '8px' }}
                  />
                  <Label className="text-xs text-muted-foreground">Resposta sugerida</Label>
                  <Textarea
                    value={obj.response}
                    onChange={(e) => updateObjection(obj.id, 'response', e.target.value)}
                    placeholder="Ex: Trabalhamos com êxito..."
                    className="min-h-[80px] border-0 bg-black/30"
                    style={{ borderRadius: '8px' }}
                  />
                </div>
              ))}
            </div>
          </PremiumCard>
        </section>
      )}

      {assistantType === 'b2b' && (
        <section className="space-y-6">
          <SectionHeader 
            number={2} 
            title="Configurações B2B" 
            subtitle="Público-alvo e políticas de atendimento"
            icon={Users}
          />

          <PremiumCard>
            <Label htmlFor="targetAudience" className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              🎯 Público-Alvo
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="targetAudience"
              value={flows.targetAudience}
              onChange={(e) => updateFlows('targetAudience', e.target.value)}
              placeholder="Ex: Lojistas com CNPJ, Distribuidores atacadistas"
              className="min-h-[100px] resize-y"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(60, 60, 60, 0.5)',
                borderRadius: '12px',
              }}
            />
          </PremiumCard>

          <PremiumCard>
            <Label className="text-lg font-semibold text-foreground mb-4 block">
              📋 Política de Atendimento a PF
            </Label>
            <RadioGroup
              value={flows.pfPolicy}
              onValueChange={(value) => updateFlows('pfPolicy', value as any)}
              className="space-y-3"
            >
              {[
                { value: 'nao-atende', label: 'Não atendemos pessoa física', icon: '🚫' },
                { value: 'atende-ambos', label: 'Atendemos PF e PJ', icon: '✅' },
                { value: 'apenas-pj-excecoes', label: 'Apenas PJ com exceções', icon: '⚠️' },
              ].map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
                  style={{
                    background: flows.pfPolicy === option.value 
                      ? 'linear-gradient(135deg, rgba(0, 255, 148, 0.1) 0%, transparent 100%)'
                      : 'rgba(30, 30, 30, 0.5)',
                    border: flows.pfPolicy === option.value 
                      ? '1px solid rgba(0, 255, 148, 0.4)' 
                      : '1px solid rgba(60, 60, 60, 0.5)',
                  }}
                >
                  <RadioGroupItem value={option.value} className="border-primary" />
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <Label className="text-lg font-semibold text-foreground">
                🔀 Situações de Transferência Imediata
              </Label>
              <AddButton onClick={addTransferSituation}>
                Adicionar
              </AddButton>
            </div>
            <div className="space-y-3">
              {flows.transferSituations.map((situation, index) => (
                <div key={index} className="group flex gap-3">
                  <Input
                    value={situation}
                    onChange={(e) => updateTransferSituation(index, e.target.value)}
                    placeholder="Ex: Pré-venda, Negociação especial"
                    className="flex-1 border-0 bg-black/30"
                    style={{ borderRadius: '8px' }}
                  />
                  {flows.transferSituations.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeTransferSituation(index)}
                      className="opacity-50 group-hover:opacity-100"
                      style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </PremiumCard>
        </section>
      )}

      {assistantType === 'suporte' && (
        <section className="space-y-6">
          <SectionHeader 
            number={2} 
            title="Base de Conhecimento e FAQ" 
            subtitle="Perguntas frequentes e tipos de atendimento"
            icon={HelpCircle}
          />

          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold text-foreground">
                  Perguntas Frequentes (FAQ)
                </Label>
              </div>
              {flows.faqItems.length < 20 && (
                <AddButton onClick={addFaqItem}>
                  Adicionar
                </AddButton>
              )}
            </div>

            <div className="space-y-4">
              {flows.faqItems.length === 0 ? (
                <div 
                  className="py-12 text-center rounded-xl"
                  style={{
                    border: '2px dashed rgba(60, 60, 60, 0.5)',
                    background: 'rgba(20, 20, 20, 0.3)',
                  }}
                >
                  <HelpCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">Nenhum FAQ adicionado</p>
                  <p className="text-muted-foreground text-xs mt-1">Clique em "Adicionar" para criar</p>
                </div>
              ) : (
                flows.faqItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="group p-5 rounded-xl space-y-4 animate-fade-in"
                    style={{
                      background: 'rgba(30, 30, 30, 0.5)',
                      border: '1px solid rgba(60, 60, 60, 0.5)',
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        Pergunta {index + 1}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-50 group-hover:opacity-100" 
                        onClick={() => removeFaqItem(index)}
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                    <Input
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                      placeholder="Ex: Como funciona a garantia?"
                      className="border-0 bg-black/30"
                      style={{ borderRadius: '8px' }}
                    />
                    <Label className="text-xs text-muted-foreground">Resposta</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      placeholder="Ex: Nossa garantia cobre..."
                      className="min-h-[80px] border-0 bg-black/30"
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                ))
              )}
            </div>
          </PremiumCard>

          <PremiumCard>
            <Label className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              📦 Tipos de Atendimento Suportados
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {supportTopicOptions.map((topic) => {
                const isChecked = flows.supportTopics.includes(topic.label);
                return (
                  <label
                    key={topic.label}
                    className="group flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
                    style={{
                      background: isChecked 
                        ? 'linear-gradient(135deg, rgba(0, 255, 148, 0.1) 0%, transparent 100%)'
                        : 'rgba(30, 30, 30, 0.5)',
                      border: isChecked 
                        ? '1px solid rgba(0, 255, 148, 0.4)' 
                        : '1px solid rgba(60, 60, 60, 0.5)',
                    }}
                  >
                    <div className="relative">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => toggleSupportTopic(topic.label, checked as boolean)}
                        className="sr-only"
                      />
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center transition-all duration-300"
                        style={{
                          background: isChecked 
                            ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)'
                            : 'rgba(60, 60, 60, 0.5)',
                          border: isChecked ? 'none' : '2px solid rgba(100, 100, 100, 0.5)',
                        }}
                      >
                        {isChecked && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <span className="text-lg">{topic.icon}</span>
                    <span className={`text-sm font-medium ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                      {topic.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </PremiumCard>
        </section>
      )}

      {/* Footer Tip */}
      <div 
        className="p-4 rounded-xl text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.5) 0%, rgba(20, 20, 20, 0.3) 100%)',
          border: '1px solid rgba(60, 60, 60, 0.3)',
        }}
      >
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-medium">Dica:</span> Fluxos bem configurados resultam em atendimentos mais eficientes e clientes mais satisfeitos.
        </p>
      </div>
    </div>
  );
};

export default FlowsForm;
