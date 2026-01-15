import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, ArrowRight, Zap, Save, Sparkles, LayoutTemplate, TrendingUp, FileText } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { getProjects } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import TemplatesModal from '@/components/templates/TemplatesModal';
import { createProjectFromTemplate } from '@/lib/templateUtils';

const Home = () => {
  const navigate = useNavigate();
  const { initializeProject, loadProject, hasDraft, loadDraft, discardDraft } = useProject();
  const projects = getProjects();
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome for new users (no projects yet)
    const hasSeenWelcome = localStorage.getItem('devprompts_welcome_seen');
    if (!hasSeenWelcome && projects.length === 0) {
      setShowWelcome(true);
    }
  }, []); // Run only once on mount

  const handleDismissWelcome = () => {
    localStorage.setItem('devprompts_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const handleCreateNew = () => {
    initializeProject('personalizado');
    navigate('/wizard');
  };

  const handleRecoverDraft = () => {
    loadDraft();
    navigate('/wizard');
  };

  const handleSelectTemplate = (template: any) => {
    const newProject = createProjectFromTemplate(template);
    loadProject(newProject);
    navigate('/wizard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-2xl font-bold text-primary"
              style={{
                textShadow: '0 0 20px hsla(var(--primary), 0.6)',
                filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.4))'
              }}
            >
              &lt;/&gt;
            </span>
            <span
              className="text-xl font-bold text-foreground"
              style={{
                letterSpacing: '0.5px',
                textShadow: '0 0 15px hsla(var(--primary), 0.3)'
              }}
            >
              DEV PROMPTS
            </span>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/meus-prompts')}
            className="gap-2 bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            Meus Prompts {projects.length > 0 && `(${projects.length})`}
          </Button>
        </div>
      </header>

      {/* Welcome Banner for New Users */}
      {showWelcome && (
        <div
          className="container mx-auto px-6 pt-6"
        >
          <div
            className="relative rounded-2xl p-6 overflow-hidden animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,148,0.15) 0%, rgba(0,255,148,0.05) 100%)',
              border: '2px solid rgba(0,255,148,0.3)',
            }}
          >
            <button
              onClick={handleDismissWelcome}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
                  boxShadow: '0 8px 24px rgba(0,255,148,0.4)',
                }}
              >
                <Sparkles className="w-7 h-7 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  🎉 Bem-vindo ao DEV PROMPTS!
                </h3>
                <p className="text-gray-300">
                  Crie prompts profissionais para IA em minutos. Comece escolhendo um template ou criando do zero.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {projects.length > 0 && (
        <div className="container mx-auto px-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="rounded-xl p-4 transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(39,39,42,0.6)',
                border: '1px solid rgba(113,113,122,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                  <p className="text-xs text-gray-400">Prompts Criados</p>
                </div>
              </div>
            </div>
            <div
              className="rounded-xl p-4 transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(39,39,42,0.6)',
                border: '1px solid rgba(113,113,122,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">10+</p>
                  <p className="text-xs text-gray-400">Templates</p>
                </div>
              </div>
            </div>
            <div
              className="rounded-xl p-4 transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(39,39,42,0.6)',
                border: '1px solid rgba(113,113,122,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">~5min</p>
                  <p className="text-xs text-gray-400">Para Criar</p>
                </div>
              </div>
            </div>
            <div
              className="rounded-xl p-4 transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(39,39,42,0.6)',
                border: '1px solid rgba(113,113,122,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-xs text-gray-400">Gratuito</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="container mx-auto px-6 py-16 md:py-20 text-center"
        style={{
          background: 'radial-gradient(circle at 50% 50%, hsla(var(--primary), 0.05) 0%, transparent 50%)'
        }}
      >
        {/* Hero Icon */}
        <div
          className="text-6xl md:text-7xl mb-6 animate-fade-in"
          style={{
            color: 'hsl(var(--primary))',
            filter: 'drop-shadow(0 0 30px hsla(var(--primary), 0.5))',
            animation: 'glow-pulse 3s ease-in-out infinite'
          }}
        >
          &lt;/&gt;
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in"
          style={{
            textShadow: '0 2px 30px hsla(var(--primary), 0.3)',
            letterSpacing: '1px'
          }}
        >
          DEV PROMPTS
        </h1>

        {/* Slogan */}
        <p
          className="text-xl md:text-2xl font-semibold text-primary mb-6 animate-fade-in"
          style={{
            textShadow: '0 0 15px hsla(var(--primary), 0.4)',
            animationDelay: '0.05s'
          }}
        >
          Crie Prompts de IA Profissionais
        </p>

        {/* Description */}
        <p
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in"
          style={{
            lineHeight: '1.6',
            animationDelay: '0.1s'
          }}
        >
          Sistema completo de geração de prompts estruturados para WhatsApp e atendimento automatizado
        </p>

        {/* Draft Recovery Banner */}
        {hasDraft && (
          <div className="futuristic-card p-5 max-w-xl mx-auto mb-8 flex items-center justify-between gap-4 animate-fade-in border-warning/30" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Rascunho encontrado</p>
                <p className="text-sm text-muted-foreground">Deseja continuar de onde parou?</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={discardDraft}
                className="text-muted-foreground hover:text-foreground"
              >
                Descartar
              </Button>
              <Button
                size="sm"
                onClick={handleRecoverDraft}
                className="bg-primary text-primary-foreground hover:bg-primary/80"
              >
                Recuperar
              </Button>
            </div>
          </div>
        )}

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Use Template Button - Featured */}
          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="relative inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-primary-foreground rounded-xl transition-all duration-300 hover:-translate-y-1 group"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
              boxShadow: '0 4px 30px hsla(var(--primary), 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 40px hsla(var(--primary), 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 30px hsla(var(--primary), 0.5)';
            }}
          >
            <Sparkles className="w-6 h-6" />
            Usar Template
            <span
              className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
                color: 'black',
              }}
            >
              Novo
            </span>
          </button>

          {/* Create from Scratch Button */}
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-3 px-8 py-5 text-lg font-bold rounded-xl transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'rgba(39,39,42,0.8)',
              border: '2px solid rgba(113,113,122,0.4)',
              color: 'hsl(var(--foreground))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--primary))';
              e.currentTarget.style.background = 'rgba(0,255,148,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(113,113,122,0.4)';
              e.currentTarget.style.background = 'rgba(39,39,42,0.8)';
            }}
          >
            <Plus className="w-6 h-6" />
            Criar do Zero
          </button>
        </div>

        {/* Link to My Prompts */}
        {projects.length > 0 && (
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/meus-prompts')}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-all duration-300 hover:gap-3"
            >
              <BookOpen className="w-5 h-5" />
              Ver meus {projects.length} prompt{projects.length !== 1 ? 's' : ''} salvo{projects.length !== 1 ? 's' : ''}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card/30 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-neon-subtle">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Rápido e Eficiente</h3>
              <p className="text-sm text-muted-foreground">
                Crie prompts profissionais em menos de 10 minutos
              </p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-neon-subtle">
                <LayoutTemplate className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Templates Profissionais</h3>
              <p className="text-sm text-muted-foreground">
                Modelos prontos para diferentes segmentos
              </p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-neon-subtle">
                <Save className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Salve e Reutilize</h3>
              <p className="text-sm text-muted-foreground">
                Seus projetos ficam salvos para edição futura
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};

export default Home;
