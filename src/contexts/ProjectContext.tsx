import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectData, AssistantType } from '@/types/prompt';
import { createEmptyProject, saveDraft, getDraft, clearDraft } from '@/lib/storage';

interface ProjectContextType {
  project: ProjectData | null;
  currentTab: number;
  setCurrentTab: (tab: number) => void;
  initializeProject: (template: AssistantType) => void;
  loadProject: (project: ProjectData) => void;
  updateProject: <K extends keyof ProjectData>(key: K, value: ProjectData[K]) => void;
  updateIdentity: <K extends keyof ProjectData['identity']>(key: K, value: ProjectData['identity'][K]) => void;
  updateContext: <K extends keyof ProjectData['context']>(key: K, value: ProjectData['context'][K]) => void;
  updateFlows: <K extends keyof ProjectData['flows']>(key: K, value: ProjectData['flows'][K]) => void;
  updateTools: <K extends keyof ProjectData['tools']>(key: K, value: ProjectData['tools'][K]) => void;
  updateRules: <K extends keyof ProjectData['rules']>(key: K, value: ProjectData['rules'][K]) => void;
  updateFinalization: <K extends keyof ProjectData['finalization']>(key: K, value: ProjectData['finalization'][K]) => void;
  resetProject: () => void;
  hasDraft: boolean;
  loadDraft: () => void;
  discardDraft: () => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const draft = getDraft();
    setHasDraft(!!draft);
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!project) return;
    
    const interval = setInterval(() => {
      saveDraft(project);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [project]);

  const initializeProject = useCallback((template: AssistantType) => {
    const newProject = createEmptyProject(template);
    setProject(newProject);
    setCurrentTab(0);
    clearDraft();
    setHasDraft(false);
  }, []);

  const loadProject = useCallback((projectData: ProjectData) => {
    setProject(projectData);
    setCurrentTab(0);
  }, []);

  const updateProject = useCallback(<K extends keyof ProjectData>(key: K, value: ProjectData[K]) => {
    setProject(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value, updatedAt: new Date().toISOString() };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const updateIdentity = useCallback(<K extends keyof ProjectData['identity']>(key: K, value: ProjectData['identity'][K]) => {
    setProject(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        identity: { ...prev.identity, [key]: value },
        updatedAt: new Date().toISOString(),
      };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const updateContext = useCallback(<K extends keyof ProjectData['context']>(key: K, value: ProjectData['context'][K]) => {
    setProject(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        context: { ...prev.context, [key]: value },
        updatedAt: new Date().toISOString(),
      };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const updateFlows = useCallback(<K extends keyof ProjectData['flows']>(key: K, value: ProjectData['flows'][K]) => {
    setProject(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        flows: { ...prev.flows, [key]: value },
        updatedAt: new Date().toISOString(),
      };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const updateTools = useCallback(<K extends keyof ProjectData['tools']>(key: K, value: ProjectData['tools'][K]) => {
    setProject(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        tools: { ...prev.tools, [key]: value },
        updatedAt: new Date().toISOString(),
      };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const updateRules = useCallback(<K extends keyof ProjectData['rules']>(key: K, value: ProjectData['rules'][K]) => {
    setProject(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        rules: { ...prev.rules, [key]: value },
        updatedAt: new Date().toISOString(),
      };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const updateFinalization = useCallback(<K extends keyof ProjectData['finalization']>(key: K, value: ProjectData['finalization'][K]) => {
    setProject(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        finalization: { ...prev.finalization, [key]: value },
        updatedAt: new Date().toISOString(),
      };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const resetProject = useCallback(() => {
    setProject(null);
    setCurrentTab(0);
    clearDraft();
    setHasDraft(false);
  }, []);

  const loadDraft = useCallback(() => {
    const draft = getDraft();
    if (draft) {
      setProject(draft);
      setHasDraft(false);
    }
  }, []);

  const discardDraft = useCallback(() => {
    clearDraft();
    setHasDraft(false);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        currentTab,
        setCurrentTab,
        initializeProject,
        loadProject,
        updateProject,
        updateIdentity,
        updateContext,
        updateFlows,
        updateTools,
        updateRules,
        updateFinalization,
        resetProject,
        hasDraft,
        loadDraft,
        discardDraft,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
