import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import PromptCard from './PromptCard';
import { ProjectData } from '@/types/prompt';
import { Folder as FolderType } from '@/types/folder';
import { cn } from '@/lib/utils';

interface DraggablePromptCardProps {
  project: ProjectData;
  onView: (project: ProjectData) => void;
  onEdit: (project: ProjectData) => void;
  onCopy: (project: ProjectData) => void;
  onDelete: (project: ProjectData) => void;
  folder?: FolderType | null;
  folders?: FolderType[];
  onMoveToFolder?: (projectId: string, folderId: string | null) => void;
  onCreateFolder?: () => void;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

const DraggablePromptCard = ({
  project,
  onView,
  onEdit,
  onCopy,
  onDelete,
  folder,
  folders = [],
  onMoveToFolder,
  onCreateFolder,
  isDragging,
  style,
}: DraggablePromptCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: project.id,
    data: {
      type: 'prompt',
      project,
    },
  });

  const dragStyle = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "animate-fade-in relative group",
        isDragging && "opacity-50 scale-95"
      )}
      style={{ ...style, ...dragStyle }}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg cursor-grab opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00FF94]/10"
      >
        <GripVertical className="w-4 h-4 text-gray-400 hover:text-[#00FF94]" />
      </div>

      <PromptCard
        project={project}
        onView={onView}
        onEdit={onEdit}
        onCopy={onCopy}
        onDelete={onDelete}
        folder={folder}
        folders={folders}
        onMoveToFolder={onMoveToFolder}
        onCreateFolder={onCreateFolder}
      />
    </div>
  );
};

export default DraggablePromptCard;