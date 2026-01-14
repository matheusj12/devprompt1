import { GripVertical, Building2 } from 'lucide-react';
import { ProjectData, TEMPLATES } from '@/types/prompt';

interface DragOverlayContentProps {
  project: ProjectData;
}

const DragOverlayContent = ({ project }: DragOverlayContentProps) => {
  const template = TEMPLATES.find(t => t.id === project.template);
  const icon = template?.icon || '⚙️';

  return (
    <div
      className="min-w-[300px] p-4 rounded-2xl flex items-center gap-3 cursor-grabbing"
      style={{
        background: 'linear-gradient(135deg, rgba(24,24,27,0.98), rgba(18,18,20,0.95))',
        backdropFilter: 'blur(20px)',
        border: '2px solid #00FF94',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,255,148,0.4)',
      }}
    >
      {/* Drag indicator */}
      <div 
        className="p-2 rounded-lg"
        style={{ background: 'rgba(0,255,148,0.1)' }}
      >
        <GripVertical className="w-5 h-5 text-[#00FF94]" />
      </div>

      {/* Icon */}
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        style={{ 
          background: 'rgba(0,255,148,0.15)',
          boxShadow: '0 0 15px rgba(0,255,148,0.3)',
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold truncate">
          {project.identity.name || 'Sem nome'}
        </p>
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <Building2 className="w-3 h-3" />
          <span className="truncate">{project.identity.companyName || 'Empresa'}</span>
        </div>
      </div>
    </div>
  );
};

export default DragOverlayContent;