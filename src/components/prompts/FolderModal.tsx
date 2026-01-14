import { useState, useEffect } from 'react';
import { X, Folder, Sparkles, Check, Briefcase, Users, User, Star, Heart, Target, Zap, Code, Coffee, Book, ShoppingCart, Truck, Home, Building2, Lightbulb, Wrench, Palette, BarChart3, TrendingUp, DollarSign, GraduationCap, Trophy } from 'lucide-react';
import { Folder as FolderType, FOLDER_COLORS, DEFAULT_FOLDER_COLOR } from '@/types/folder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FolderModalProps {
  isOpen: boolean;
  folder?: FolderType | null;
  onClose: () => void;
  onSave: (name: string, color: string, emoji?: string) => void;
}

const FOLDER_ICONS = [
  { id: 'folder', icon: Folder, label: 'Pasta' },
  { id: 'briefcase', icon: Briefcase, label: 'Briefcase' },
  { id: 'users', icon: Users, label: 'Equipe' },
  { id: 'user', icon: User, label: 'Usuário' },
  { id: 'star', icon: Star, label: 'Estrela' },
  { id: 'heart', icon: Heart, label: 'Coração' },
  { id: 'target', icon: Target, label: 'Alvo' },
  { id: 'zap', icon: Zap, label: 'Raio' },
  { id: 'code', icon: Code, label: 'Código' },
  { id: 'coffee', icon: Coffee, label: 'Café' },
  { id: 'book', icon: Book, label: 'Livro' },
  { id: 'shopping', icon: ShoppingCart, label: 'Carrinho' },
  { id: 'truck', icon: Truck, label: 'Entrega' },
  { id: 'home', icon: Home, label: 'Casa' },
  { id: 'building', icon: Building2, label: 'Prédio' },
  { id: 'lightbulb', icon: Lightbulb, label: 'Ideia' },
  { id: 'wrench', icon: Wrench, label: 'Ferramenta' },
  { id: 'palette', icon: Palette, label: 'Design' },
  { id: 'chart', icon: BarChart3, label: 'Gráfico' },
  { id: 'trending', icon: TrendingUp, label: 'Crescimento' },
  { id: 'dollar', icon: DollarSign, label: 'Dinheiro' },
  { id: 'graduation', icon: GraduationCap, label: 'Educação' },
  { id: 'trophy', icon: Trophy, label: 'Troféu' },
];

const FOLDER_EMOJIS = [
  '📁', '📂', '💼', '👥', '👤', '⭐', '❤️', '🎯',
  '⚡', '💻', '☕', '📚', '🛒', '🚚', '🏠', '🏢',
  '💡', '🔧', '🎨', '📊', '📈', '💰', '🎓', '🏆',
];

const FolderModal = ({ isOpen, folder, onClose, onSave }: FolderModalProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_FOLDER_COLOR);
  const [emoji, setEmoji] = useState('');
  const [activeTab, setActiveTab] = useState<'icons' | 'emojis'>('emojis');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setColor(folder.color);
      setEmoji(folder.emoji || '');
      setSelectedIcon(null);
    } else {
      setName('');
      setColor(DEFAULT_FOLDER_COLOR);
      setEmoji('');
      setSelectedIcon(null);
    }
  }, [folder, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), color, emoji || undefined);
      onClose();
    }
  };

  const handleSelectIcon = (iconId: string) => {
    setSelectedIcon(iconId);
    setEmoji(''); // Clear emoji when selecting icon
  };

  const handleSelectEmoji = (emojiChar: string) => {
    setEmoji(emojiChar);
    setSelectedIcon(null); // Clear icon when selecting emoji
  };

  const getPreviewIcon = () => {
    if (emoji) {
      return <span className="text-3xl">{emoji}</span>;
    }
    if (selectedIcon) {
      const iconData = FOLDER_ICONS.find(i => i.id === selectedIcon);
      if (iconData) {
        const IconComponent = iconData.icon;
        return <IconComponent className="w-8 h-8" style={{ color }} />;
      }
    }
    return <Folder className="w-8 h-8" style={{ color }} />;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-[99]"
        style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal */}
      <div 
        className="relative z-[100] w-full max-w-lg rounded-2xl p-8 animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(18,18,20,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(0,255,148,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,255,148,0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-zinc-800"
        >
          <X className="w-5 h-5 text-zinc-400 hover:text-gray-200" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="p-2 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            }}
          >
            <Folder className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {folder ? 'Editar Pasta' : 'Nova Pasta de Cliente'}
            </h2>
            <p className="text-gray-400 text-sm">
              Organize seus prompts por cliente ou projeto
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${color}30 0%, ${color}15 100%)`,
              border: `2px solid ${color}60`,
              boxShadow: `0 8px 24px ${color}30`,
            }}
          >
            {getPreviewIcon()}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="folderName" className="text-white font-semibold">
                Nome da Pasta <span className="text-red-400">*</span>
              </Label>
              <span className="text-gray-500 text-xs">
                {name.length}/50 caracteres
              </span>
            </div>
            <Input
              id="folderName"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              placeholder="Ex: Cliente XYZ, Projeto ABC"
              className="h-12 px-4 text-base text-gray-200 placeholder:text-gray-500 rounded-xl border-2 border-zinc-700 bg-zinc-900 transition-all duration-300 focus:border-[#00FF94] focus:ring-4 focus:ring-[#00FF94]/20"
              autoFocus
              maxLength={50}
            />
          </div>

          {/* Color Selector */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">
              Cor da Pasta
            </Label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className="relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: c.value,
                    boxShadow: color === c.value 
                      ? `0 0 20px ${c.value}80, inset 0 0 10px rgba(255,255,255,0.3)`
                      : '0 2px 8px rgba(0,0,0,0.3)',
                    border: color === c.value ? '3px solid white' : '3px solid transparent',
                  }}
                  title={c.label}
                >
                  {color === c.value && (
                    <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon/Emoji Selector */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">
              Ícone ou Emoji <span className="text-gray-500 font-normal">(opcional)</span>
            </Label>
            
            {/* Tabs */}
            <div className="flex border-b border-zinc-700">
              <button
                type="button"
                onClick={() => setActiveTab('emojis')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === 'emojis' 
                    ? "text-[#00FF94] border-[#00FF94]" 
                    : "text-gray-400 border-transparent hover:text-gray-200"
                )}
              >
                Emojis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('icons')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === 'icons' 
                    ? "text-[#00FF94] border-[#00FF94]" 
                    : "text-gray-400 border-transparent hover:text-gray-200"
                )}
              >
                Ícones
              </button>
            </div>

            {/* Emojis Grid */}
            {activeTab === 'emojis' && (
              <div className="space-y-3">
                <div className="grid grid-cols-8 gap-2 max-h-[150px] overflow-y-auto p-2">
                  {FOLDER_EMOJIS.map((emojiChar) => (
                    <button
                      key={emojiChar}
                      type="button"
                      onClick={() => handleSelectEmoji(emojiChar)}
                      className={cn(
                        "w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all duration-200 hover:scale-125",
                        emoji === emojiChar 
                          ? "bg-[#00FF94]/20 border-2 border-[#00FF94]" 
                          : "bg-zinc-800/60 hover:bg-zinc-700"
                      )}
                    >
                      {emojiChar}
                    </button>
                  ))}
                </div>
                
                {/* Custom emoji input */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">Ou digite:</span>
                  <Input
                    value={emoji}
                    onChange={(e) => {
                      const val = e.target.value.slice(-2);
                      setEmoji(val);
                      if (val) setSelectedIcon(null);
                    }}
                    placeholder="📁"
                    className="w-16 h-10 text-center text-xl px-2 rounded-lg border-2 border-zinc-700 bg-zinc-900"
                    maxLength={2}
                  />
                </div>
              </div>
            )}

            {/* Icons Grid */}
            {activeTab === 'icons' && (
              <div className="grid grid-cols-6 gap-2 max-h-[180px] overflow-y-auto p-2">
                {FOLDER_ICONS.map((iconData) => {
                  const IconComponent = iconData.icon;
                  return (
                    <button
                      key={iconData.id}
                      type="button"
                      onClick={() => handleSelectIcon(iconData.id)}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110",
                        selectedIcon === iconData.id && !emoji
                          ? "bg-[#00FF94]/20 border-2 border-[#00FF94]" 
                          : "bg-zinc-800/60 hover:bg-zinc-700"
                      )}
                      title={iconData.label}
                    >
                      <IconComponent 
                        className="w-5 h-5" 
                        style={{ 
                          color: selectedIcon === iconData.id && !emoji ? color : '#a1a1aa' 
                        }} 
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-zinc-700 text-gray-300 hover:border-zinc-500 hover:bg-zinc-800/50 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 font-bold text-black rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
                boxShadow: '0 4px 14px rgba(0,255,148,0.4)',
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {folder ? 'Salvar Alterações' : 'Criar Pasta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;
