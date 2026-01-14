import { useState, useEffect } from 'react';
import { Copy, Download, Pencil, FileText, BarChart3, CheckCircle, Check, Star } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectData } from '@/types/prompt';
import { generatePrompt, generateSummary } from '@/lib/promptGenerator';
import { toast } from 'sonner';

interface PromptPreviewModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onEdit: (project: ProjectData) => void;
}

const PromptPreviewModal = ({ project, onClose, onEdit }: PromptPreviewModalProps) => {
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (project) {
      const generated = project.generatedPrompt || generatePrompt(project);
      setPrompt(generated);
    }
  }, [project]);

  if (!project) return null;

  const summary = generateSummary(project);
  const complexityStars = Array(5).fill(0).map((_, i) => i < summary.complexity);

  const checklistItems = [
    { label: 'Identidade do assistente definida', done: !!project.identity.name && !!project.identity.companyName },
    { label: 'Contexto da empresa preenchido', done: !!project.context.products || !!project.context.address },
    { label: 'Ao menos 1 fluxo configurado', done: !!project.flows.openingMessage },
    { label: 'Pelo menos 3 ferramentas selecionadas', done: summary.toolsEnabled >= 3 },
    { label: 'Regras de comunicação definidas', done: project.rules.messageFormatting.length > 0 },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success('✓ Prompt copiado com sucesso!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar. Tente novamente.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.finalization.projectName || project.identity.companyName || 'prompt'}-assistente.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Arquivo baixado com sucesso!');
  };

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-foreground">
              {project.identity.name || 'Visualizar Prompt'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="prompt" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0 bg-muted/30 border border-border">
            <TabsTrigger 
              value="prompt" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <FileText className="w-4 h-4" />
              Prompt
            </TabsTrigger>
            <TabsTrigger 
              value="summary" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <BarChart3 className="w-4 h-4" />
              Resumo
            </TabsTrigger>
            <TabsTrigger 
              value="checklist" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <CheckCircle className="w-4 h-4" />
              Checklist
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="prompt" className="mt-0 h-full">
              <div className="futuristic-card p-4 h-[400px] overflow-y-auto">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {prompt}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-0">
              <div className="futuristic-card p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl shadow-neon-subtle">
                    📊
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Resumo do Assistente</h3>
                    <p className="text-sm text-muted-foreground">Visão geral da configuração</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Nome</p>
                    <p className="font-medium text-foreground">{summary.name || '-'}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                    <p className="font-medium text-foreground">{summary.type}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Empresa</p>
                    <p className="font-medium text-foreground">{summary.company || '-'}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Tom de Voz</p>
                    <p className="font-medium text-foreground capitalize">{summary.tone}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fluxos Configurados</span>
                    <span className="font-medium text-foreground">{summary.flowsConfigured}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ferramentas Ativadas</span>
                    <span className="font-medium text-foreground">{summary.toolsEnabled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Regras Definidas</span>
                    <span className="font-medium text-foreground">{summary.rulesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Casos Especiais</span>
                    <span className="font-medium text-foreground">{summary.specialCasesCount}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Complexidade</span>
                    <div className="flex gap-0.5">
                      {complexityStars.map((filled, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${filled ? 'text-primary fill-primary' : 'text-border'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completude</span>
                    <span className="font-semibold text-primary">{summary.completeness}%</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="mt-0">
              <div className="futuristic-card p-6 space-y-4">
                <h3 className="font-semibold text-foreground mb-4">Checklist de Validação</h3>
                {checklistItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.done 
                        ? 'bg-primary text-primary-foreground shadow-neon-subtle' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.done ? <Check className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <span className={`text-sm ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border flex-shrink-0">
          <Button 
            onClick={handleCopy} 
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/80 shadow-neon"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar Prompt'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload} 
            className="gap-2 bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary"
          >
            <Download className="w-4 h-4" />
            Baixar TXT
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { onEdit(project); onClose(); }} 
            className="gap-2 bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptPreviewModal;