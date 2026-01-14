import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, User, Building2, GitBranch, Wrench, Shield, Flag, Save, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const TABS = [
  { id: 0, name: 'Identidade', icon: User, description: 'Nome e personalidade' },
  { id: 1, name: 'Contexto', icon: Building2, description: 'Dados da empresa' },
  { id: 2, name: 'Fluxos', icon: GitBranch, description: 'Fluxos de atendimento' },
  { id: 3, name: 'Ferramentas', icon: Wrench, description: 'Ferramentas disponíveis' },
  { id: 4, name: 'Regras', icon: Shield, description: 'Regras e validações' },
  { id: 5, name: 'Finalização', icon: Flag, description: 'Casos especiais' },
];

interface WizardSidebarProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
  onSave: () => void;
  onExit: () => void;
  hasUnsavedChanges?: boolean;
}

const WizardSidebar = ({ currentTab, onTabChange, onSave, onExit, hasUnsavedChanges = false }: WizardSidebarProps) => {
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleExitClick = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      navigate('/meus-prompts');
    }
  };

  const handleSaveAndExit = () => {
    onSave();
    setShowExitDialog(false);
    navigate('/meus-prompts');
  };

  const handleDiscardAndExit = () => {
    setShowExitDialog(false);
    navigate('/meus-prompts');
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-72 fixed left-0 top-0 h-screen futuristic-sidebar">
        {/* Header with Logo and Back */}
        <div className="px-5 py-5 border-b border-border">
          {/* Back Button */}
          <button
            onClick={handleExitClick}
            className="w-full flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-zinc-800/60"
            style={{
              border: '1px solid rgba(113,113,122,0.3)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Meus Prompts</span>
          </button>

          {/* Logo */}
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
              className="text-lg font-bold text-foreground"
              style={{ 
                letterSpacing: '0.5px',
                textShadow: '0 0 15px hsla(var(--primary), 0.3)'
              }}
            >
              DEV PROMPTS
            </span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-primary font-semibold">{Math.round(((currentTab + 1) / 6) * 100)}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${((currentTab + 1) / 6) * 100}%`,
                background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(152, 100%, 40%) 100%)',
                boxShadow: '0 0 10px hsla(var(--primary), 0.5)',
              }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const isCompleted = currentTab > tab.id;
            const isAccessible = isCompleted || isActive || tab.id === 0;

            return (
              <button
                key={tab.id}
                onClick={() => isAccessible && onTabChange(tab.id)}
                disabled={!isAccessible}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-300 relative ${
                  isActive 
                    ? 'sidebar-item active' 
                    : isAccessible 
                      ? 'sidebar-item hover:bg-zinc-800/50' 
                      : 'sidebar-item opacity-50 cursor-not-allowed'
                }`}
                style={{
                  borderLeft: isActive ? '3px solid hsl(var(--primary))' : '3px solid transparent',
                }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/30 shadow-neon-subtle' 
                    : isCompleted 
                      ? 'bg-primary/20' 
                      : 'bg-zinc-800/80'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-primary animate-pulse-neon" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <span className={`block ${isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {tab.name}
                  </span>
                  <span className="block text-xs text-muted-foreground/70">
                    {tab.description}
                  </span>
                </div>
                {isActive && (
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: 'hsl(var(--primary))',
                      boxShadow: '0 0 10px hsla(var(--primary), 0.8)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border space-y-2">
          <Button 
            variant="outline" 
            className="w-full bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
            onClick={onSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para Home
          </Button>
        </div>
      </aside>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent 
          className="max-w-md"
          style={{
            background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(18,18,20,0.95) 100%)',
            border: '2px solid rgba(250,204,21,0.3)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-foreground">Alterações não salvas</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você tem alterações não salvas neste projeto. O que deseja fazer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel 
              onClick={() => setShowExitDialog(false)}
              className="bg-transparent border-border hover:bg-zinc-800"
            >
              Continuar editando
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={handleDiscardAndExit}
              className="text-red-400 border-red-400/30 hover:bg-red-500/10"
            >
              Descartar alterações
            </Button>
            <Button
              onClick={handleSaveAndExit}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar e sair
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WizardSidebar;
