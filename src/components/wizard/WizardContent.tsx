import IdentityForm from '@/components/forms/IdentityForm';
import ContextForm from '@/components/forms/ContextForm';
import FlowsForm from '@/components/forms/FlowsForm';
import ToolsForm from '@/components/forms/ToolsForm';
import RulesForm from '@/components/forms/RulesForm';
import FinalizationForm from '@/components/forms/FinalizationForm';

interface WizardContentProps {
  tab: number;
}

const TAB_TITLES = [
  'Identidade do Assistente',
  'Contexto da Empresa',
  'Fluxos de Atendimento',
  'Ferramentas Disponíveis',
  'Regras e Validações',
  'Casos Especiais e Finalização',
];

const WizardContent = ({ tab }: WizardContentProps) => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in" key={tab}>
      <h1 className="text-2xl font-bold text-foreground mb-2">{TAB_TITLES[tab]}</h1>
      <p className="text-muted-foreground mb-8">
        {tab === 0 && 'Defina a personalidade e características do seu assistente'}
        {tab === 1 && 'Informações sobre sua empresa e operação'}
        {tab === 2 && 'Configure os fluxos de atendimento do assistente'}
        {tab === 3 && 'Selecione as ferramentas que o assistente poderá usar'}
        {tab === 4 && 'Defina regras de comunicação e validação'}
        {tab === 5 && 'Configure casos especiais e finalize o projeto'}
      </p>

      {tab === 0 && <IdentityForm />}
      {tab === 1 && <ContextForm />}
      {tab === 2 && <FlowsForm />}
      {tab === 3 && <ToolsForm />}
      {tab === 4 && <RulesForm />}
      {tab === 5 && <FinalizationForm />}
    </div>
  );
};

export default WizardContent;
