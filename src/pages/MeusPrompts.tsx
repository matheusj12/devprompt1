import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  ArrowUpDown, 
  X, 
  FileText,
  Folder,
  FolderOpen,
  LayoutGrid,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { getProjects, deleteProject, importProject, saveProject } from '@/lib/storage';
import { 
  getFolders, 
  createFolder, 
  updateFolder, 
  deleteFolder as deleteFolderStorage,
  getPromptFolder,
  setPromptFolder,
  countPromptsInFolder,
  getUncategorizedPromptIds,
} from '@/lib/folderStorage';
import { ProjectData } from '@/types/prompt';
import { Folder as FolderType } from '@/types/folder';
import { useProject } from '@/contexts/ProjectContext';
import { AuthHeader } from '@/components/auth/AuthHeader';
import PromptCard from '@/components/prompts/PromptCard';
import PromptPreviewModal from '@/components/prompts/PromptPreviewModal';
import DeleteConfirmModal from '@/components/prompts/DeleteConfirmModal';
import FolderSidebar from '@/components/prompts/FolderSidebar';
import FolderModal from '@/components/prompts/FolderModal';
import FolderDeleteModal from '@/components/prompts/FolderDeleteModal';
import DraggablePromptCard from '@/components/prompts/DraggablePromptCard';
import DragOverlayContent from '@/components/prompts/DragOverlayContent';

type SortOption = 'recent' | 'oldest' | 'az' | 'za';

const MeusPrompts = () => {
  const navigate = useNavigate();
  const { loadProject } = useProject();
  
  // Projects state
  const [projects, setProjects] = useState<ProjectData[]>(getProjects());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [previewProject, setPreviewProject] = useState<ProjectData | null>(null);
  const [deleteProjectData, setDeleteProjectData] = useState<ProjectData | null>(null);
  
  // Folders state
  const [folders, setFolders] = useState<FolderType[]>(getFolders());
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<FolderType | null>(null);

  // Drag & Drop state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'prompt' | 'folder' | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement to activate
      },
    }),
    useSensor(KeyboardSensor)
  );

  const refreshProjects = useCallback(() => {
    setProjects(getProjects());
  }, []);

  const refreshFolders = useCallback(() => {
    setFolders(getFolders());
  }, []);

  // Calculate prompt counts per folder
  const promptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    folders.forEach(folder => {
      counts[folder.id] = countPromptsInFolder(folder.id);
    });
    return counts;
  }, [folders, projects]);

  const uncategorizedCount = useMemo(() => {
    return getUncategorizedPromptIds(projects.map(p => p.id)).length;
  }, [projects]);

  // Get folder for each project
  const getProjectFolder = useCallback((projectId: string): FolderType | null => {
    const folderId = getPromptFolder(projectId);
    if (!folderId) return null;
    return folders.find(f => f.id === folderId) || null;
  }, [folders]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Apply folder filter
    if (selectedFolderId === 'uncategorized') {
      const uncategorizedIds = getUncategorizedPromptIds(projects.map(p => p.id));
      result = result.filter(p => uncategorizedIds.includes(p.id));
    } else if (selectedFolderId) {
      result = result.filter(p => getPromptFolder(p.id) === selectedFolderId);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.identity.name.toLowerCase().includes(search) ||
        p.identity.companyName.toLowerCase().includes(search) ||
        p.finalization.tags?.some(t => t.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
      case 'az':
        result.sort((a, b) => (a.identity.name || '').localeCompare(b.identity.name || ''));
        break;
      case 'za':
        result.sort((a, b) => (b.identity.name || '').localeCompare(a.identity.name || ''));
        break;
    }

    return result;
  }, [projects, searchTerm, sortBy, selectedFolderId]);

  // Get active project for drag overlay
  const activeProject = useMemo(() => {
    if (activeType === 'prompt' && activeId) {
      return projects.find(p => p.id === activeId) || null;
    }
    return null;
  }, [activeId, activeType, projects]);

  // Drag & Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type || 'prompt');
    
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      setOverId(null);
      return;
    }

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;
    const activeTypeStr = active.data.current?.type;
    const overTypeStr = over.data.current?.type;

    // Moving prompt to folder
    if (activeTypeStr === 'prompt' && overTypeStr === 'folder') {
      const targetFolderId = overIdStr === 'uncategorized' ? null : overIdStr;
      handleMoveToFolder(activeIdStr, targetFolderId);
    }

    setActiveId(null);
    setActiveType(null);
    setOverId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveType(null);
    setOverId(null);
  };

  // Handlers
  const handleView = (project: ProjectData) => {
    setPreviewProject(project);
  };

  const handleEdit = (project: ProjectData) => {
    loadProject(project);
    navigate('/wizard');
  };

  const handleCopy = async (project: ProjectData) => {
    try {
      if (project.generatedPrompt) {
        await navigator.clipboard.writeText(project.generatedPrompt);
        toast.success('✓ Prompt copiado com sucesso!');
      } else {
        toast.error('Prompt não disponível. Edite e salve o projeto primeiro.');
      }
    } catch {
      toast.error('Erro ao copiar. Tente novamente.');
    }
  };

  const handleDelete = (project: ProjectData) => {
    setDeleteProjectData(project);
  };

  const confirmDelete = () => {
    if (deleteProjectData) {
      deleteProject(deleteProjectData.id);
      setPromptFolder(deleteProjectData.id, null);
      refreshProjects();
      setDeleteProjectData(null);
      toast.success('✓ Prompt apagado com sucesso');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = importProject(text);
        if (imported) {
          saveProject(imported);
          if (selectedFolderId && selectedFolderId !== 'uncategorized') {
            setPromptFolder(imported.id, selectedFolderId);
          }
          refreshProjects();
          toast.success('✓ Prompt importado com sucesso!');
        } else {
          toast.error('Arquivo JSON inválido.');
        }
      } catch {
        toast.error('Erro ao importar arquivo.');
      }
    };
    input.click();
  };

  const handleExportAll = () => {
    if (projects.length === 0) {
      toast.error('Nenhum prompt para exportar.');
      return;
    }

    const allData = JSON.stringify(projects, null, 2);
    const blob = new Blob([allData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('✓ Backup exportado com sucesso!');
  };

  const handleMoveToFolder = (projectId: string, folderId: string | null) => {
    setPromptFolder(projectId, folderId);
    refreshFolders();
    refreshProjects();
    const folder = folderId ? folders.find(f => f.id === folderId) : null;
    toast.success(folder ? `✓ Movido para "${folder.name}"` : '✓ Removido da pasta');
  };

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setFolderModalOpen(true);
  };

  const handleEditFolder = (folder: FolderType) => {
    setEditingFolder(folder);
    setFolderModalOpen(true);
  };

  const handleDeleteFolder = (folder: FolderType) => {
    setDeletingFolder(folder);
  };

  const confirmDeleteFolder = () => {
    if (deletingFolder) {
      const promptCount = countPromptsInFolder(deletingFolder.id);
      const movedCount = deleteFolderStorage(deletingFolder.id);
      
      refreshFolders();
      refreshProjects(); // Refresh to update folder counts
      
      if (selectedFolderId === deletingFolder.id) {
        setSelectedFolderId('uncategorized'); // Redirect to "Sem Pasta" to see moved prompts
      }
      
      setDeletingFolder(null);
      
      if (movedCount > 0) {
        toast.success(
          `✓ Pasta deletada. ${movedCount} prompt${movedCount > 1 ? 's' : ''} movido${movedCount > 1 ? 's' : ''} para "Sem Pasta"`,
          {
            duration: 5000,
            action: {
              label: 'Ver prompts',
              onClick: () => setSelectedFolderId('uncategorized'),
            },
          }
        );
      } else {
        toast.success('✓ Pasta deletada com sucesso');
      }
    }
  };

  const handleSaveFolder = (name: string, color: string, emoji?: string) => {
    if (editingFolder) {
      updateFolder(editingFolder.id, { name, color, emoji });
      toast.success('✓ Pasta atualizada com sucesso');
    } else {
      createFolder(name, color, emoji);
      toast.success('✓ Pasta criada com sucesso');
    }
    refreshFolders();
  };

  const getFolderTitle = () => {
    if (selectedFolderId === null) return 'Todos os Prompts';
    if (selectedFolderId === 'uncategorized') return 'Sem Pasta';
    const folder = folders.find(f => f.id === selectedFolderId);
    return folder ? folder.name : 'Todos os Prompts';
  };

  const getFolderIcon = () => {
    if (selectedFolderId === null) return <LayoutGrid className="w-6 h-6 text-[#00FF94]" />;
    if (selectedFolderId === 'uncategorized') return <FolderOpen className="w-6 h-6 text-[#00FF94]" />;
    const folder = folders.find(f => f.id === selectedFolderId);
    if (folder?.emoji) return <span className="text-2xl">{folder.emoji}</span>;
    return <Folder className="w-6 h-6" style={{ color: folder?.color || '#00FF94' }} />;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-background">
        {/* Premium Authenticated Header */}
        <AuthHeader 
          currentFolderName={getFolderTitle()}
          showBreadcrumb={!!selectedFolderId}
          onNewPrompt={() => navigate('/')}
        />

        <div className="flex">
          {/* Folder Sidebar with Drop Zones */}
          <FolderSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={handleCreateFolder}
            onEditFolder={handleEditFolder}
            onDeleteFolder={handleDeleteFolder}
            promptCounts={promptCounts}
            totalPrompts={projects.length}
            uncategorizedCount={uncategorizedCount}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isDragging={!!activeId}
            overId={overId}
          />

          {/* Main Content */}
          <main 
            className="flex-1 transition-all duration-300"
            style={{
              marginLeft: isSidebarCollapsed ? '0' : '280px',
            }}
          >
            <div className="container mx-auto px-6 py-8">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,255,148,0.2) 0%, rgba(0,255,148,0.05) 100%)',
                      boxShadow: '0 0 20px rgba(0,255,148,0.2)',
                    }}
                  >
                    {getFolderIcon()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{getFolderTitle()}</h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredAndSortedProjects.length} prompt{filteredAndSortedProjects.length !== 1 ? 's' : ''}
                      {selectedFolderId && ` nesta pasta`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/')} 
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/80 shadow-neon hover:shadow-neon-intense transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Prompt
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleImport} 
                    className="gap-2 bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Importar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportAll} 
                    className="gap-2 bg-transparent border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                </div>
              </div>

              {/* Drag hint */}
              {projects.length > 0 && (
                <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                  <GripVertical className="w-4 h-4" />
                  <span>Arraste os prompts para mover entre pastas</span>
                </div>
              )}

              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, empresa ou tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 text-base rounded-xl border-2 border-zinc-700 bg-zinc-900 focus:border-[#00FF94]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[200px] h-12 rounded-xl border-2 border-zinc-700 bg-zinc-900">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigos</SelectItem>
                    <SelectItem value="az">A-Z (nome)</SelectItem>
                    <SelectItem value="za">Z-A (nome)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              {projects.length === 0 ? (
                // Empty State - No Projects
                <div 
                  className="p-16 text-center rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(24,24,27,0.6) 0%, rgba(18,18,20,0.4) 100%)',
                    border: '2px dashed rgba(0,255,148,0.3)',
                  }}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(82,82,91,0.3)' }}
                  >
                    <FileText className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-3">
                    Nenhum prompt criado ainda
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Crie seu primeiro prompt de IA profissional!
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/')}
                    className="gap-2 font-bold text-black"
                    style={{
                      background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
                      boxShadow: '0 4px 14px rgba(0,255,148,0.4)',
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    Criar Novo Prompt
                  </Button>
                </div>
              ) : filteredAndSortedProjects.length === 0 ? (
                // Empty State - No Results
                <div 
                  className="p-16 text-center rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(24,24,27,0.6) 0%, rgba(18,18,20,0.4) 100%)',
                    border: '2px dashed rgba(113,113,122,0.3)',
                  }}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(82,82,91,0.3)' }}
                  >
                    {selectedFolderId && selectedFolderId !== 'uncategorized' ? (
                      <FolderOpen className="w-10 h-10 text-zinc-600" />
                    ) : (
                      <Search className="w-10 h-10 text-zinc-600" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-3">
                    {selectedFolderId && selectedFolderId !== 'uncategorized' 
                      ? 'Nenhum prompt nesta pasta ainda'
                      : 'Nenhum prompt encontrado'
                    }
                  </h2>
                  <p className="text-gray-400 mb-8">
                    {selectedFolderId && selectedFolderId !== 'uncategorized'
                      ? 'Crie um novo prompt ou arraste existentes para cá'
                      : 'Tente ajustar sua busca'
                    }
                  </p>
                  {selectedFolderId && selectedFolderId !== 'uncategorized' ? (
                    <Button 
                      size="lg" 
                      onClick={() => navigate('/')}
                      className="gap-2 font-bold text-black"
                      style={{
                        background: 'linear-gradient(135deg, #00FF94 0%, #00D97E 100%)',
                        boxShadow: '0 4px 14px rgba(0,255,148,0.4)',
                      }}
                    >
                      <Plus className="w-5 h-5" />
                      Criar Primeiro Prompt
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                      className="border-zinc-700 hover:border-[#00FF94] hover:bg-[#00FF94]/10 text-gray-400 hover:text-[#00FF94]"
                    >
                      Limpar Busca
                    </Button>
                  )}
                </div>
              ) : (
                // Grid of Draggable Cards
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProjects.map((project, index) => (
                    <DraggablePromptCard
                      key={project.id}
                      project={project}
                      onView={handleView}
                      onEdit={handleEdit}
                      onCopy={handleCopy}
                      onDelete={handleDelete}
                      folder={getProjectFolder(project.id)}
                      folders={folders}
                      onMoveToFolder={handleMoveToFolder}
                      onCreateFolder={handleCreateFolder}
                      isDragging={activeId === project.id}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeProject && (
            <DragOverlayContent project={activeProject} />
          )}
        </DragOverlay>

        {/* Modals */}
        <PromptPreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
          onEdit={handleEdit}
        />

        <DeleteConfirmModal
          project={deleteProjectData}
          onClose={() => setDeleteProjectData(null)}
          onConfirm={confirmDelete}
        />

        <FolderModal
          isOpen={folderModalOpen}
          folder={editingFolder}
          onClose={() => {
            setFolderModalOpen(false);
            setEditingFolder(null);
          }}
          onSave={handleSaveFolder}
        />

        {/* Delete Folder Confirmation - Premium Modal */}
        <FolderDeleteModal
          isOpen={!!deletingFolder}
          folder={deletingFolder}
          promptCount={deletingFolder ? countPromptsInFolder(deletingFolder.id) : 0}
          onClose={() => setDeletingFolder(null)}
          onConfirm={confirmDeleteFolder}
        />
      </div>
    </DndContext>
  );
};

export default MeusPrompts;