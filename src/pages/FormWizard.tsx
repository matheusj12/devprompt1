import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import WizardSidebar from '@/components/wizard/WizardSidebar';
import WizardContent from '@/components/wizard/WizardContent';
import { ChevronLeft, ChevronRight, Save, Rocket, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveProject } from '@/lib/storage';
import { toast } from 'sonner';

const TAB_NAMES = ['Identidade', 'Contexto', 'Fluxos', 'Ferramentas', 'Regras', 'Finalização'];

const FormWizard = () => {
  const navigate = useNavigate();
  const { project, currentTab, setCurrentTab } = useProject();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!project) {
      navigate('/');
    }
  }, [project, navigate]);

  // Track unsaved changes
  useEffect(() => {
    if (project) {
      setHasUnsavedChanges(true);
    }
  }, [project]);

  if (!project) return null;

  const handleSaveDraft = () => {
    saveProject(project);
    setHasUnsavedChanges(false);
    toast.success('Projeto salvo com sucesso!');
  };

  const handleBack = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    } else {
      navigate('/meus-prompts');
    }
  };

  const handleNext = () => {
    if (currentTab < 5) {
      setCurrentTab(currentTab + 1);
    } else {
      navigate('/preview');
    }
  };

  const handleExit = () => {
    navigate('/meus-prompts');
  };

  const progress = ((currentTab + 1) / 6) * 100;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <WizardSidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        onSave={handleSaveDraft}
        onExit={handleExit}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
        {/* Mobile Header */}
        <header className="lg:hidden border-b border-border bg-card/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {currentTab === 0 ? 'Sair' : 'Voltar'}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-primary">DEV PROMPTS</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveDraft}
            className="border-border hover:border-primary hover:bg-primary/10"
          >
            <Save className="w-4 h-4" />
          </Button>
        </header>

        {/* Desktop Header with Navigation */}
        <header 
          className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border sticky top-0 z-40"
          style={{
            background: 'rgba(24,24,27,0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigate('/meus-prompts')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Meus Prompts
              </button>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-primary font-medium">{TAB_NAMES[currentTab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Etapa {currentTab + 1} de 6</span>
              <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
                  }}
                />
              </div>
              <span className="text-sm text-primary font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>
        </header>

        {/* Progress Bar - Mobile Only */}
        <div className="lg:hidden px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Progresso</span>
            <span className="text-sm text-primary font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="futuristic-progress">
            <div 
              className="futuristic-progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 px-6 lg:px-8 py-6 overflow-y-auto">
          <WizardContent tab={currentTab} />
        </main>

        {/* Footer Navigation */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {currentTab === 0 ? 'Sair' : 'Anterior'}
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-primary text-primary-foreground hover:bg-primary/80 shadow-neon transition-all duration-300 hover:shadow-neon-intense"
          >
            {currentTab === 5 ? 'Gerar Prompt' : 'Próxima'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default FormWizard;
