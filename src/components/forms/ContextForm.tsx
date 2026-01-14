import { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { TIMEZONES, WorkingHours } from '@/types/prompt';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Building2, Globe, Settings } from 'lucide-react';

// Preset configurations
const PRESETS = [
  {
    id: 'comercial',
    name: 'Comercial',
    icon: Building2,
    description: 'Segunda a Sexta-feira\n08h às 18h',
    hours: [
      { day: 'Segunda-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Terça-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Quarta-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Quinta-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Sexta-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Sábado', enabled: false, start: '08:00', end: '12:00' },
      { day: 'Domingo', enabled: false, start: '08:00', end: '12:00' },
    ],
  },
  {
    id: '24h',
    name: '24 horas',
    icon: Globe,
    description: 'Todos os dias\nda semana\n24 horas',
    hours: [
      { day: 'Segunda-feira', enabled: true, start: '00:00', end: '23:59' },
      { day: 'Terça-feira', enabled: true, start: '00:00', end: '23:59' },
      { day: 'Quarta-feira', enabled: true, start: '00:00', end: '23:59' },
      { day: 'Quinta-feira', enabled: true, start: '00:00', end: '23:59' },
      { day: 'Sexta-feira', enabled: true, start: '00:00', end: '23:59' },
      { day: 'Sábado', enabled: true, start: '00:00', end: '23:59' },
      { day: 'Domingo', enabled: true, start: '00:00', end: '23:59' },
    ],
  },
  {
    id: 'personalizado',
    name: 'Personalizado',
    icon: Settings,
    description: 'Configure\nmanualmente\ncada dia',
    hours: [
      { day: 'Segunda-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Terça-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Quarta-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Quinta-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Sexta-feira', enabled: true, start: '08:00', end: '18:00' },
      { day: 'Sábado', enabled: false, start: '08:00', end: '12:00' },
      { day: 'Domingo', enabled: false, start: '08:00', end: '12:00' },
    ],
  },
];

const ContextForm = () => {
  const { project, updateContext } = useProject();
  const [selectedPreset, setSelectedPreset] = useState<string>('comercial');

  // Detect current preset based on working hours
  useEffect(() => {
    if (!project) return;
    
    const hours = project.context.workingHours;
    
    // Check if matches 24h preset
    const is24h = hours.every(h => h.enabled && h.start === '00:00' && h.end === '23:59');
    if (is24h) {
      setSelectedPreset('24h');
      return;
    }
    
    // Check if matches comercial preset
    const isComercial = hours.slice(0, 5).every(h => h.enabled && h.start === '08:00' && h.end === '18:00') &&
                        hours.slice(5).every(h => !h.enabled);
    if (isComercial) {
      setSelectedPreset('comercial');
      return;
    }
    
    // Otherwise it's personalized
    setSelectedPreset('personalizado');
  }, [project?.context.workingHours]);

  if (!project) return null;

  const { context } = project;

  const updateWorkingHours = (index: number, field: keyof WorkingHours, value: string | boolean) => {
    const newHours = [...context.workingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    updateContext('workingHours', newHours);
    setSelectedPreset('personalizado');
  };

  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      updateContext('workingHours', preset.hours);
    }
  };

  const addPhone = () => {
    if (context.phones.length < 3) {
      updateContext('phones', [...context.phones, '']);
    }
  };

  const removePhone = (index: number) => {
    const newPhones = context.phones.filter((_, i) => i !== index);
    updateContext('phones', newPhones.length > 0 ? newPhones : ['']);
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...context.phones];
    newPhones[index] = value;
    updateContext('phones', newPhones);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Operating Hours */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
          Informações Operacionais
        </h2>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Horário de Funcionamento
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Escolha um modelo ou personalize:
            </p>
            
            {/* Preset Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = selectedPreset === preset.id;
                
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`
                      relative flex flex-col items-center justify-center p-6 rounded-xl border-2 
                      transition-all duration-300 cursor-pointer min-h-[160px]
                      ${isSelected 
                        ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,255,148,0.3)]' 
                        : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-lg'
                      }
                    `}
                  >
                    <Icon 
                      className={`w-8 h-8 mb-4 transition-all duration-300 ${
                        isSelected 
                          ? 'text-primary drop-shadow-[0_0_10px_rgba(0,255,148,0.5)]' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                    <p className={`text-base font-bold mb-3 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {preset.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center whitespace-pre-line leading-relaxed">
                      {preset.description}
                    </p>
                    
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Days Grid - Only show when "Personalizado" is selected */}
            {selectedPreset === 'personalizado' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-muted-foreground mb-3">Configure cada dia:</p>
                {context.workingHours.map((hours, index) => {
                  const isEnabled = hours.enabled;
                  return (
                    <div 
                      key={hours.day} 
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                        isEnabled 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'border-border bg-card opacity-60'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer min-w-[160px]">
                        <Checkbox
                          checked={hours.enabled}
                          onCheckedChange={(checked) => updateWorkingHours(index, 'enabled', checked as boolean)}
                          className={isEnabled ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,255,148,0.5)]' : ''}
                        />
                        <span className={`text-sm font-medium ${isEnabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {hours.day}
                        </span>
                      </label>
                      
                      {hours.enabled ? (
                        <div className="flex items-center gap-3 flex-1">
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) => updateWorkingHours(index, 'start', e.target.value)}
                            className="futuristic-input w-28"
                          />
                          <span className="text-muted-foreground text-sm">até</span>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) => updateWorkingHours(index, 'end', e.target.value)}
                            className="futuristic-input w-28"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Fechado</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">
              Fuso Horário <span className="text-destructive">*</span>
            </Label>
            <Select
              value={context.timezone}
              onValueChange={(value) => updateContext('timezone', value)}
            >
              <SelectTrigger className="futuristic-input mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Section 2: Location & Contact */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
          Localização e Contato
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-sm font-medium">Endereço Completo</Label>
            <Textarea
              id="address"
              value={context.address}
              onChange={(e) => updateContext('address', e.target.value)}
              placeholder="Rua, Número, Bairro, Cidade-UF, CEP"
              className="futuristic-input mt-1.5 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="mapsLink" className="text-sm font-medium">Link Google Maps</Label>
            <Input
              id="mapsLink"
              type="url"
              value={context.mapsLink}
              onChange={(e) => updateContext('mapsLink', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="futuristic-input mt-1.5"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Telefones de Contato</Label>
              {context.phones.length < 3 && (
                <Button variant="ghost" size="sm" onClick={addPhone} className="text-xs text-primary hover:text-primary/80">
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {context.phones.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                    className="futuristic-input flex-1"
                  />
                  {context.phones.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removePhone(index)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={context.email}
              onChange={(e) => updateContext('email', e.target.value)}
              placeholder="contato@empresa.com.br"
              className="futuristic-input mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
              <Input
                id="instagram"
                value={context.instagram}
                onChange={(e) => updateContext('instagram', e.target.value)}
                placeholder="@usuario"
                className="futuristic-input mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-sm font-medium">Site</Label>
              <Input
                id="website"
                type="url"
                value={context.website}
                onChange={(e) => updateContext('website', e.target.value)}
                placeholder="https://..."
                className="futuristic-input mt-1.5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Commercial Info */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
          Informações Comerciais
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="products" className="text-sm font-medium">
              Produtos/Serviços Oferecidos <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="products"
              value={context.products}
              onChange={(e) => updateContext('products', e.target.value)}
              placeholder="Descreva brevemente os principais produtos ou serviços"
              className="futuristic-input mt-1.5 min-h-[120px]"
            />
          </div>

          <div>
            <Label htmlFor="paymentMethods" className="text-sm font-medium">Valores e Formas de Pagamento</Label>
            <Textarea
              id="paymentMethods"
              value={context.paymentMethods}
              onChange={(e) => updateContext('paymentMethods', e.target.value)}
              placeholder="Ex: PIX, Cartão de crédito, Boleto, Convênios..."
              className="futuristic-input mt-1.5 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="pricingPolicy" className="text-sm font-medium">Política de Preços/Honorários</Label>
            <Textarea
              id="pricingPolicy"
              value={context.pricingPolicy}
              onChange={(e) => updateContext('pricingPolicy', e.target.value)}
              placeholder="Ex: Honorários de êxito: 30%, Consulta: R$ 500,00"
              className="futuristic-input mt-1.5 min-h-[80px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContextForm;
