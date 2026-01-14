import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { generatePrompt, generateSummary } from '@/lib/promptGenerator';
import { saveProject } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Copy, Download, Check, FileText, BarChart3, CheckCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

const Preview = () => {
  const navigate = useNavigate();
  const { project, updateProject } = useProject();
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (!project) {
      navigate('/');
      return;
    }
    const generatedPrompt = generatePrompt(project);
    setPrompt(generatedPrompt);
    updateProject('generatedPrompt', generatedPrompt);
  }, [project, navigate, updateProject]);

  if (!project) return null;

  const summary = generateSummary(project);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success('Prompt copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
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

  const handleSaveProject = () => {
    saveProject(project);
    toast.success('Projeto salvo com sucesso!', {
      action: {
        label: 'Ver Meus Prompts',
        onClick: () => navigate('/meus-prompts'),
      },
    });
  };

  const complexityStars = Array(5).fill(0).map((_, i) => i < summary.complexity);

  const checklistItems = [
    { label: 'Identidade do assistente definida', done: !!project.identity.name && !!project.identity.companyName },
    { label: 'Contexto da empresa preenchido', done: !!project.context.products || !!project.context.address },
    { label: 'Ao menos 1 fluxo configurado', done: !!project.flows.openingMessage },
    { label: 'Pelo menos 3 ferramentas selecionadas', done: summary.toolsEnabled >= 3 },
    { label: 'Regras de comunicação definidas', done: project.rules.messageFormatting.length > 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/wizard')}
            className="text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar e Editar
          </Button>
          <div className="flex items-center gap-2">
            <span 
              className="text-xl font-bold text-primary"
              style={{ 
                textShadow: '0 0 20px hsla(var(--primary), 0.6)',
                filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.4))'
              }}
            >
              &lt;/&gt;
            </span>
            <span 
              className="text-sm font-bold text-foreground hidden sm:inline"
              style={{ 
                letterSpacing: '0.5px',
                textShadow: '0 0 15px hsla(var(--primary), 0.3)'
              }}
            >
              DEV PROMPTS
            </span>
          </div>
          <Button 
            onClick={handleSaveProject}
            className="bg-primary text-primary-foreground hover:bg-primary/80 shadow-neon hover:shadow-neon-intense"
          >
            Salvar Projeto
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Preview */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Pré-visualização do Prompt</h1>
              <p className="text-muted-foreground">
                Revise o prompt gerado antes de copiar ou baixar
              </p>
            </div>

            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
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

              <TabsContent value="prompt" className="mt-4">
                <div className="futuristic-card p-5 max-h-[600px] overflow-y-auto">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {prompt}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="mt-4">
                <div className="futuristic-card p-6 space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-2xl shadow-neon-subtle">
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

              <TabsContent value="checklist" className="mt-4">
                <div className="futuristic-card p-6 space-y-4">
                  <h3 className="font-semibold text-foreground mb-4">Checklist de Validação</h3>
                  {checklistItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
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
            </Tabs>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <div className="futuristic-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Ações</h3>
              
              <Button 
                className="w-full justify-start gap-3 h-14 bg-primary text-primary-foreground hover:bg-primary/80 shadow-neon hover:shadow-neon-intense" 
                size="lg"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar Prompt Completo
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-14 bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary"
                size="lg"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5" />
                Baixar como .txt
              </Button>
            </div>

            <div className="futuristic-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Próximos Passos</h3>
              <ol className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                  <span>Copie o prompt gerado</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                  <span>Cole no seu sistema de automação (n8n, Make, etc.)</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                  <span>Configure as ferramentas necessárias</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">4</span>
                  <span>Teste o assistente e ajuste conforme necessário</span>
                </li>
              </ol>
            </div>

            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-primary"
              onClick={() => navigate('/')}
            >
              Voltar para Início
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;