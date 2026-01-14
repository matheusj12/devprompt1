import { ProjectData, AssistantType, ToneOfVoice, DEFAULT_TOOLS, DEFAULT_WORKING_HOURS } from '@/types/prompt';

interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  company_type: string | null;
  assistant_name: string | null;
  assistant_type: string | null;
  greeting_message: string | null;
  qualification_questions: string[] | null;
  tone: string | null;
  characteristics: string[] | null;
  use_emojis: boolean | null;
  available_tools: string[] | null;
  communication_rules: string[] | null;
  content_restrictions: string | null;
  critical_reminders: string[] | null;
  no_response_action: string | null;
  reminder_minutes: number | null;
  aggressive_client_response: string | null;
  out_of_hours_action: string | null;
  out_of_hours_message: string | null;
}

const generateId = (): string => {
  return 'project_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const mapAssistantType = (type: string | null): AssistantType => {
  const typeMap: Record<string, AssistantType> = {
    'atendimento': 'atendimento',
    'qualificacao': 'qualificacao',
    'suporte': 'suporte',
    'b2b': 'b2b',
    'personalizado': 'personalizado',
  };
  return typeMap[type || 'personalizado'] || 'personalizado';
};

export const mapTone = (tone: string | null): ToneOfVoice => {
  const toneMap: Record<string, ToneOfVoice> = {
    'acolhedor': 'acolhedor',
    'formal': 'formal',
    'direto': 'direto',
    'consultivo': 'consultivo',
    'tecnico': 'tecnico',
  };
  return toneMap[tone || 'acolhedor'] || 'acolhedor';
};

export const mapNoResponseBehavior = (action: string | null): 'aguardar' | 'lembrete' | 'finalizar' => {
  const actionMap: Record<string, 'aguardar' | 'lembrete' | 'finalizar'> = {
    'wait': 'aguardar',
    'send_reminder': 'lembrete',
    'finalize': 'finalizar',
  };
  return actionMap[action || 'aguardar'] || 'aguardar';
};

export const mapOutsideHoursBehavior = (action: string | null): 'informar' | 'qualificar' | 'atender' => {
  const actionMap: Record<string, 'informar' | 'qualificar' | 'atender'> = {
    'inform_only': 'informar',
    'inform_and_allow': 'qualificar',
    'attend_24_7': 'atender',
  };
  return actionMap[action || 'informar'] || 'informar';
};

export const createProjectFromTemplate = (template: PromptTemplate): ProjectData => {
  const now = new Date().toISOString();
  const assistantType = mapAssistantType(template.assistant_type);
  
  // Map available tools from template to enabled tools
  const tools = DEFAULT_TOOLS.map(tool => ({
    ...tool,
    enabled: template.available_tools?.some(t => 
      t.toLowerCase().includes(tool.name.toLowerCase()) ||
      tool.description.toLowerCase().includes(t.toLowerCase())
    ) || tool.enabled,
  }));

  return {
    id: generateId(),
    name: template.name,
    template: assistantType,
    createdAt: now,
    updatedAt: now,
    identity: {
      name: template.assistant_name || '',
      type: assistantType,
      companyName: template.company_type || '',
      channels: ['whatsapp'],
      toneOfVoice: mapTone(template.tone),
      additionalTraits: template.characteristics || [],
      useEmojis: template.use_emojis || false,
      pronoun: 'voce',
    },
    context: {
      workingHours: DEFAULT_WORKING_HOURS,
      timezone: 'America/Sao_Paulo',
      address: '',
      mapsLink: '',
      phones: [],
      email: '',
      instagram: '',
      website: '',
      products: '',
      paymentMethods: '',
      pricingPolicy: '',
    },
    flows: {
      openingMessage: template.greeting_message || '',
      qualificationQuestions: template.qualification_questions || [],
      requiredDataForScheduling: [],
      cancellationPolicy: '',
      reschedulingPolicy: '',
      qualificationCriteria: [],
      detailedQuestions: [],
      objections: [],
      targetAudience: '',
      pfPolicy: 'atende-ambos',
      transferSituations: [],
      faqItems: [],
      supportTopics: [],
    },
    tools: {
      tools,
      allowedEmojis: template.use_emojis ? ['👍', '❤️', '😊', '🎉', '✅'] : [],
      maxReactionsPerConversation: 3,
    },
    rules: {
      messageFormatting: template.communication_rules || [],
      contentRestrictions: template.content_restrictions || '',
      validationRules: [],
      businessRules: [],
      deadlinesRestrictions: '',
    },
    finalization: {
      noResponseBehavior: mapNoResponseBehavior(template.no_response_action),
      reminderMinutes: template.reminder_minutes || 30,
      aggressiveClientBehavior: template.aggressive_client_response || '',
      outsideHoursBehavior: mapOutsideHoursBehavior(template.out_of_hours_action),
      specialCases: [],
      criticalObservations: template.critical_reminders || [],
      glossary: [],
      projectName: `${template.name} - Novo`,
      projectDescription: template.description || '',
      tags: [template.category || 'geral'],
    },
  };
};
