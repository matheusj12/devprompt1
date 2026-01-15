import { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Star,
  Users,
  Eye,
  LayoutGrid,
  HeartPulse,
  Scale,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Dumbbell,
  LayoutTemplate,
  Loader2,
  MessageSquare,
  Wrench,
  Shield,
  Clock,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  is_featured: boolean | null;
  usage_count: number | null;
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

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PromptTemplate) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: LayoutGrid },
  { id: 'saude', label: 'Saúde', icon: HeartPulse },
  { id: 'juridico', label: 'Jurídico', icon: Scale },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag },
  { id: 'servicos', label: 'Serviços', icon: Briefcase },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'geral', label: 'Geral', icon: LayoutTemplate },
];

const TemplatesModal = ({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<PromptTemplate | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // Use mock data in demo mode
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('usage_count', { ascending: false });

      if (error) throw error;

      // Type assertion to handle JSONB fields
      const typedData = (data || []).map(item => ({
        ...item,
        qualification_questions: item.qualification_questions as string[] | null,
        characteristics: item.characteristics as string[] | null,
        available_tools: item.available_tools as string[] | null,
        communication_rules: item.communication_rules as string[] | null,
        critical_reminders: item.critical_reminders as string[] | null,
      }));

      setTemplates(typedData);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(
    t => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleUseTemplate = async (template: PromptTemplate) => {
    // Increment usage count only if supabase is configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('prompt_templates')
          .update({ usage_count: (template.usage_count || 0) + 1 })
          .eq('id', template.id);
      } catch (error) {
        console.error('Error updating usage count:', error);
      }
    }

    onSelectTemplate(template);
    onClose();
  };

  const getToneLabel = (tone: string | null) => {
    const tones: Record<string, string> = {
      'acolhedor': 'Acolhedor',
      'formal': 'Formal',
      'direto': 'Direto',
      'consultivo': 'Consultivo',
      'tecnico': 'Técnico',
    };
    return tone ? tones[tone] || tone : 'Não definido';
  };

  return (
    <>
      <Dialog open={isOpen && !previewTemplate} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(18,18,20,0.95) 100%)',
            border: '2px solid rgba(0,255,148,0.2)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
          }}
        >
          <DialogTitle className="sr-only">Escolha um Template</DialogTitle>

          {/* Header */}
          <div className="p-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,148,0.2) 0%, rgba(0,255,148,0.05) 100%)',
                }}
              >
                <Sparkles className="w-6 h-6 text-[#00FF94]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Escolha um Template</h2>
                <p className="text-gray-400 text-sm">
                  Comece com um modelo profissional pré-configurado
                </p>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-6 border-b border-zinc-800 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
                      isActive
                        ? "text-[#00FF94] border-[#00FF94]"
                        : "text-gray-400 border-transparent hover:text-gray-200"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#00FF94] animate-spin" />
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  Nenhum template encontrado nesta categoria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: 'linear-gradient(135deg, rgba(39,39,42,0.6) 0%, rgba(24,24,27,0.8) 100%)',
                        border: '2px solid rgba(113,113,122,0.25)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0,255,148,0.4)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,255,148,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(113,113,122,0.25)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Featured Badge */}
                      {template.is_featured && (
                        <div
                          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
                          style={{
                            background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
                            color: 'black',
                          }}
                        >
                          <Star className="w-3 h-3" />
                          Popular
                        </div>
                      )}

                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: 'rgba(0,255,148,0.1)',
                          border: '2px solid rgba(0,255,148,0.2)',
                        }}
                      >
                        {template.icon || '📋'}
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        {template.description}
                      </p>

                      {/* Usage Badge */}
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4"
                        style={{
                          background: 'rgba(0,255,148,0.1)',
                          border: '1px solid rgba(0,255,148,0.2)',
                          color: '#00FF94',
                        }}
                      >
                        <Users className="w-3 h-3" />
                        {template.usage_count || 0}+ usando
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplate(template);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-gray-300 transition-all duration-200 hover:text-white"
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(113,113,122,0.5)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0,255,148,0.5)';
                            e.currentTarget.style.background = 'rgba(0,255,148,0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(113,113,122,0.5)';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseTemplate(template);
                          }}
                          className="flex-[2] py-2.5 px-4 rounded-lg text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02]"
                          style={{
                            background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
                          }}
                        >
                          Usar Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(18,18,20,0.95) 100%)',
            border: '2px solid rgba(0,255,148,0.2)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
          }}
        >
          <DialogTitle className="sr-only">
            Preview: {previewTemplate?.name}
          </DialogTitle>

          {previewTemplate && (
            <>
              {/* Preview Header */}
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,255,148,0.2) 0%, rgba(0,255,148,0.05) 100%)',
                      border: '2px solid rgba(0,255,148,0.3)',
                    }}
                  >
                    {previewTemplate.icon || '📋'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{previewTemplate.name}</h2>
                    <p className="text-gray-400 text-sm">{previewTemplate.description}</p>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <ScrollArea className="max-h-[calc(90vh-250px)]">
                <div className="p-6 space-y-6">
                  {/* Identity Section */}
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-white font-semibold">
                      <Users className="w-4 h-4 text-[#00FF94]" />
                      Identidade do Assistente
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-zinc-800/50">
                        <span className="text-gray-500 block mb-1">Nome:</span>
                        <span className="text-white">{previewTemplate.assistant_name || 'Não definido'}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-800/50">
                        <span className="text-gray-500 block mb-1">Tom de voz:</span>
                        <span className="text-white">{getToneLabel(previewTemplate.tone)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Greeting Message */}
                  {previewTemplate.greeting_message && (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-white font-semibold">
                        <MessageSquare className="w-4 h-4 text-[#00FF94]" />
                        Mensagem de Abertura
                      </h3>
                      <div className="p-4 rounded-lg bg-zinc-800/50 text-gray-300 text-sm italic">
                        "{previewTemplate.greeting_message}"
                      </div>
                    </div>
                  )}

                  {/* Qualification Questions */}
                  {previewTemplate.qualification_questions && previewTemplate.qualification_questions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-white font-semibold">
                        ❓ Perguntas de Qualificação
                      </h3>
                      <ul className="space-y-2">
                        {previewTemplate.qualification_questions.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-[#00FF94]">•</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tools */}
                  {previewTemplate.available_tools && previewTemplate.available_tools.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-white font-semibold">
                        <Wrench className="w-4 h-4 text-[#00FF94]" />
                        Ferramentas Disponíveis
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {previewTemplate.available_tools.map((tool, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              background: 'rgba(0,255,148,0.1)',
                              border: '1px solid rgba(0,255,148,0.2)',
                              color: '#00FF94',
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Critical Reminders */}
                  {previewTemplate.critical_reminders && previewTemplate.critical_reminders.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-white font-semibold">
                        <Shield className="w-4 h-4 text-red-400" />
                        Lembretes Críticos
                      </h3>
                      <div
                        className="p-4 rounded-lg space-y-2"
                        style={{
                          background: 'rgba(220,38,38,0.1)',
                          border: '1px solid rgba(220,38,38,0.2)',
                        }}
                      >
                        {previewTemplate.critical_reminders.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-red-300">
                            <span className="text-red-400">⚠️</span>
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Out of Hours */}
                  {previewTemplate.out_of_hours_message && (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-white font-semibold">
                        <Clock className="w-4 h-4 text-[#00FF94]" />
                        Fora do Horário
                      </h3>
                      <div className="p-4 rounded-lg bg-zinc-800/50 text-gray-300 text-sm">
                        {previewTemplate.out_of_hours_message}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Preview Actions */}
              <div className="p-6 border-t border-zinc-800 flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-gray-300 transition-all duration-200"
                  style={{
                    background: 'transparent',
                    border: '2px solid rgba(113,113,122,0.5)',
                  }}
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-[2] py-3 px-4 rounded-xl text-sm font-bold text-black transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
                    boxShadow: '0 4px 14px rgba(0,255,148,0.4)',
                  }}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Usar Este Template
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplatesModal;
