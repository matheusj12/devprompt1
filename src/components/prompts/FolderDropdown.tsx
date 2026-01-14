import { useState } from 'react';
import { FolderPlus, Check, Search, Plus, Folder } from 'lucide-react';
import { Folder as FolderType } from '@/types/folder';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface FolderDropdownProps {
  folders: FolderType[];
  currentFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: () => void;
}

const FolderDropdown = ({
  folders,
  currentFolderId,
  onSelectFolder,
  onCreateFolder,
}: FolderDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (folderId: string | null) => {
    onSelectFolder(folderId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-lg transition-all duration-300 hover:bg-[#00FF94]/10 hover:text-[#00FF94] text-zinc-500"
          title="Mover para pasta"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="w-60 p-2 bg-zinc-900 border-2 border-zinc-700 backdrop-blur-xl rounded-xl"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar pasta..."
            className="pl-9 h-9 text-sm bg-zinc-800 border-zinc-700 rounded-lg focus:border-[#00FF94]"
          />
        </div>

        {/* Remove from folder */}
        {currentFolderId && (
          <>
            <DropdownMenuItem
              onClick={() => handleSelect(null)}
              className="gap-2 text-gray-300 hover:text-white focus:text-white cursor-pointer rounded-lg"
            >
              <span className="text-red-400">✕</span>
              Remover da pasta
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-700" />
          </>
        )}

        {/* Folder List */}
        <div 
          className="max-h-[200px] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#00FF94 transparent',
          }}
        >
          {filteredFolders.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">
              Nenhuma pasta encontrada
            </p>
          ) : (
            filteredFolders.map((folder) => {
              const isSelected = currentFolderId === folder.id;
              return (
                <DropdownMenuItem
                  key={folder.id}
                  onClick={() => handleSelect(folder.id)}
                  className="gap-2 text-gray-300 hover:text-white focus:text-white cursor-pointer rounded-lg"
                >
                  {folder.emoji ? (
                    <span className="text-lg">{folder.emoji}</span>
                  ) : (
                    <Folder className="w-4 h-4" style={{ color: folder.color }} />
                  )}
                  <span className="flex-1 truncate">{folder.name}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#00FF94]" />
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        {/* Create New Folder */}
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem
          onClick={() => {
            onCreateFolder();
            setIsOpen(false);
          }}
          className="gap-2 text-[#00FF94] hover:text-[#00FF94] focus:text-[#00FF94] cursor-pointer rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Nova pasta...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FolderDropdown;
