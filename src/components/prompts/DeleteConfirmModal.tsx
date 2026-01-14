import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProjectData } from '@/types/prompt';

interface DeleteConfirmModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({ project, onClose, onConfirm }: DeleteConfirmModalProps) => {
  if (!project) return null;

  return (
    <AlertDialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-foreground">Confirmar Exclusão</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-muted-foreground">
            Tem certeza que deseja apagar o prompt "{project.identity.name || 'Sem nome'}"?
            <br /><br />
            <span className="text-muted-foreground/70">
              Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            className="bg-transparent border-border hover:border-muted-foreground hover:bg-muted text-muted-foreground"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sim, Apagar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmModal;