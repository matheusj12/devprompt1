export interface Folder {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  createdAt: string;
  updatedAt: string;
}

export const FOLDER_COLORS = [
  { id: 'green', value: '#00FF94', label: 'Verde' },
  { id: 'blue', value: '#3B82F6', label: 'Azul' },
  { id: 'purple', value: '#A855F7', label: 'Roxo' },
  { id: 'pink', value: '#EC4899', label: 'Rosa' },
  { id: 'red', value: '#EF4444', label: 'Vermelho' },
  { id: 'orange', value: '#F97316', label: 'Laranja' },
  { id: 'yellow', value: '#FACC15', label: 'Amarelo' },
  { id: 'cyan', value: '#06B6D4', label: 'Ciano' },
  { id: 'emerald', value: '#10B981', label: 'Esmeralda' },
  { id: 'indigo', value: '#6366F1', label: 'Índigo' },
  { id: 'teal', value: '#14B8A6', label: 'Teal' },
  { id: 'gray', value: '#6B7280', label: 'Cinza' },
];

export const DEFAULT_FOLDER_COLOR = '#00FF94';
