import React from 'react';
import { AlertTriangle, Info, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Folder as FolderType } from '@/types/folder';

interface FolderDeleteModalProps {
  isOpen: boolean;
  folder: FolderType | null;
  promptCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const FolderDeleteModal: React.FC<FolderDeleteModalProps> = ({
  isOpen,
  folder,
  promptCount,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !folder) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-[99]"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal */}
      <div 
        className="relative z-[100] w-full max-w-md rounded-2xl p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(18,18,20,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(220,38,38,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(220,38,38,0.15)',
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
            style={{
              background: 'rgba(220,38,38,0.15)',
              border: '2px solid rgba(220,38,38,0.3)',
            }}
          >
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center mb-4">
          Deletar Pasta?
        </h2>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <p className="text-gray-300 text-center">
            A pasta <span className="text-white font-semibold">"{folder.name}"</span> será deletada.
          </p>

          {promptCount > 0 ? (
            <>
              {/* Info box - prompts are safe */}
              <div 
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-300 font-medium text-sm mb-1">
                      Seus prompts estão seguros
                    </p>
                    <p className="text-blue-200/80 text-sm">
                      {promptCount} prompt{promptCount > 1 ? 's' : ''} será{promptCount > 1 ? 'ão' : ''} movido{promptCount > 1 ? 's' : ''} para a pasta{' '}
                      <span className="inline-flex items-center gap-1 font-medium">
                        <FolderOpen className="w-3.5 h-3.5" /> "Sem Pasta"
                      </span>{' '}
                      e poderá{promptCount > 1 ? 'ão' : ''} ser reorganizado{promptCount > 1 ? 's' : ''} depois.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm text-center">
                Nenhum prompt será excluído permanentemente.
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center">
              Esta pasta está vazia.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-zinc-700 text-gray-300 hover:border-zinc-500 hover:bg-zinc-800/50 rounded-xl font-semibold"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 font-bold text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              boxShadow: '0 4px 14px rgba(220,38,38,0.4)',
            }}
          >
            Sim, deletar pasta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FolderDeleteModal;
