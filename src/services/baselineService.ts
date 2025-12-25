import { Baseline } from '@/types/baseline.types';
import { MOCK_BASELINES } from '@/data/mockProjectData';

export const baselineService = {
  getBaselinesByProject: async (projectId: string): Promise<Baseline[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const baselines = MOCK_BASELINES.filter(b => b.project_id === projectId);
        resolve([...baselines].sort((a, b) => b.version_number - a.version_number));
      }, 300);
    });
  },

  getCurrentBaseline: async (projectId: string): Promise<Baseline | null> => {
    return new Promise(async (resolve) => {
      const baselines = await baselineService.getBaselinesByProject(projectId);
      const current = baselines.find(b => b.status === 'APPROVED');
      resolve(current || null);
    });
  },

  createBaseline: async (baseline: Omit<Baseline, 'baseline_id' | 'created_at' | 'updated_at'>): Promise<Baseline> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBaseline: Baseline = {
          ...baseline,
          baseline_id: `baseline-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        MOCK_BASELINES.push(newBaseline);
        resolve(newBaseline);
      }, 500);
    });
  },

  submitForApproval: async (baselineId: string, submittedBy: string): Promise<Baseline> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseline = MOCK_BASELINES.find(b => b.baseline_id === baselineId);
        if (baseline && baseline.status === 'DRAFT') {
          baseline.status = 'SUBMITTED';
          baseline.submitted_by = submittedBy;
          baseline.submitted_at = new Date().toISOString();
          baseline.updated_at = new Date().toISOString();
        }
        resolve(baseline!);
      }, 300);
    });
  },

  approveBaseline: async (baselineId: string, approvedBy: string): Promise<Baseline> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseline = MOCK_BASELINES.find(b => b.baseline_id === baselineId);
        if (baseline && baseline.status === 'SUBMITTED') {
          baseline.status = 'APPROVED';
          baseline.approved_by = approvedBy;
          baseline.approved_at = new Date().toISOString();
          baseline.is_locked = true;
          baseline.updated_at = new Date().toISOString();
        }
        resolve(baseline!);
      }, 300);
    });
  },

  rejectBaseline: async (baselineId: string, rejectedBy: string, reason: string): Promise<Baseline> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseline = MOCK_BASELINES.find(b => b.baseline_id === baselineId);
        if (baseline && baseline.status === 'SUBMITTED') {
          baseline.status = 'REJECTED';
          baseline.rejected_by = rejectedBy;
          baseline.rejected_at = new Date().toISOString();
          baseline.rejection_reason = reason;
          baseline.updated_at = new Date().toISOString();
        }
        resolve(baseline!);
      }, 300);
    });
  },

  generateVersionNumber: async (projectId: string): Promise<string> => {
    return new Promise(async (resolve) => {
      const baselines = await baselineService.getBaselinesByProject(projectId);
      const maxVersion = baselines.reduce((max, b) => Math.max(max, b.version_number), 0);
      resolve(`V${maxVersion + 1}.0`);
    });
  },
};
