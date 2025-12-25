import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import {
  MOCK_ORG_STRUCTURES,
  MOCK_EMPLOYEES,
  MOCK_JOB_POSITIONS,
  MOCK_PROJECT_ROLES,
  MOCK_MEMBER_ROLES,
  MOCK_EXTERNAL_ORGS,
  MOCK_EXTERNAL_CONTACTS,
  MOCK_ACTIVITY_DOMAINS,
  MOCK_ENTITY_POSITIONS,
} from '@/data/masterDataMock';
import type {
  OrgStructure,
  Employee,
  JobPosition,
  ProjectRole,
  MemberRole,
  ExternalOrg,
  ExternalContact,
  ActivityDomain,
  EntityPosition,
} from '@/types/masterData.types';
import { Building2 } from 'lucide-react';

export default function OrganizationPage() {
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<string>('');

  const handleEdit = (item: unknown, table: string) => {
    setEditItem(item as Record<string, unknown>);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleCreate = (table: string) => {
    setEditItem(null);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleSave = (data: Record<string, unknown>) => {
    console.log('Saving:', activeTable, data);
    setIsModalOpen(false);
    setEditItem(null);
  };

  const getOrgName = (id: string) => {
    return MOCK_ORG_STRUCTURES.find((o) => o.structure_id === id)?.libelle || id;
  };

  const getJobName = (id: string) => {
    return MOCK_JOB_POSITIONS.find((j) => j.poste_id === id)?.libelle || id;
  };

  const getExternalOrgName = (id: string) => {
    return MOCK_EXTERNAL_ORGS.find((o) => o.organisation_externe_id === id)?.raison_sociale || id;
  };

  const getDomainName = (id: string) => {
    return MOCK_ACTIVITY_DOMAINS.find((d) => d.domaine_id === id)?.libelle || id;
  };

  const getFormFields = () => {
    switch (activeTable) {
      case 'org-structure':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          {
            key: 'parent_id',
            label: 'Parent Structure',
            type: 'select' as const,
            options: MOCK_ORG_STRUCTURES.map((o) => ({ value: o.structure_id, label: o.libelle })),
          },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'employee':
        return [
          { key: 'nom', label: 'Last Name', type: 'text' as const, required: true },
          { key: 'prenom', label: 'First Name', type: 'text' as const, required: true },
          { key: 'matricule', label: 'Employee ID', type: 'text' as const, required: true },
          { key: 'email', label: 'Email', type: 'text' as const, required: true },
          { key: 'telephone', label: 'Phone', type: 'text' as const },
          {
            key: 'structure_id',
            label: 'Department',
            type: 'select' as const,
            required: true,
            options: MOCK_ORG_STRUCTURES.map((o) => ({ value: o.structure_id, label: o.libelle })),
          },
          {
            key: 'poste_id',
            label: 'Position',
            type: 'select' as const,
            required: true,
            options: MOCK_JOB_POSITIONS.map((j) => ({ value: j.poste_id, label: j.libelle })),
          },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'job-position':
      case 'project-role':
      case 'member-role':
      case 'activity-domain':
      case 'entity-position':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'external-org':
        return [
          { key: 'raison_sociale', label: 'Company Name', type: 'text' as const, required: true },
          {
            key: 'domaine_id',
            label: 'Activity Domain',
            type: 'select' as const,
            required: true,
            options: MOCK_ACTIVITY_DOMAINS.map((d) => ({ value: d.domaine_id, label: d.libelle })),
          },
          { key: 'statut_juridique', label: 'Legal Status', type: 'text' as const },
          {
            key: 'taille',
            label: 'Size',
            type: 'select' as const,
            options: [
              { value: 'Startup', label: 'Startup' },
              { value: 'PME', label: 'PME' },
              { value: 'PMI', label: 'PMI' },
              { value: 'ETI', label: 'ETI' },
              { value: 'Grande', label: 'Large Enterprise' },
            ],
          },
          { key: 'nb_employes', label: 'Employees', type: 'number' as const },
          { key: 'adresse', label: 'Address', type: 'textarea' as const },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'external-contact':
        return [
          { key: 'nom', label: 'Last Name', type: 'text' as const, required: true },
          { key: 'prenom', label: 'First Name', type: 'text' as const, required: true },
          {
            key: 'organisation_externe_id',
            label: 'Organization',
            type: 'select' as const,
            required: true,
            options: MOCK_EXTERNAL_ORGS.map((o) => ({ value: o.organisation_externe_id, label: o.raison_sociale })),
          },
          {
            key: 'poste_id',
            label: 'Position',
            type: 'select' as const,
            options: MOCK_JOB_POSITIONS.map((j) => ({ value: j.poste_id, label: j.libelle })),
          },
          { key: 'email', label: 'Email', type: 'text' as const, required: true },
          { key: 'telephone', label: 'Phone', type: 'text' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organization & Stakeholders</h1>
          <p className="text-muted-foreground mt-1">
            Manage organizational structure, employees, roles, and external parties
          </p>
        </div>
      </div>

      <Tabs defaultValue="org-structure" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1 max-w-5xl">
          <TabsTrigger value="org-structure">Structure</TabsTrigger>
          <TabsTrigger value="employee">Employees</TabsTrigger>
          <TabsTrigger value="job-position">Positions</TabsTrigger>
          <TabsTrigger value="project-role">Project Roles</TabsTrigger>
          <TabsTrigger value="member-role">Member Roles</TabsTrigger>
          <TabsTrigger value="external-org">External Orgs</TabsTrigger>
          <TabsTrigger value="external-contact">Ext. Contacts</TabsTrigger>
          <TabsTrigger value="activity-domain">Domains</TabsTrigger>
          <TabsTrigger value="entity-position">Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="org-structure">
          <MasterDataTable<OrgStructure>
            data={MOCK_ORG_STRUCTURES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Name' },
              {
                key: 'parent_id',
                label: 'Parent',
                render: (value) => value ? <Badge variant="outline">{getOrgName(String(value))}</Badge> : <span className="text-muted-foreground">Root</span>,
              },
              { key: 'description', label: 'Description' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Organizational Structure"
            description="Company departments and teams hierarchy"
            onEdit={(row) => handleEdit(row, 'org-structure')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('org-structure')}
            isFrozen={false}
            idKey="structure_id"
          />
        </TabsContent>

        <TabsContent value="employee">
          <MasterDataTable<Employee>
            data={MOCK_EMPLOYEES}
            columns={[
              { key: 'matricule', label: 'ID' },
              {
                key: 'nom',
                label: 'Name',
                render: (_, row) => `${(row as Employee).prenom} ${(row as Employee).nom}`,
              },
              { key: 'email', label: 'Email' },
              {
                key: 'structure_id',
                label: 'Department',
                render: (value) => <Badge variant="outline">{getOrgName(String(value))}</Badge>,
              },
              {
                key: 'poste_id',
                label: 'Position',
                render: (value) => <Badge variant="secondary">{getJobName(String(value))}</Badge>,
              },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Employees"
            description="Internal staff directory"
            onEdit={(row) => handleEdit(row, 'employee')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('employee')}
            isFrozen={false}
            idKey="collaborateur_id"
          />
        </TabsContent>

        <TabsContent value="job-position">
          <MasterDataTable<JobPosition>
            data={MOCK_JOB_POSITIONS}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Title' },
              { key: 'description', label: 'Description' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Job Positions"
            description="Available job titles and positions"
            onEdit={(row) => handleEdit(row, 'job-position')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('job-position')}
            isFrozen={false}
            idKey="poste_id"
          />
        </TabsContent>

        <TabsContent value="project-role">
          <MasterDataTable<ProjectRole>
            data={MOCK_PROJECT_ROLES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Role' },
              { key: 'description', label: 'Description' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Project Roles"
            description="Roles in project governance"
            onEdit={(row) => handleEdit(row, 'project-role')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('project-role')}
            isFrozen={false}
            idKey="fonction_id"
          />
        </TabsContent>

        <TabsContent value="member-role">
          <MasterDataTable<MemberRole>
            data={MOCK_MEMBER_ROLES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Role' },
              { key: 'description', label: 'Description' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Team Member Roles"
            description="Roles for team members in projects"
            onEdit={(row) => handleEdit(row, 'member-role')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('member-role')}
            isFrozen={false}
            idKey="member_role_id"
          />
        </TabsContent>

        <TabsContent value="external-org">
          <MasterDataTable<ExternalOrg>
            data={MOCK_EXTERNAL_ORGS}
            columns={[
              { key: 'raison_sociale', label: 'Company' },
              {
                key: 'domaine_id',
                label: 'Domain',
                render: (value) => <Badge variant="outline">{getDomainName(String(value))}</Badge>,
              },
              { key: 'taille', label: 'Size' },
              { key: 'nb_employes', label: 'Employees' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="External Organizations"
            description="Partners, vendors, and clients"
            onEdit={(row) => handleEdit(row, 'external-org')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('external-org')}
            isFrozen={false}
            idKey="organisation_externe_id"
          />
        </TabsContent>

        <TabsContent value="external-contact">
          <MasterDataTable<ExternalContact>
            data={MOCK_EXTERNAL_CONTACTS}
            columns={[
              {
                key: 'nom',
                label: 'Name',
                render: (_, row) => `${(row as ExternalContact).prenom} ${(row as ExternalContact).nom}`,
              },
              {
                key: 'organisation_externe_id',
                label: 'Organization',
                render: (value) => <Badge variant="outline">{getExternalOrgName(String(value))}</Badge>,
              },
              { key: 'email', label: 'Email' },
              { key: 'telephone', label: 'Phone' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="External Contacts"
            description="Contacts at external organizations"
            onEdit={(row) => handleEdit(row, 'external-contact')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('external-contact')}
            isFrozen={false}
            idKey="collaborateur_externe_id"
          />
        </TabsContent>

        <TabsContent value="activity-domain">
          <MasterDataTable<ActivityDomain>
            data={MOCK_ACTIVITY_DOMAINS}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Domain' },
              { key: 'description', label: 'Description' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Activity Domains"
            description="Business sectors and industries"
            onEdit={(row) => handleEdit(row, 'activity-domain')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('activity-domain')}
            isFrozen={false}
            idKey="domaine_id"
          />
        </TabsContent>

        <TabsContent value="entity-position">
          <MasterDataTable<EntityPosition>
            data={MOCK_ENTITY_POSITIONS}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Position' },
              { key: 'description', label: 'Description' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Entity Positions"
            description="Roles of external entities (Client, Vendor, etc.)"
            onEdit={(row) => handleEdit(row, 'entity-position')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('entity-position')}
            isFrozen={false}
            idKey="position_id"
          />
        </TabsContent>
      </Tabs>

      <MasterDataFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editItem ? 'Edit Item' : 'Create Item'}
        fields={getFormFields()}
        initialData={editItem || undefined}
      />
    </div>
  );
}
