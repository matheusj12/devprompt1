import { Folder, DEFAULT_FOLDER_COLOR } from '@/types/folder';

const FOLDERS_KEY = 'promptgen_folders';
const PROMPT_FOLDERS_KEY = 'promptgen_prompt_folders';

export const generateFolderId = (): string => {
  return 'folder_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Folder CRUD
export const getFolders = (): Folder[] => {
  try {
    const data = localStorage.getItem(FOLDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFolder = (folder: Folder): void => {
  const folders = getFolders();
  const existingIndex = folders.findIndex(f => f.id === folder.id);
  
  folder.updatedAt = new Date().toISOString();
  
  if (existingIndex >= 0) {
    folders[existingIndex] = folder;
  } else {
    folders.push(folder);
  }
  
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};

export const createFolder = (name: string, color: string = DEFAULT_FOLDER_COLOR, emoji?: string): Folder => {
  const now = new Date().toISOString();
  const folder: Folder = {
    id: generateFolderId(),
    name,
    color,
    emoji,
    createdAt: now,
    updatedAt: now,
  };
  saveFolder(folder);
  return folder;
};

export const updateFolder = (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>): Folder | null => {
  const folders = getFolders();
  const folder = folders.find(f => f.id === id);
  if (!folder) return null;
  
  const updatedFolder = { ...folder, ...updates, updatedAt: new Date().toISOString() };
  saveFolder(updatedFolder);
  return updatedFolder;
};

/**
 * Delete a folder and move all its prompts to "uncategorized" (null folder_id)
 * IMPORTANT: This does NOT delete the prompts, only moves them to "Sem Pasta"
 * @returns The number of prompts that were moved to uncategorized
 */
export const deleteFolder = (id: string): number => {
  // First, get all prompts in this folder
  const promptsInFolder = getPromptsInFolder(id);
  const promptCount = promptsInFolder.length;
  
  // Move all prompts to uncategorized (folder_id = null)
  const associations = getPromptFolderAssociations();
  promptsInFolder.forEach(promptId => {
    delete associations[promptId]; // Remove the folder association = moves to "Sem Pasta"
  });
  localStorage.setItem(PROMPT_FOLDERS_KEY, JSON.stringify(associations));
  
  // Then delete the folder itself
  const folders = getFolders().filter(f => f.id !== id);
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  
  return promptCount;
};

/**
 * Get folder by ID
 */
export const getFolderById = (id: string): Folder | null => {
  const folders = getFolders();
  return folders.find(f => f.id === id) || null;
};

// Prompt-Folder Associations
export const getPromptFolderAssociations = (): Record<string, string> => {
  try {
    const data = localStorage.getItem(PROMPT_FOLDERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const getPromptFolder = (promptId: string): string | null => {
  const associations = getPromptFolderAssociations();
  return associations[promptId] || null;
};

export const setPromptFolder = (promptId: string, folderId: string | null): void => {
  const associations = getPromptFolderAssociations();
  
  if (folderId === null) {
    delete associations[promptId];
  } else {
    associations[promptId] = folderId;
  }
  
  localStorage.setItem(PROMPT_FOLDERS_KEY, JSON.stringify(associations));
};

export const getPromptsInFolder = (folderId: string): string[] => {
  const associations = getPromptFolderAssociations();
  return Object.entries(associations)
    .filter(([_, folder]) => folder === folderId)
    .map(([promptId]) => promptId);
};

export const getUncategorizedPromptIds = (allPromptIds: string[]): string[] => {
  const associations = getPromptFolderAssociations();
  return allPromptIds.filter(id => !associations[id]);
};

export const countPromptsInFolder = (folderId: string): number => {
  return getPromptsInFolder(folderId).length;
};
