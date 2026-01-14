export type AssistantType = 
  | 'atendimento' 
  | 'qualificacao' 
  | 'b2b' 
  | 'suporte' 
  | 'personalizado';

export type ToneOfVoice = 
  | 'acolhedor' 
  | 'formal' 
  | 'direto' 
  | 'consultivo' 
  | 'tecnico';

export type Channel = 'whatsapp' | 'chat-web' | 'instagram' | 'telegram' | 'outros';

export type Pronoun = 'voce' | 'senhor' | 'ambos';

export interface WorkingHours {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

export interface IdentityData {
  name: string;
  type: AssistantType;
  customType?: string; // New field for custom type description
  companyName: string;
  channels: Channel[];
  toneOfVoice: ToneOfVoice;
  additionalTraits: string[];
  useEmojis: boolean;
  pronoun: Pronoun;
}

export interface ContextData {
  workingHours: WorkingHours[];
  timezone: string;
  address: string;
  mapsLink: string;
  phones: string[];
  email: string;
  instagram: string;
  website: string;
  products: string;
  paymentMethods: string;
  pricingPolicy: string;
}

export interface QualificationCriteria {
  id: string;
  text: string;
  required: boolean;
}

export interface Objection {
  id: string;
  objection: string;
  response: string;
}

export interface FlowsData {
  openingMessage: string;
  qualificationQuestions: string[];
  // Atendimento
  requiredDataForScheduling: string[];
  cancellationPolicy: string;
  reschedulingPolicy: string;
  // Qualificação
  qualificationCriteria: QualificationCriteria[];
  detailedQuestions: string[];
  objections: Objection[];
  // B2B
  targetAudience: string;
  pfPolicy: 'nao-atende' | 'atende-ambos' | 'apenas-pj-excecoes';
  transferSituations: string[];
  // Suporte
  faqItems: { question: string; answer: string }[];
  supportTopics: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'padrao' | 'agendamento' | 'comunicacao' | 'gestao' | 'arquivos' | 'outras';
  enabled: boolean;
  whenToUse: string;
}

export interface ToolsData {
  tools: Tool[];
  allowedEmojis: string[];
  maxReactionsPerConversation: number;
}

export interface ValidationRule {
  id: string;
  field: string;
  format: string;
  example: string;
}

export interface BusinessRule {
  id: string;
  text: string;
}

export interface RulesData {
  messageFormatting: string[];
  contentRestrictions: string;
  validationRules: ValidationRule[];
  businessRules: BusinessRule[];
  deadlinesRestrictions: string;
}

export interface SpecialCase {
  id: string;
  title: string;
  description: string;
  action: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  meaning: string;
}

export interface FinalizationData {
  noResponseBehavior: 'aguardar' | 'lembrete' | 'finalizar';
  reminderMinutes: number;
  aggressiveClientBehavior: string;
  outsideHoursBehavior: 'informar' | 'qualificar' | 'atender';
  specialCases: SpecialCase[];
  criticalObservations: string[];
  glossary: GlossaryItem[];
  projectName: string;
  projectDescription: string;
  tags: string[];
}

export interface ProjectData {
  id: string;
  name: string;
  template: AssistantType;
  createdAt: string;
  updatedAt: string;
  identity: IdentityData;
  context: ContextData;
  flows: FlowsData;
  tools: ToolsData;
  rules: RulesData;
  finalization: FinalizationData;
  generatedPrompt?: string;
}

export interface Template {
  id: AssistantType;
  name: string;
  icon: string;
  color: string;
  colorClass: string;
  description: string;
  examples: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'atendimento',
    name: 'Atendimento e Agendamento',
    icon: '📅',
    color: '#00FF94',
    colorClass: 'template-green',
    description: 'Para clínicas, consultórios e serviços que precisam agendar consultas',
    examples: 'Secretária virtual, agendamento médico, reservas',
  },
  {
    id: 'qualificacao',
    name: 'Qualificação de Leads',
    icon: '🎯',
    color: '#4A9EFF',
    colorClass: 'template-blue',
    description: 'Para escritórios jurídicos, consultorias e serviços B2C',
    examples: 'Qualificação jurídica, pré-venda, captação de clientes',
  },
  {
    id: 'b2b',
    name: 'Atendimento B2B',
    icon: '🏢',
    color: '#8B5CF6',
    colorClass: 'template-purple',
    description: 'Para atacado, distribuidoras e vendas corporativas',
    examples: 'Lojistas, revendedores, parceiros comerciais',
  },
  {
    id: 'suporte',
    name: 'Suporte e FAQ',
    icon: '💬',
    color: '#F97316',
    colorClass: 'template-orange',
    description: 'Para atendimento a clientes, dúvidas e informações gerais',
    examples: 'Suporte técnico, FAQ automatizado, informações',
  },
  {
    id: 'personalizado',
    name: 'Personalizado',
    icon: '⚙️',
    color: '#6B7280',
    colorClass: 'template-gray',
    description: 'Configure do zero conforme suas necessidades',
    examples: 'Casos específicos, fluxos customizados',
  },
];

export const DEFAULT_TOOLS: Tool[] = [
  { id: 'refletir', name: 'Refletir', description: 'Análise interna antes de ações complexas', category: 'padrao', enabled: true, whenToUse: '' },
  { id: 'reagir_mensagem', name: 'Reagir_mensagem', description: 'Adicionar reações (emojis limitados)', category: 'padrao', enabled: true, whenToUse: '' },
  { id: 'enviar_texto_separado', name: 'Enviar_texto_separado', description: 'Enviar links/contatos separadamente', category: 'padrao', enabled: true, whenToUse: '' },
  { id: 'buscar_janelas', name: 'Buscar_janelas_disponiveis', description: 'Buscar horários disponíveis', category: 'agendamento', enabled: false, whenToUse: '' },
  { id: 'criar_agendamento', name: 'Criar_agendamento', description: 'Criar novo agendamento', category: 'agendamento', enabled: false, whenToUse: '' },
  { id: 'buscar_agendamentos', name: 'Buscar_agendamentos_do_contato', description: 'Buscar agendamentos existentes', category: 'agendamento', enabled: false, whenToUse: '' },
  { id: 'atualizar_agendamento', name: 'Atualizar_agendamento', description: 'Atualizar agendamento existente', category: 'agendamento', enabled: false, whenToUse: '' },
  { id: 'cancelar_agendamento', name: 'Cancelar_agendamento', description: 'Cancelar agendamento', category: 'agendamento', enabled: false, whenToUse: '' },
  { id: 'alterar_preferencia', name: 'Alterar_preferencia_audio_texto', description: 'Alterar preferência de comunicação', category: 'comunicacao', enabled: false, whenToUse: '' },
  { id: 'escalar_humano', name: 'Escalar_humano', description: 'Transferir para atendimento humano', category: 'gestao', enabled: false, whenToUse: '' },
  { id: 'notificar_transferencia', name: 'Notificar_transferencia', description: 'Enviar notificação ao time', category: 'gestao', enabled: false, whenToUse: '' },
  { id: 'alerta_cancelamento', name: 'Enviar_alerta_de_cancelamento', description: 'Alertar sobre cancelamento', category: 'gestao', enabled: false, whenToUse: '' },
  { id: 'criar_cobranca', name: 'Criar_ou_buscar_cobranca', description: 'Gerenciar cobranças', category: 'gestao', enabled: false, whenToUse: '' },
  { id: 'listar_arquivos', name: 'Listar_arquivos', description: 'Listar arquivos disponíveis', category: 'arquivos', enabled: false, whenToUse: '' },
  { id: 'baixar_arquivo', name: 'Baixar_e_enviar_arquivo', description: 'Baixar e enviar arquivos', category: 'arquivos', enabled: false, whenToUse: '' },
];

export const DEFAULT_WORKING_HOURS: WorkingHours[] = [
  { day: 'Segunda-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Terça-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Quarta-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Quinta-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Sexta-feira', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Sábado', enabled: true, start: '08:00', end: '12:00' },
  { day: 'Domingo', enabled: false, start: '08:00', end: '12:00' },
];

export const TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
];