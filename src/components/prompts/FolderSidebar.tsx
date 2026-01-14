import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Palette, 
  Trash2,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Smile,
  Check,
  X
} from 'lucide-react';
import { Folder as FolderType } from '@/types/folder';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Droppable folder component
const DroppableFolderItem = ({ 
  id, 
  children, 
  isOver 
}: { 
  id: string; 
  children: React.ReactNode; 
  isOver?: boolean;
}) => {
  const { setNodeRef, isOver: isOverCurrent } = useDroppable({
    id,
    data: { type: 'folder' },
  });

  const showDropIndicator = isOver || isOverCurrent;

  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        "relative transition-all duration-200",
        showDropIndicator && "scale-[1.02]"
      )}
    >
      {children}
      {showDropIndicator && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: '2px solid #00FF94',
            boxShadow: '0 0 20px rgba(0,255,148,0.4)',
            background: 'rgba(0,255,148,0.05)',
          }}
        />
      )}
    </div>
  );
};

interface FolderSidebarProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onEditFolder: (folder: FolderType) => void;
  onDeleteFolder: (folder: FolderType) => void;
  promptCounts: Record<string, number>;
  totalPrompts: number;
  uncategorizedCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDragging?: boolean;
  overId?: string | null;
}

const FolderSidebar = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  promptCounts,
  totalPrompts,
  uncategorizedCount,
  isCollapsed,
  onToggleCollapse,
  isDragging = false,
  overId = null,
}: FolderSidebarProps) => {
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingFolderId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingFolderId]);

  const handleDoubleClick = (folder: FolderType) => {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  };

  const handleInlineRename = (folder: FolderType) => {
    if (editingName.trim() && editingName.trim() !== folder.name) {
      onEditFolder({ ...folder, name: editingName.trim() });
    }
    setEditingFolderId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, folder: FolderType) => {
    if (e.key === 'Enter') {
      handleInlineRename(folder);
    } else if (e.key === 'Escape') {
      setEditingFolderId(null);
      setEditingName('');
    }
  };

  if (isCollapsed) {
    return (
      <div className="relative">
        <button
          onClick={onToggleCollapse}
          className="fixed left-4 top-24 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(18,18,20,0.98) 100%)',
            border: '2px solid rgba(113,113,122,0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <ChevronRight className="w-5 h-5 text-[#00FF94]" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className="fixed left-0 top-[73px] bottom-0 w-[280px] z-10 overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(180deg, rgba(24,24,27,0.95) 0%, rgba(18,18,20,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0,255,148,0.1)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <Folder className="w-5 h-5 text-[#00FF94]" />
            <h2 
              className="font-bold text-lg"
              style={{
                color: '#00FF94',
                textShadow: '0 0 20px rgba(0,255,148,0.3)',
              }}
            >
              Pastas de Clientes
            </h2>
          </div>
          
          <button
            onClick={onCreateFolder}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm text-black transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
              boxShadow: '0 4px 12px rgba(0,255,148,0.3)',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Nova Pasta
          </button>
        </div>

        {/* Folder List */}
        <div 
          className="flex-1 overflow-y-auto p-3"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#00FF94 transparent',
          }}
        >
          {/* All Prompts */}
          <button
            onClick={() => onSelectFolder(null)}
            className={`w-full text-left p-3.5 rounded-lg mb-2 transition-all duration-300 ${
              selectedFolderId === null ? 'translate-x-0.5' : ''
            }`}
            style={{
              background: selectedFolderId === null 
                ? 'linear-gradient(135deg, rgba(0,255,148,0.12) 0%, rgba(0,255,148,0.06) 100%)'
                : 'rgba(39,39,42,0.4)',
              borderLeft: selectedFolderId === null 
                ? '3px solid #00FF94'
                : '3px solid transparent',
            }}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid 
                className="w-5 h-5 flex-shrink-0"
                style={{ 
                  color: selectedFolderId === null ? '#00FF94' : '#a1a1aa',
                  filter: selectedFolderId === null ? 'drop-shadow(0 0 8px rgba(0,255,148,0.6))' : 'none',
                }}
              />
              <div className="flex-1 min-w-0">
                <span className={`font-medium text-sm ${selectedFolderId === null ? 'text-white' : 'text-gray-300'}`}>
                  Todos os Prompts
                </span>
                <span className="text-gray-500 text-xs block">
                  {totalPrompts} prompts
                </span>
              </div>
              <span 
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: selectedFolderId === null ? 'rgba(0,255,148,0.2)' : 'rgba(82,82,91,0.5)',
                  color: selectedFolderId === null ? '#00FF94' : '#d4d4d8',
                }}
              >
                {totalPrompts}
              </span>
            </div>
          </button>

          {/* Uncategorized */}
          <button
            onClick={() => onSelectFolder('uncategorized')}
            className={`w-full text-left p-3.5 rounded-lg mb-2 transition-all duration-300 ${
              selectedFolderId === 'uncategorized' ? 'translate-x-0.5' : ''
            }`}
            style={{
              background: selectedFolderId === 'uncategorized' 
                ? 'linear-gradient(135deg, rgba(0,255,148,0.12) 0%, rgba(0,255,148,0.06) 100%)'
                : 'rgba(39,39,42,0.4)',
              borderLeft: selectedFolderId === 'uncategorized' 
                ? '3px solid #00FF94'
                : '3px solid transparent',
            }}
          >
            <div className="flex items-center gap-3">
              <FolderOpen 
                className="w-5 h-5 flex-shrink-0"
                style={{ 
                  color: selectedFolderId === 'uncategorized' ? '#00FF94' : '#a1a1aa',
                  filter: selectedFolderId === 'uncategorized' ? 'drop-shadow(0 0 8px rgba(0,255,148,0.6))' : 'none',
                }}
              />
              <div className="flex-1 min-w-0">
                <span className={`font-medium text-sm italic ${selectedFolderId === 'uncategorized' ? 'text-white' : 'text-gray-300'}`}>
                  Sem Pasta
                </span>
                <span className="text-gray-500 text-xs block">
                  {uncategorizedCount} prompts
                </span>
              </div>
              <span 
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: selectedFolderId === 'uncategorized' ? 'rgba(0,255,148,0.2)' : 'rgba(82,82,91,0.5)',
                  color: selectedFolderId === 'uncategorized' ? '#00FF94' : '#d4d4d8',
                }}
              >
                {uncategorizedCount}
              </span>
            </div>
          </button>

          {/* Divider */}
          {folders.length > 0 && (
            <div className="h-px bg-zinc-800 my-3" />
          )}

          {/* Custom Folders */}
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            const isHovered = hoveredFolder === folder.id;
            const isEditing = editingFolderId === folder.id;
            const count = promptCounts[folder.id] || 0;

            return (
              <div
                key={folder.id}
                className={cn(
                  "group relative rounded-lg mb-2 transition-all duration-300",
                  isSelected && "translate-x-0.5"
                )}
                onMouseEnter={() => setHoveredFolder(folder.id)}
                onMouseLeave={() => setHoveredFolder(null)}
              >
                <button
                  onClick={() => !isEditing && onSelectFolder(folder.id)}
                  className="w-full text-left p-3.5 pr-12"
                  style={{
                    background: isSelected 
                      ? `linear-gradient(135deg, ${folder.color}20 0%, ${folder.color}10 100%)`
                      : isHovered
                        ? 'rgba(39,39,42,0.7)'
                        : 'rgba(39,39,42,0.4)',
                    borderLeft: isSelected 
                      ? `3px solid ${folder.color}`
                      : isHovered
                        ? `3px solid ${folder.color}50`
                        : '3px solid transparent',
                    borderRadius: '8px',
                    transform: isHovered && !isSelected ? 'translateX(2px)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {folder.emoji ? (
                      <span className="text-xl flex-shrink-0">{folder.emoji}</span>
                    ) : (
                      <Folder 
                        className="w-5 h-5 flex-shrink-0"
                        style={{ 
                          color: isSelected ? folder.color : '#a1a1aa',
                          filter: isSelected ? `drop-shadow(0 0 8px ${folder.color}80)` : 'none',
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            ref={inputRef}
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => handleInlineRename(folder)}
                            onKeyDown={(e) => handleKeyDown(e, folder)}
                            className="w-full bg-black/60 border-2 border-[#00FF94] rounded-lg px-2 py-1 text-white text-sm focus:outline-none"
                            maxLength={50}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInlineRename(folder);
                            }}
                            className="p-1 rounded hover:bg-zinc-700"
                          >
                            <Check className="w-4 h-4 text-[#00FF94]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFolderId(null);
                              setEditingName('');
                            }}
                            className="p-1 rounded hover:bg-zinc-700"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span 
                            className={`font-medium text-sm truncate block ${isSelected ? 'text-white' : 'text-gray-300'}`}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              handleDoubleClick(folder);
                            }}
                          >
                            {folder.name}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {count} prompt{count !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                    {!isEditing && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: isSelected ? `${folder.color}30` : 'rgba(82,82,91,0.5)',
                          color: isSelected ? folder.color : '#d4d4d8',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                </button>

                {/* Actions Menu */}
                {!isEditing && (
                  <div className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200",
                    (isHovered || isSelected) ? "opacity-100" : "opacity-0"
                  )}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-zinc-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4 text-zinc-500 hover:text-[#00FF94]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end"
                        className="w-52 bg-zinc-900 border-2 border-zinc-700 backdrop-blur-xl rounded-xl z-50"
                        style={{
                          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                        }}
                      >
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingFolderId(folder.id);
                            setEditingName(folder.name);
                          }}
                          className="gap-3 py-2.5 px-3 text-gray-200 hover:text-white focus:text-white cursor-pointer rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEditFolder(folder)}
                          className="gap-3 py-2.5 px-3 text-gray-200 hover:text-white focus:text-white cursor-pointer rounded-lg"
                        >
                          <Palette className="w-4 h-4" />
                          Mudar cor
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEditFolder(folder)}
                          className="gap-3 py-2.5 px-3 text-gray-200 hover:text-white focus:text-white cursor-pointer rounded-lg"
                        >
                          <Smile className="w-4 h-4" />
                          Mudar ícone/emoji
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                        <DropdownMenuItem 
                          onClick={() => onDeleteFolder(folder)}
                          className="gap-3 py-2.5 px-3 text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-500/10 cursor-pointer rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Deletar pasta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {folders.length === 0 && (
            <div className="text-center py-8 px-4">
              <Folder className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-1">Nenhuma pasta criada</p>
              <p className="text-gray-600 text-xs">
                Crie pastas para organizar seus prompts por cliente
              </p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-12 rounded-r-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(24,24,27,0.95) 0%, rgba(18,18,20,0.98) 100%)',
            border: '2px solid rgba(113,113,122,0.3)',
            borderLeft: 'none',
            boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
          }}
        >
          <ChevronLeft className="w-4 h-4 text-zinc-400" />
        </button>
      </aside>
    </>
  );
};

export default FolderSidebar;
