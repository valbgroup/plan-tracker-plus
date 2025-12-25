import { useQuery } from '@tanstack/react-query';
import {
  MOCK_PORTFOLIOS,
  MOCK_PROGRAMS,
  MOCK_PROJ_TYPES,
  MOCK_PROJ_NATURES,
  MOCK_PROJ_SIZES,
  MOCK_CURRENCIES,
  MOCK_ORG_STRUCTURES,
  MOCK_EXTERNAL_ORGS,
  MOCK_EMPLOYEES,
  MOCK_LIFECYCLE_APPROACHES,
} from '@/data/masterDataMock';

// Types for the selects
export interface SelectOption {
  id: string;
  code: string;
  label: string;
  description?: string;
  parentId?: string;
}

// Transform functions
const transformPortfolios = (): SelectOption[] => 
  MOCK_PORTFOLIOS.filter(p => p.is_active).map(p => ({
    id: p.portefeuille_id,
    code: p.code,
    label: p.libelle,
    description: p.description,
  }));

const transformPrograms = (portfolioId?: string): SelectOption[] => 
  MOCK_PROGRAMS
    .filter(p => p.is_active && (!portfolioId || p.portefeuille_id === portfolioId))
    .map(p => ({
      id: p.programme_id,
      code: p.code,
      label: p.libelle,
      description: p.description,
      parentId: p.portefeuille_id,
    }));

const transformProjectTypes = (): SelectOption[] => 
  MOCK_PROJ_TYPES.filter(t => t.is_active).map(t => ({
    id: t.type_projet_id,
    code: t.code,
    label: t.libelle,
    description: t.description,
  }));

const transformProjectNatures = (): SelectOption[] => 
  MOCK_PROJ_NATURES.filter(n => n.is_active).map(n => ({
    id: n.nature_id,
    code: n.code,
    label: n.libelle,
    description: n.description,
  }));

const transformProjectSizes = (): SelectOption[] => 
  MOCK_PROJ_SIZES.filter(s => s.is_active).map(s => ({
    id: s.taille_id,
    code: s.code,
    label: s.libelle,
    description: s.description,
  }));

const transformCurrencies = (): SelectOption[] => 
  MOCK_CURRENCIES.filter(c => c.is_active).map(c => ({
    id: c.devise_id,
    code: c.code,
    label: `${c.code} - ${c.libelle}`,
    description: c.description,
  }));

const transformOrgStructures = (): SelectOption[] => 
  MOCK_ORG_STRUCTURES.filter(o => o.is_active).map(o => ({
    id: o.structure_id,
    code: o.code,
    label: o.libelle,
    description: o.description,
    parentId: o.parent_id,
  }));

const transformExternalOrgs = (): SelectOption[] => 
  MOCK_EXTERNAL_ORGS.filter(o => o.is_active).map(o => ({
    id: o.organisation_externe_id,
    code: o.raison_sociale.slice(0, 10).toUpperCase(),
    label: o.raison_sociale,
    description: o.description,
  }));

export interface EmployeeOption extends SelectOption {
  email: string;
  phone: string;
  department?: string;
}

const transformEmployees = (): EmployeeOption[] => 
  MOCK_EMPLOYEES.filter(e => e.is_active).map(e => ({
    id: e.collaborateur_id,
    code: e.matricule,
    label: `${e.prenom} ${e.nom}`,
    email: e.email,
    phone: e.telephone,
    department: e.structure_id,
  }));

const transformLifecycleApproaches = (): SelectOption[] => 
  MOCK_LIFECYCLE_APPROACHES.filter(a => a.is_active).map(a => ({
    id: a.approche_id,
    code: a.code,
    label: a.libelle,
    description: a.description,
  }));

// Hooks
export const usePortfolios = () => {
  return useQuery({
    queryKey: ['master-data', 'portfolios'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformPortfolios();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const usePrograms = (portfolioId?: string) => {
  return useQuery({
    queryKey: ['master-data', 'programs', portfolioId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformPrograms(portfolioId);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useProjectTypes = () => {
  return useQuery({
    queryKey: ['master-data', 'project-types'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformProjectTypes();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useProjectNatures = () => {
  return useQuery({
    queryKey: ['master-data', 'project-natures'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformProjectNatures();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useProjectSizes = () => {
  return useQuery({
    queryKey: ['master-data', 'project-sizes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformProjectSizes();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCurrencies = () => {
  return useQuery({
    queryKey: ['master-data', 'currencies'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformCurrencies();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useOrgStructures = () => {
  return useQuery({
    queryKey: ['master-data', 'org-structures'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformOrgStructures();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useExternalOrgs = () => {
  return useQuery({
    queryKey: ['master-data', 'external-orgs'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformExternalOrgs();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useEmployeeOptions = () => {
  return useQuery({
    queryKey: ['master-data', 'employee-options'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformEmployees();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLifecycleApproaches = () => {
  return useQuery({
    queryKey: ['master-data', 'lifecycle-approaches'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return transformLifecycleApproaches();
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Number to words converter
export const numberToWords = (num: number, currency: string = 'DZD'): string => {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  
  const currencyNames: Record<string, string> = {
    'DZD': 'Algerian Dinars',
    'USD': 'US Dollars',
    'EUR': 'Euros',
    'GBP': 'British Pounds',
    'SAR': 'Saudi Riyals',
  };
  
  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    
    for (let i = scales.length - 1; i >= 1; i--) {
      const scale = Math.pow(1000, i);
      if (n >= scale) {
        return convert(Math.floor(n / scale)) + ' ' + scales[i] + (n % scale ? ' ' + convert(n % scale) : '');
      }
    }
    return '';
  };
  
  const words = convert(Math.abs(Math.floor(num)));
  const currencyName = currencyNames[currency] || currency;
  
  return `${words} ${currencyName}`;
};
