import { useQuery } from '@tanstack/react-query';

// Types from Master Data
export interface OrganizationEmployee {
  id: string;
  code: string;
  name: string;
  email: string;
  department: string;
  role: string;
  isActive: boolean;
}

export interface Resource {
  id: string;
  code: string;
  name: string;
  type: 'person' | 'equipment' | 'material';
  department: string;
  availability: number;
  costPerHour: number;
  isActive: boolean;
}

export interface Methodology {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'predictive' | 'agile' | 'hybrid';
}

// Mock Master Data
const mockEmployees: OrganizationEmployee[] = [
  {
    id: 'emp-001',
    code: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    role: 'Senior PM',
    isActive: true,
  },
  {
    id: 'emp-002',
    code: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'Product',
    role: 'Product Manager',
    isActive: true,
  },
  {
    id: 'emp-003',
    code: 'EMP003',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    department: 'Finance',
    role: 'Budget Manager',
    isActive: true,
  },
  {
    id: 'emp-004',
    code: 'EMP004',
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    department: 'Engineering',
    role: 'Technical Lead',
    isActive: true,
  },
  {
    id: 'emp-005',
    code: 'EMP005',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    department: 'Operations',
    role: 'Operations Manager',
    isActive: true,
  },
];

const mockResources: Resource[] = [
  {
    id: 'res-001',
    code: 'RES001',
    name: 'Dev Team A',
    type: 'person',
    department: 'Engineering',
    availability: 100,
    costPerHour: 75,
    isActive: true,
  },
  {
    id: 'res-002',
    code: 'RES002',
    name: 'QA Team',
    type: 'person',
    department: 'Quality',
    availability: 80,
    costPerHour: 60,
    isActive: true,
  },
  {
    id: 'res-003',
    code: 'RES003',
    name: 'DevOps Engineers',
    type: 'person',
    department: 'Infrastructure',
    availability: 90,
    costPerHour: 85,
    isActive: true,
  },
  {
    id: 'res-004',
    code: 'RES004',
    name: 'Cloud Infrastructure',
    type: 'equipment',
    department: 'Infrastructure',
    availability: 95,
    costPerHour: 150,
    isActive: true,
  },
];

const mockMethodologies: Methodology[] = [
  {
    id: 'meth-001',
    code: 'PRED',
    name: 'Predictive (Waterfall)',
    description: 'Traditional sequential project approach',
    type: 'predictive',
  },
  {
    id: 'meth-002',
    code: 'AGILE',
    name: 'Agile (Scrum)',
    description: 'Iterative and incremental approach with sprints',
    type: 'agile',
  },
  {
    id: 'meth-003',
    code: 'HYBRID',
    name: 'Hybrid',
    description: 'Mix of predictive and agile elements',
    type: 'hybrid',
  },
];

// Hooks
export const useEmployees = () => {
  return useQuery({
    queryKey: ['master-data', 'employees'],
    queryFn: async () => {
      return new Promise<OrganizationEmployee[]>((resolve) => {
        setTimeout(() => resolve(mockEmployees), 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useResources = () => {
  return useQuery({
    queryKey: ['master-data', 'resources'],
    queryFn: async () => {
      return new Promise<Resource[]>((resolve) => {
        setTimeout(() => resolve(mockResources), 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useMethodologies = () => {
  return useQuery({
    queryKey: ['master-data', 'methodologies'],
    queryFn: async () => {
      return new Promise<Methodology[]>((resolve) => {
        setTimeout(() => resolve(mockMethodologies), 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Helper functions
export const filterEmployees = (
  employees: OrganizationEmployee[] | undefined,
  searchTerm: string
): OrganizationEmployee[] => {
  if (!employees) return [];
  if (!searchTerm) return employees;

  const term = searchTerm.toLowerCase();
  return employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.code.toLowerCase().includes(term)
  );
};

export const filterResources = (
  resources: Resource[] | undefined,
  searchTerm: string
): Resource[] => {
  if (!resources) return [];
  if (!searchTerm) return resources;

  const term = searchTerm.toLowerCase();
  return resources.filter(
    (res) =>
      res.name.toLowerCase().includes(term) ||
      res.code.toLowerCase().includes(term)
  );
};

export const getEmployeeById = (
  employees: OrganizationEmployee[] | undefined,
  id: string
): OrganizationEmployee | undefined => {
  return employees?.find((emp) => emp.id === id);
};

export const getResourceById = (
  resources: Resource[] | undefined,
  id: string
): Resource | undefined => {
  return resources?.find((res) => res.id === id);
};

export const getMethodologyById = (
  methodologies: Methodology[] | undefined,
  id: string
): Methodology | undefined => {
  return methodologies?.find((meth) => meth.id === id);
};
