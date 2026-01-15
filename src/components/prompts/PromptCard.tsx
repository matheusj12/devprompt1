import { Eye, Pencil, Copy, Trash2, Building2, Target, Calendar, Folder, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectData, TEMPLATES } from '@/types/prompt';
import { Folder as FolderType } from '@/types/folder';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FolderDropdown from './FolderDropdown';

interface PromptCardProps {
  project: ProjectData;
  onView: (project: ProjectData) => void;
  onEdit: (project: ProjectData) => void;
  onCopy: (project: ProjectData) => void;
  onDelete: (project: ProjectData) => void;
  onDuplicate?: (project: ProjectData) => void;
  folder?: FolderType | null;
  folders?: FolderType[];
  onMoveToFolder?: (projectId: string, folderId: string | null) => void;
  onCreateFolder?: () => void;
}

const PromptCard = ({
  project,
  onView,
  onEdit,
  onCopy,
  onDelete,
  onDuplicate,
  folder,
  folders = [],
  onMoveToFolder,
  onCreateFolder,
}: PromptCardProps) => {
  const template = TEMPLATES.find(t => t.id === project.template);
  const color = template?.color || '#6B7280';
  const icon = template?.icon || '⚙️';

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="futuristic-card group transition-all duration-300 overflow-hidden"
      style={{ borderTop: `4px solid ${color}` }}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${color}20`,
              boxShadow: `0 0 15px ${color}40`
            }}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {project.identity.name || 'Sem nome'}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {template?.name || 'Personalizado'}
            </p>
          </div>

          {/* Folder Dropdown */}
          {onMoveToFolder && onCreateFolder && (
            <FolderDropdown
              folders={folders}
              currentFolderId={folder?.id || null}
              onSelectFolder={(folderId) => onMoveToFolder(project.id, folderId)}
              onCreateFolder={onCreateFolder}
            />
          )}
        </div>

        {/* Folder Badge */}
        {folder && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3 transition-all duration-300 hover:opacity-80"
            style={{
              background: `${folder.color}20`,
              border: `1px solid ${folder.color}40`,
              color: folder.color,
            }}
          >
            {folder.emoji ? (
              <span>{folder.emoji}</span>
            ) : (
              <Folder className="w-3 h-3" />
            )}
            <span className="truncate max-w-[120px]">{folder.name}</span>
          </div>
        )}

        {/* Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{project.identity.companyName || 'Empresa não informada'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4 shrink-0" />
            <span className="truncate">{template?.name || 'Tipo não definido'}</span>
          </div>
        </div>

        {/* Tags */}
        {project.finalization.tags && project.finalization.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.finalization.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 bg-muted/50 text-muted-foreground rounded-full text-xs border border-border"
              >
                {tag}
              </span>
            ))}
            {project.finalization.tags.length > 3 && (
              <span className="px-2.5 py-0.5 bg-muted/50 text-muted-foreground rounded-full text-xs border border-border">
                +{project.finalization.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="mt-4 pt-3 border-t border-border space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Criado: {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Editado: {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-5 border-t border-border">
        <Button
          variant="ghost"
          className="rounded-none h-11 gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10"
          onClick={() => onView(project)}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Ver</span>
        </Button>
        <Button
          variant="ghost"
          className="rounded-none h-11 gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 border-l border-border"
          onClick={() => onEdit(project)}
        >
          <Pencil className="w-4 h-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
        <Button
          variant="ghost"
          className="rounded-none h-11 gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 border-l border-border"
          onClick={() => onCopy(project)}
        >
          <Copy className="w-4 h-4" />
          <span className="hidden sm:inline">Copiar</span>
        </Button>
        {onDuplicate && (
          <Button
            variant="ghost"
            className="rounded-none h-11 gap-1.5 text-xs font-medium text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 border-l border-border"
            onClick={() => onDuplicate(project)}
          >
            <Files className="w-4 h-4" />
            <span className="hidden sm:inline">Duplicar</span>
          </Button>
        )}
        <Button
          variant="ghost"
          className="rounded-none h-11 gap-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive border-l border-border"
          onClick={() => onDelete(project)}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Apagar</span>
        </Button>
      </div>
    </div>
  );
};

export default PromptCard;
