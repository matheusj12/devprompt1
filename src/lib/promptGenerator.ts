import { ProjectData, TEMPLATES } from '@/types/prompt';

const getToneDescription = (tone: string): string => {
  const tones: Record<string, string> = {
    acolhedor: 'Acolhedor e empático, transmitindo calor humano e compreensão',
    formal: 'Formal e profissional, mantendo sempre a postura corporativa',
    direto: 'Direto e objetivo, priorizando eficiência na comunicação',
    consultivo: 'Consultivo e prestativo, atuando como um verdadeiro especialista',
    tecnico: 'Técnico e especializado, com domínio profundo do assunto',
  };
  return tones[tone] || tone;
};

const formatWorkingHours = (hours: ProjectData['context']['workingHours']): string => {
  return hours
    .filter(h => h.enabled)
    .map(h => `- ${h.day}: ${h.start} às ${h.end}`)
    .join('\n');
};

const formatTools = (tools: ProjectData['tools']['tools']): string => {
  // Filter only enabled tools
  const enabledTools = tools.filter(t => t.enabled);
  
  // Always include basic tools description
  let result = `## Ferramentas Básicas (sempre disponíveis)
- **Análise e reflexão interna**: O assistente analisa a situação antes de responder
- **Reações com emojis**: Pode reagir com emojis às mensagens de forma moderada
- **Envio separado**: Envia links e contatos em mensagens separadas para melhor visualização`;

  // Group advanced tools by category
  const advancedTools = enabledTools.filter(t => t.category !== 'padrao');
  
  if (advancedTools.length > 0) {
    result += '\n\n## Ferramentas Avançadas\n';
    result += advancedTools
      .map(t => {
        let text = `- **${t.name}**: ${t.description}`;
        if (t.whenToUse) {
          text += `\n  - Quando usar: ${t.whenToUse}`;
        }
        return text;
      })
      .join('\n');
  }

  return result;
};

export const generatePrompt = (project: ProjectData): string => {
  const { identity, context, flows, tools, rules, finalization } = project;
  const template = TEMPLATES.find(t => t.id === identity.type);
  
  // Build type description
  let typeDescription = template ? template.name : 'Personalizado';
  if (identity.type === 'personalizado' && identity.customType) {
    typeDescription = identity.customType;
  }
  
  let prompt = `# PAPEL

<papel>
Você é ${identity.name}, assistente virtual de atendimento da ${identity.companyName}.
Tipo: ${typeDescription}
</papel>

---

# PERSONALIDADE E TOM DE VOZ

<personalidade>
## Tom Principal
${getToneDescription(identity.toneOfVoice)}

## Características
${identity.additionalTraits.length > 0 ? identity.additionalTraits.map(t => `- ${t}`).join('\n') : '- Profissional e atencioso'}

## Comunicação
- Uso de emojis: ${identity.useEmojis ? 'Sim, de forma moderada' : 'Não utilizar emojis'}

## Estilo de Mensagens
${rules.messageFormatting.map(r => `- ${r}`).join('\n')}
</personalidade>

---

# CONTEXTO ${identity.companyName.toUpperCase()}

<informacoes-${identity.companyName.toLowerCase().replace(/\s+/g, '-')}>
## Horário de Funcionamento
${formatWorkingHours(context.workingHours)}
Fuso horário: ${context.timezone}

${context.address ? `## Localização
${context.address}
${context.mapsLink ? `Link Google Maps: ${context.mapsLink}` : ''}` : ''}

## Contato
${context.phones.filter(p => p).map(p => `- Telefone: ${p}`).join('\n')}
${context.email ? `- E-mail: ${context.email}` : ''}
${context.instagram ? `- Instagram: ${context.instagram}` : ''}
${context.website ? `- Site: ${context.website}` : ''}

## Produtos/Serviços
${context.products || 'Não especificado'}

${context.paymentMethods ? `## Formas de Pagamento
${context.paymentMethods}` : ''}

${context.pricingPolicy ? `## Política de Preços
${context.pricingPolicy}` : ''}
</informacoes-${identity.companyName.toLowerCase().replace(/\s+/g, '-')}>

---

# SOP - PROCEDIMENTO OPERACIONAL PADRÃO

<sop>
## Mensagem de Abertura
${flows.openingMessage || 'Cumprimentar o cliente de forma cordial e perguntar como pode ajudar.'}

## Perguntas de Qualificação Inicial
${flows.qualificationQuestions.filter(q => q).map((q, i) => `${i + 1}. ${q}`).join('\n')}

${identity.type === 'atendimento' ? `## Dados Necessários para Agendamento
${flows.requiredDataForScheduling.map(d => `- ${d.replace('_', ' ')}`).join('\n')}

${flows.cancellationPolicy ? `## Política de Cancelamento
${flows.cancellationPolicy}` : ''}

${flows.reschedulingPolicy ? `## Política de Reagendamento
${flows.reschedulingPolicy}` : ''}` : ''}

${identity.type === 'qualificacao' ? `## Critérios de Qualificação
${flows.qualificationCriteria.map(c => `- ${c.text} ${c.required ? '(Obrigatório)' : '(Desejável)'}`).join('\n')}

## Perguntas Detalhadas
${flows.detailedQuestions.filter(q => q).map((q, i) => `${i + 1}. ${q}`).join('\n')}

${flows.objections.length > 0 ? `## Tratamento de Objeções
${flows.objections.map(o => `**Objeção:** "${o.objection}"
**Resposta:** "${o.response}"`).join('\n\n')}` : ''}` : ''}

${identity.type === 'b2b' ? `## Público-Alvo
${flows.targetAudience}

## Política de Atendimento
${flows.pfPolicy === 'nao-atende' ? 'Não atendemos pessoa física' : flows.pfPolicy === 'atende-ambos' ? 'Atendemos pessoa física e jurídica' : 'Apenas pessoa jurídica com exceções'}

## Situações de Transferência Imediata
${flows.transferSituations.filter(s => s).map(s => `- ${s}`).join('\n')}` : ''}

${identity.type === 'suporte' ? `## Base de Conhecimento / FAQ
${flows.faqItems.map(f => `**P:** ${f.question}
**R:** ${f.answer}`).join('\n\n')}

## Tópicos de Suporte
${flows.supportTopics.map(t => `- ${t}`).join('\n')}` : ''}
</sop>

---

# FERRAMENTAS DISPONÍVEIS

<ferramentas>
${formatTools(tools.tools)}
</ferramentas>

---

# REGRAS DE NEGÓCIO

<regras>
${rules.contentRestrictions ? `## Restrições de Conteúdo
${rules.contentRestrictions}` : ''}

${rules.businessRules.length > 0 ? `## Regras de Negócio
${rules.businessRules.map(r => `- ${r.text}`).join('\n')}` : ''}

${rules.deadlinesRestrictions ? `## Prazos e Restrições
${rules.deadlinesRestrictions}` : ''}
</regras>

---

# TRATAMENTO DE CASOS ESPECIAIS

<casos-especiais>
## Cliente Não Responde
${finalization.noResponseBehavior === 'aguardar' ? 'Aguardar silenciosamente' : finalization.noResponseBehavior === 'lembrete' ? `Enviar lembrete após ${finalization.reminderMinutes} minutos` : 'Finalizar atendimento automaticamente'}

## Cliente Agressivo ou Insatisfeito
${finalization.aggressiveClientBehavior || 'Manter profissionalismo e transferir para atendimento humano se persistir'}

## Atendimento Fora do Horário
${finalization.outsideHoursBehavior === 'informar' ? 'Informar horário de funcionamento e não prosseguir com atendimento' : finalization.outsideHoursBehavior === 'qualificar' ? 'Informar horário mas permitir qualificação inicial' : 'Atender normalmente (IA disponível 24/7)'}

${finalization.specialCases.length > 0 ? `## Outros Casos
${finalization.specialCases.map(c => `### ${c.title}
${c.description}
**Ação:** ${c.action}`).join('\n\n')}` : ''}
</casos-especiais>

---

# OBSERVAÇÕES FINAIS

<observacoes>
⚠️ **NUNCA ESQUEÇA:**
${finalization.criticalObservations.map(o => `- ${o}`).join('\n')}

${finalization.glossary.length > 0 ? `## Glossário
${finalization.glossary.map(g => `- **${g.term}**: ${g.meaning}`).join('\n')}` : ''}
</observacoes>

---

# INFORMAÇÕES DO SISTEMA

<sistema>
Data e Hora Atual: {{ $now.format('FFFF') }}
Projeto: ${finalization.projectName || project.name || identity.companyName}
${finalization.projectDescription ? `Descrição: ${finalization.projectDescription}` : ''}
${finalization.tags.length > 0 ? `Tags: ${finalization.tags.join(', ')}` : ''}
</sistema>`;

  return prompt;
};

export const generateSummary = (project: ProjectData) => {
  const { identity, flows, tools, rules, finalization } = project;
  const template = TEMPLATES.find(t => t.id === identity.type);
  
  const enabledTools = tools.tools.filter(t => t.enabled).length;
  const rulesCount = rules.businessRules.length;
  const specialCasesCount = finalization.specialCases.length;
  
  // Calculate completeness
  let filled = 0;
  let total = 0;
  
  // Identity checks
  total += 4;
  if (identity.name) filled++;
  if (identity.companyName) filled++;
  if (identity.toneOfVoice) filled++;
  if (identity.additionalTraits.length > 0) filled++;
  
  // Context checks
  total += 4;
  if (project.context.address) filled++;
  if (project.context.phones.some(p => p)) filled++;
  if (project.context.products) filled++;
  if (project.context.email) filled++;
  
  // Flows checks
  total += 3;
  if (flows.openingMessage) filled++;
  if (flows.qualificationQuestions.some(q => q)) filled++;
  if (identity.type === 'atendimento' && flows.requiredDataForScheduling.length > 0) filled++;
  
  // Tools check
  total += 1;
  if (enabledTools >= 3) filled++;
  
  // Rules check
  total += 1;
  if (rulesCount > 0 || rules.contentRestrictions) filled++;
  
  const completeness = Math.round((filled / total) * 100);
  
  // Complexity calculation
  let complexity = 1;
  if (enabledTools > 5) complexity++;
  if (rulesCount > 5) complexity++;
  if (flows.qualificationQuestions.filter(q => q).length > 3) complexity++;
  if (specialCasesCount > 2) complexity++;
  
  return {
    name: identity.name,
    type: template?.name || 'Personalizado',
    company: identity.companyName,
    tone: identity.toneOfVoice,
    channel: 'WhatsApp',
    flowsConfigured: flows.qualificationQuestions.filter(q => q).length,
    toolsEnabled: enabledTools,
    rulesCount,
    specialCasesCount,
    complexity,
    completeness,
  };
};