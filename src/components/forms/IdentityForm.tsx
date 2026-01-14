import { useProject } from '@/contexts/ProjectContext';
import { TEMPLATES, ToneOfVoice, AssistantType } from '@/types/prompt';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Check, Info, Sparkles, Stars, Smile, AlertCircle } from 'lucide-react';

const TONE_OPTIONS: { value: ToneOfVoice; label: string; emoji: string }[] = [
  { value: 'acolhedor', label: 'Acolhedor e empático', emoji: '😊' },
  { value: 'formal', label: 'Formal e profissional', emoji: '💼' },
  { value: 'direto', label: 'Direto e objetivo', emoji: '🎯' },
  { value: 'consultivo', label: 'Consultivo e prestativo', emoji: '🤝' },
  { value: 'tecnico', label: 'Técnico e especializado', emoji: '🏥' },
];

const TRAITS_OPTIONS = [
  { trait: 'Paciente e claro', description: 'Explica com calma, repete quando necessário', icon: '🎯' },
  { trait: 'Eficiente e organizado', description: 'Vai direto ao ponto, sem enrolação', icon: '⚡' },
  { trait: 'Proativo', description: 'Antecipa necessidades e oferece soluções', icon: '🚀' },
  { trait: 'Jovial e descontraído', description: 'Tom leve e amigável, menos formal', icon: '😄' },
  { trait: 'Corporativo', description: 'Linguagem empresarial e protocolar', icon: '💼' },
];

// Premium Section Badge Component
const SectionBadge = ({ number }: { number: number }) => (
  <div 
    className="relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
    style={{
      background: 'radial-gradient(circle, #00FF94 0%, #059669 100%)',
      boxShadow: '0 0 20px rgba(0,255,148,0.4)',
    }}
  >
    <div 
      className="absolute inset-[2px] rounded-full"
      style={{
        border: '2px solid rgba(255,255,255,0.3)',
      }}
    />
    <span className="font-black text-2xl text-black relative z-10">{number}</span>
  </div>
);

// Premium Input Component
const PremiumInput = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  label, 
  required = false,
  helpText 
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  helpText?: string;
}) => (
  <div className="space-y-3">
    <Label htmlFor={id} className="text-white font-semibold text-lg block">
      {label} {required && <span className="text-[#00FF94]">*</span>}
    </Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-14 px-5 py-4 text-base text-gray-200 placeholder:text-gray-500 placeholder:italic rounded-xl border-2 border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 transition-all duration-300 focus:border-[#00FF94] focus:ring-4 focus:ring-[#00FF94]/20 focus:-translate-y-0.5"
      style={{
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
      }}
    />
    {helpText && (
      <p className="flex items-center gap-2 text-gray-400 text-sm mt-2">
        <Info className="w-4 h-4 text-gray-500" />
        {helpText}
      </p>
    )}
  </div>
);

// Premium Type Card Component
const TypeCard = ({ 
  template, 
  isSelected, 
  onClick, 
  isFullWidth = false 
}: {
  template: typeof TEMPLATES[0];
  isSelected: boolean;
  onClick: () => void;
  isFullWidth?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
      isFullWidth ? 'col-span-2' : ''
    }`}
    style={{
      background: isSelected 
        ? 'linear-gradient(135deg, rgba(0,255,148,0.08) 0%, rgba(0,255,148,0.03) 100%)'
        : 'linear-gradient(135deg, rgba(24,24,27,0.6) 0%, rgba(39,39,42,0.4) 100%)',
      backdropFilter: 'blur(20px)',
      borderColor: isSelected ? '#00FF94' : 'rgba(113,113,122,0.3)',
      boxShadow: isSelected 
        ? '0 0 30px rgba(0,255,148,0.3), 0 8px 24px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,255,148,0.1)'
        : '0 4px 6px rgba(0,0,0,0.3)',
      transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
    }}
  >
    {isSelected && (
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: '#00FF94' }}
      />
    )}
    
    {isSelected && (
      <div 
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center animate-scale-in"
        style={{ 
          background: '#00FF94',
          boxShadow: '0 0 12px rgba(0,255,148,0.6)',
        }}
      >
        <Check className="w-4 h-4 text-black" strokeWidth={3} />
      </div>
    )}
    
    <div className="flex items-center gap-4">
      <span 
        className="text-4xl"
        style={{ 
          filter: isSelected ? `drop-shadow(0 0 10px ${template.color})` : 'none',
        }}
      >
        {template.icon}
      </span>
      <div>
        <p className={`font-semibold text-lg ${isSelected ? 'text-[#00FF94]' : 'text-white'}`}>
          {template.name}
        </p>
        <p className="text-gray-300 text-sm mt-1 line-clamp-2 leading-relaxed">
          {template.description}
        </p>
      </div>
    </div>
  </button>
);

// Premium Tone Card Component
const ToneCard = ({ 
  tone, 
  isSelected, 
  onClick, 
  isFullWidth = false 
}: {
  tone: typeof TONE_OPTIONS[0];
  isSelected: boolean;
  onClick: () => void;
  isFullWidth?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
      isFullWidth ? 'col-span-2' : ''
    }`}
    style={{
      background: isSelected 
        ? 'linear-gradient(135deg, rgba(0,255,148,0.08) 0%, rgba(0,255,148,0.03) 100%)'
        : 'linear-gradient(135deg, rgba(24,24,27,0.6) 0%, rgba(39,39,42,0.4) 100%)',
      backdropFilter: 'blur(20px)',
      borderColor: isSelected ? '#00FF94' : 'rgba(113,113,122,0.3)',
      boxShadow: isSelected 
        ? '0 0 30px rgba(0,255,148,0.3), 0 8px 24px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,255,148,0.1)'
        : '0 4px 6px rgba(0,0,0,0.3)',
      transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
    }}
  >
    {isSelected && (
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: '#00FF94' }}
      />
    )}
    
    {isSelected && (
      <div 
        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
        style={{ 
          background: '#00FF94',
          boxShadow: '0 0 12px rgba(0,255,148,0.6)',
        }}
      >
        <Check className="w-3 h-3 text-black" strokeWidth={3} />
      </div>
    )}
    
    <div className="flex items-center gap-3">
      <span className="text-3xl">{tone.emoji}</span>
      <span className={`font-medium text-base ${isSelected ? 'text-[#00FF94]' : 'text-white'}`}>
        {tone.label}
      </span>
    </div>
  </button>
);

// Ultra Premium Trait Card Component
const UltraPremiumTraitCard = ({ 
  trait, 
  description,
  icon,
  isChecked, 
  onChange,
  index
}: {
  trait: string;
  description: string;
  icon: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  index: number;
}) => (
  <label
    className="relative flex items-start gap-5 p-6 rounded-2xl cursor-pointer transition-all group overflow-hidden"
    style={{
      background: isChecked 
        ? 'linear-gradient(135deg, rgba(0,255,148,0.12) 0%, rgba(0,255,148,0.05) 100%)'
        : 'linear-gradient(135deg, rgba(39,39,42,0.5) 0%, rgba(24,24,27,0.8) 100%)',
      backdropFilter: 'blur(12px)',
      border: `2px solid ${isChecked ? '#00FF94' : 'rgba(113,113,122,0.25)'}`,
      boxShadow: isChecked 
        ? '0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(0,255,148,0.25), inset 0 1px 0 rgba(0,255,148,0.2)'
        : '0 4px 12px rgba(0,0,0,0.3)',
      minHeight: '110px',
      animationDelay: `${index * 50}ms`,
      transform: isChecked ? 'translateY(-4px)' : 'translateY(0)',
      transitionDuration: '400ms',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  >
    {/* Shine effect on hover */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
      }}
    />
    
    {/* Left accent bar when checked */}
    {isChecked && (
      <div 
        className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-2xl animate-scale-in"
        style={{ 
          background: 'linear-gradient(180deg, #00FF94 0%, #059669 100%)',
          boxShadow: '0 0 12px rgba(0,255,148,0.6)',
        }}
      />
    )}

    {/* Decorative icon */}
    <span 
      className="absolute top-4 right-4 text-xl transition-all duration-300"
      style={{
        opacity: isChecked ? 0.4 : 0.15,
        filter: isChecked ? 'drop-shadow(0 0 8px rgba(0,255,148,0.5))' : 'none',
      }}
    >
      {icon}
    </span>

    {/* Ultra Premium Checkbox */}
    <div 
      className="relative w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-300"
      style={{
        background: isChecked 
          ? 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)'
          : 'rgba(0,0,0,0.6)',
        border: `3px solid ${isChecked ? '#00FF94' : 'rgba(113,113,122,0.5)'}`,
        boxShadow: isChecked 
          ? '0 0 16px rgba(0,255,148,0.7), inset 0 1px 2px rgba(255,255,255,0.3)'
          : 'inset 0 2px 4px rgba(0,0,0,0.3)',
      }}
    >
      {isChecked && (
        <Check 
          className="w-4 h-4 text-black animate-scale-in" 
          strokeWidth={3}
          style={{
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
          }}
        />
      )}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label={trait}
      />
    </div>
    
    {/* Content */}
    <div className="flex-1 flex flex-col gap-2">
      <span 
        className="font-semibold text-lg leading-tight transition-colors duration-200"
        style={{
          color: isChecked ? '#00FF94' : 'white',
          letterSpacing: '-0.01em',
        }}
      >
        {trait}
      </span>
      <span 
        className="text-sm leading-relaxed font-medium transition-colors duration-200"
        style={{
          color: isChecked ? 'rgb(209, 213, 219)' : 'rgb(156, 163, 175)',
        }}
      >
        {description}
      </span>
    </div>
  </label>
);

// Ultra Premium Toggle Switch
const UltraPremiumToggle = ({ 
  checked, 
  onChange 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="relative flex-shrink-0 transition-all duration-400"
    style={{
      width: '68px',
      height: '36px',
      borderRadius: '9999px',
      background: checked 
        ? 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)'
        : 'rgba(113,113,122,0.4)',
      border: `2px solid ${checked ? '#00FF94' : 'rgba(113,113,122,0.6)'}`,
      boxShadow: checked 
        ? '0 0 24px rgba(0,255,148,0.5), inset 0 1px 2px rgba(255,255,255,0.2)'
        : 'inset 0 2px 4px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  >
    {/* Icons inside track */}
    <span 
      className="absolute left-2 top-1/2 -translate-y-1/2 text-lg transition-opacity duration-300"
      style={{ opacity: checked ? 0.7 : 0 }}
    >
      😊
    </span>
    <span 
      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm transition-opacity duration-300"
      style={{ 
        opacity: checked ? 0 : 0.5,
        color: 'rgb(161, 161, 170)',
      }}
    >
      ✕
    </span>

    {/* Thumb */}
    <div 
      className="absolute top-[2px] w-7 h-7 rounded-full bg-white transition-all"
      style={{
        left: checked ? 'calc(100% - 32px)' : '4px',
        boxShadow: checked 
          ? '0 2px 8px rgba(0,0,0,0.2), 0 0 12px rgba(0,255,148,0.3)'
          : '0 2px 8px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
        transitionDuration: '400ms',
        transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
    />
  </button>
);

const IdentityForm = () => {
  const { project, updateIdentity } = useProject();

  if (!project) return null;

  const { identity } = project;

  const handleTraitChange = (trait: string, checked: boolean) => {
    const newTraits = checked
      ? [...identity.additionalTraits, trait]
      : identity.additionalTraits.filter((t) => t !== trait);
    updateIdentity('additionalTraits', newTraits);
  };

  const handleTypeSelect = (type: AssistantType) => {
    updateIdentity('type', type);
    if (type !== 'personalizado') {
      updateIdentity('customType', '');
    }
  };

  const selectedTraitsCount = identity.additionalTraits.length;

  return (
    <div className="space-y-16">
      {/* Premium Header */}
      <div className="relative">
        <div 
          className="absolute -top-4 left-0 right-0 h-0.5 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00FF94 50%, transparent 100%)',
          }}
        />
        
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="p-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,148,0.2) 0%, rgba(0,255,148,0.05) 100%)',
              boxShadow: '0 0 20px rgba(0,255,148,0.2)',
            }}
          >
            <Bot className="w-8 h-8 text-[#00FF94]" />
          </div>
          <h1 
            className="font-bold text-4xl tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #00FF94 0%, #34d399 50%, #00FF94 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(0,255,148,0.3)',
            }}
          >
            Identidade do Assistente
          </h1>
        </div>
        
        <p className="text-gray-300 text-xl leading-relaxed max-w-2xl">
          Defina a personalidade e características do seu assistente
        </p>
      </div>

      {/* Section 1: Basic Info */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <SectionBadge number={1} />
          <h2 className="text-2xl font-bold text-white">Informações Básicas</h2>
        </div>

        <div className="space-y-6">
          <PremiumInput
            id="companyName"
            value={identity.companyName}
            onChange={(value) => updateIdentity('companyName', value)}
            placeholder="Ex: Clínica Moreira, Vazel Advocacia, Royal KL Musical"
            label="Nome da Empresa/Negócio"
            required
            helpText="Como sua empresa é conhecida pelos clientes"
          />

          <PremiumInput
            id="name"
            value={identity.name}
            onChange={(value) => updateIdentity('name', value)}
            placeholder="Ex: Maria, João, Wellington, KATH"
            label="Nome do Assistente"
            required
            helpText="Como o assistente se apresentará aos usuários"
          />

          <div className="space-y-4">
            <Label className="text-white font-semibold text-lg block">
              Tipo de Assistente <span className="text-[#00FF94]">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEMPLATES.map((template) => (
                <TypeCard
                  key={template.id}
                  template={template}
                  isSelected={identity.type === template.id}
                  onClick={() => handleTypeSelect(template.id)}
                  isFullWidth={template.id === 'personalizado'}
                />
              ))}
            </div>
          </div>

          {identity.type === 'personalizado' && (
            <div className="animate-fade-in space-y-3">
              <Label htmlFor="customType" className="text-white font-semibold text-lg block">
                Descreva o tipo do seu assistente
              </Label>
              <div className="relative">
                <Textarea
                  id="customType"
                  value={identity.customType || ''}
                  onChange={(e) => updateIdentity('customType', e.target.value)}
                  placeholder="Ex: Assistente de vendas B2B para distribuidora de materiais de construção, focado em atendimento consultivo para lojistas..."
                  className="min-h-[160px] p-5 text-base text-gray-200 placeholder:text-gray-500 placeholder:italic leading-relaxed rounded-2xl border-2 border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 transition-all duration-300 focus:border-[#00FF94] focus:ring-4 focus:ring-[#00FF94]/20 resize-y"
                  style={{
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
              <p className="flex items-center gap-2 text-gray-400 text-sm">
                <Sparkles className="w-4 h-4 text-[#00FF94]" />
                Descreva detalhadamente o tipo de assistente que você precisa
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Personality */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <SectionBadge number={2} />
          <h2 className="text-2xl font-bold text-white">Personalidade e Tom de Voz</h2>
        </div>

        <div className="space-y-8">
          {/* Tone of Voice */}
          <div className="space-y-4">
            <Label className="text-white font-semibold text-lg block">
              Tom de Voz Principal <span className="text-[#00FF94]">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TONE_OPTIONS.map((tone, index) => (
                <ToneCard
                  key={tone.value}
                  tone={tone}
                  isSelected={identity.toneOfVoice === tone.value}
                  onClick={() => updateIdentity('toneOfVoice', tone.value)}
                  isFullWidth={index === TONE_OPTIONS.length - 1}
                />
              ))}
            </div>
          </div>

          {/* ULTRA PREMIUM Traits Section */}
          <div 
            className="relative p-10 rounded-3xl mt-8 overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at top left, rgba(24,24,27,0.6) 0%, rgba(9,9,11,0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(0,255,148,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Background decoration */}
            <div 
              className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-[0.03] blur-3xl animate-pulse"
              style={{ background: 'radial-gradient(circle, #00FF94 0%, transparent 70%)' }}
            />
            
            {/* Section Header */}
            <div className="relative mb-8 pb-5 border-b border-[#00FF94]/10">
              <div className="flex items-center gap-3 mb-2">
                <Stars className="w-6 h-6 text-[#00FF94]" />
                <h3 
                  className="font-bold text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, white 0%, rgb(229,231,235) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Características Adicionais do Assistente
                </h3>
                <span 
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ml-3"
                  style={{
                    background: 'rgba(0,255,148,0.1)',
                    border: '1px solid rgba(0,255,148,0.3)',
                    color: '#00FF94',
                  }}
                >
                  Opcional
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-base font-medium">
                <Info className="w-4 h-4" />
                <span>Selecione traços complementares para personalizar ainda mais</span>
              </div>
            </div>

            {/* Grid of Traits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {TRAITS_OPTIONS.map(({ trait, description, icon }, index) => (
                <UltraPremiumTraitCard
                  key={trait}
                  trait={trait}
                  description={description}
                  icon={icon}
                  isChecked={identity.additionalTraits.includes(trait)}
                  onChange={(checked) => handleTraitChange(trait, checked)}
                  index={index}
                />
              ))}
            </div>

            {/* Feedback messages */}
            {selectedTraitsCount === 0 && (
              <div className="flex items-center gap-2 text-gray-500 text-sm italic">
                <Info className="w-4 h-4" />
                <span>Nenhuma característica selecionada</span>
              </div>
            )}
            {selectedTraitsCount > 3 && (
              <div 
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg mt-4"
                style={{
                  background: 'rgba(255,159,10,0.1)',
                  border: '1px solid rgba(255,159,10,0.3)',
                  color: 'rgb(251,191,36)',
                }}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Muitas características podem deixar o tom inconsistente</span>
              </div>
            )}
          </div>

          {/* ULTRA PREMIUM Emojis Toggle */}
          <div 
            className="relative p-7 rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(39,39,42,0.6) 0%, rgba(24,24,27,0.8) 100%)',
              backdropFilter: 'blur(12px)',
              border: `2px solid ${identity.useEmojis ? '#00FF94' : 'rgba(113,113,122,0.25)'}`,
              boxShadow: identity.useEmojis 
                ? '0 0 30px rgba(0,255,148,0.2), 0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {/* Background emoji decoration */}
            <span 
              className="absolute -right-5 -bottom-5 text-[120px] blur-sm select-none pointer-events-none"
              style={{ opacity: 0.03 }}
            >
              😊
            </span>

            <div className="relative flex items-center justify-between gap-6">
              {/* Left side content */}
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(0,255,148,0.1)',
                    boxShadow: '0 0 12px rgba(0,255,148,0.2)',
                  }}
                >
                  <Smile className="w-6 h-6 text-[#00FF94]" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-white font-bold text-xl">Usar Emojis?</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed font-medium max-w-lg">
                    Recomendado para atendimentos informais. Não recomendado para B2B e jurídico.
                  </p>
                  <div 
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      color: 'rgb(96,165,250)',
                    }}
                  >
                    <Info className="w-3 h-3" />
                    Aumenta engajamento em canais informais
                  </div>
                </div>
              </div>

              {/* Right side toggle */}
              <UltraPremiumToggle
                checked={identity.useEmojis}
                onChange={(checked) => updateIdentity('useEmojis', checked)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer indicator */}
      <div 
        className="flex items-center justify-center gap-3 py-6 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,148,0.05) 0%, transparent 100%)',
        }}
      >
        <Sparkles className="w-5 h-5 text-[#00FF94]" />
        <span className="text-gray-400 text-sm">
          Continue configurando nas próximas seções
        </span>
      </div>
    </div>
  );
};

export default IdentityForm;
