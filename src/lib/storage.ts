import { ProjectData, AssistantType, DEFAULT_WORKING_HOURS, DEFAULT_TOOLS } from '@/types/prompt';

const STORAGE_KEY = 'promptgen_projects';
const DRAFT_KEY = 'promptgen_draft';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const createEmptyProject = (template: AssistantType): ProjectData => {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    name: '',
    template,
    createdAt: now,
    updatedAt: now,
    identity: {
      name: '',
      type: template,
      companyName: '',
      channels: ['whatsapp'],
      toneOfVoice: 'acolhedor',
      additionalTraits: [],
      useEmojis: true,
      pronoun: 'voce',
    },
    context: {
      workingHours: DEFAULT_WORKING_HOURS,
      timezone: 'America/Sao_Paulo',
      address: '',
      mapsLink: '',
      phones: [''],
      email: '',
      instagram: '',
      website: '',
      products: '',
      paymentMethods: '',
      pricingPolicy: '',
    },
    flows: {
      openingMessage: '',
      qualificationQuestions: [''],
      requiredDataForScheduling: ['nome_completo', 'data_nascimento', 'telefone'],
      cancellationPolicy: '',
      reschedulingPolicy: '',
      qualificationCriteria: [],
      detailedQuestions: [''],
      objections: [],
      targetAudience: '',
      pfPolicy: 'nao-atende',
      transferSituations: [''],
      faqItems: [],
      supportTopics: [],
    },
    tools: {
      tools: DEFAULT_TOOLS.map(t => ({ ...t })),
      allowedEmojis: ['✅', '❤️', '👍', '📋', '😀'],
      maxReactionsPerConversation: 3,
    },
    rules: {
      messageFormatting: [
        'Máximo 3-4 linhas por mensagem',
        'Máximo 1-2 perguntas por vez',
        'Evitar uso excessivo de markdown',
        'Consolidar informações relacionadas',
      ],
      contentRestrictions: '',
      validationRules: [
        { id: generateId(), field: 'Nome', format: 'Mínimo 2 palavras', example: 'João Silva' },
        { id: generateId(), field: 'Telefone', format: '(XX) XXXXX-XXXX', example: '(11) 99999-9999' },
      ],
      businessRules: [],
      deadlinesRestrictions: '',
    },
    finalization: {
      noResponseBehavior: 'aguardar',
      reminderMinutes: 30,
      aggressiveClientBehavior: 'Manter profissionalismo e transferir para atendimento humano se persistir',
      outsideHoursBehavior: 'informar',
      specialCases: [],
      criticalObservations: [],
      glossary: [],
      projectName: '',
      projectDescription: '',
      tags: [],
    },
  };
};

export const saveProject = (project: ProjectData): void => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  project.updatedAt = new Date().toISOString();
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const getProjects = (): ProjectData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getProject = (id: string): ProjectData | null => {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
};

export const deleteProject = (id: string): void => {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const saveDraft = (project: ProjectData): void => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(project));
};

export const getDraft = (): ProjectData | null => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearDraft = (): void => {
  localStorage.removeItem(DRAFT_KEY);
};

export const exportProject = (project: ProjectData): string => {
  return JSON.stringify(project, null, 2);
};

export const importProject = (json: string): ProjectData | null => {
  try {
    const project = JSON.parse(json) as ProjectData;
    project.id = generateId();
    project.createdAt = new Date().toISOString();
    project.updatedAt = new Date().toISOString();
    return project;
  } catch {
    return null;
  }
};
