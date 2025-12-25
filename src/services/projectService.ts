import { Project } from '@/types/project.types';
import { MOCK_PROJECTS } from '@/data/mockProjectData';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_PROJECTS]), 300);
    });
  },

  getProject: async (projectId: string): Promise<Project | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = MOCK_PROJECTS.find(p => p.project_id === projectId);
        resolve(project || null);
      }, 300);
    });
  },

  createProject: async (project: Omit<Project, 'project_id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProject: Project = {
          ...project,
          project_id: `proj-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        MOCK_PROJECTS.push(newProject);
        resolve(newProject);
      }, 500);
    });
  },

  updateProject: async (projectId: string, updates: Partial<Project>): Promise<Project> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = MOCK_PROJECTS.find(p => p.project_id === projectId);
        if (project) {
          Object.assign(project, {
            ...updates,
            updated_at: new Date().toISOString(),
          });
        }
        resolve(project!);
      }, 300);
    });
  },

  deleteProject: async (projectId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_PROJECTS.findIndex(p => p.project_id === projectId);
        if (index > -1) {
          MOCK_PROJECTS.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  },

  archiveProject: async (projectId: string): Promise<Project> => {
    return projectService.updateProject(projectId, { is_active: false });
  },

  duplicateProject: async (projectId: string): Promise<Project> => {
    return new Promise(async (resolve) => {
      const original = await projectService.getProject(projectId);
      if (!original) throw new Error('Project not found');

      const duplicated = await projectService.createProject({
        ...original,
        libellé: `${original.libellé} (copy)`,
        code: `${original.code}-COPY-${Date.now()}`,
      });

      resolve(duplicated);
    });
  },
};
