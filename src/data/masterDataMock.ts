import type {
  ProjType,
  ProjNature,
  ProjSize,
  ProjStatus,
  HealthStatus,
  Portfolio,
  Program,
  LifecycleApproach,
  DeliverableType,
  DeliverableStatus,
  BudgetType,
  Currency,
  EnvelopeType,
  FundingSource,
  GeoZone,
  Country,
  Region,
  Province,
  District,
  City,
  OrgStructure,
  JobPosition,
  ProjectRole,
  MemberRole,
  ActivityDomain,
  InstanceDimension,
  EntityPosition,
  Employee,
  ExternalOrg,
  ExternalContact,
  ResourceFamily,
  ResourceType,
  Brand,
  Resource,
  RiskIssueType,
  RiskResponseType,
  RiskResponseStatus,
  IssueStatus,
  PriorityScale,
  RequirementPriority,
  CalendarModel,
  HolidayCalendar,
} from '@/types/masterData.types';

// ============================================
// SECTION 1: PROJECT QUALIFICATIONS
// ============================================

export const MOCK_PROJ_TYPES: ProjType[] = [
  { type_projet_id: '1', code: 'TECH', libelle: 'Technological Project', description: 'Technology and digital transformation projects', is_active: true },
  { type_projet_id: '2', code: 'INFRA', libelle: 'Infrastructure', description: 'Physical infrastructure projects', is_active: true },
  { type_projet_id: '3', code: 'ORG', libelle: 'Organizational', description: 'Organizational transformation projects', is_active: true },
  { type_projet_id: '4', code: 'DEV', libelle: 'Development', description: 'Software development projects', is_active: true },
  { type_projet_id: '5', code: 'MAINT', libelle: 'Maintenance', description: 'Maintenance and support projects', is_active: true },
  { type_projet_id: '6', code: 'COMPLIANCE', libelle: 'Compliance', description: 'Regulatory compliance projects', is_active: false },
];

export const MOCK_PROJ_NATURES: ProjNature[] = [
  { nature_id: '1', code: 'INT', libelle: 'Internal', description: 'Internal company projects', is_active: true },
  { nature_id: '2', code: 'EXT', libelle: 'External', description: 'External client projects', is_active: true },
];

export const MOCK_PROJ_SIZES: ProjSize[] = [
  { taille_id: '1', code: 'SMALL', libelle: 'Small', description: 'Budget < 100K, Duration < 3 months', is_active: true },
  { taille_id: '2', code: 'MEDIUM', libelle: 'Medium', description: 'Budget 100K-500K, Duration 3-12 months', is_active: true },
  { taille_id: '3', code: 'LARGE', libelle: 'Large', description: 'Budget > 500K, Duration > 12 months', is_active: true },
];

export const MOCK_PROJ_STATUSES: ProjStatus[] = [
  { statut_id: '1', code: 'INIT', libelle: 'Initiation', ordre_affichage: 1, is_terminal: false, description: 'Project initiation phase', is_active: true },
  { statut_id: '2', code: 'PLAN', libelle: 'Planning', ordre_affichage: 2, is_terminal: false, description: 'Project planning phase', is_active: true },
  { statut_id: '3', code: 'EXEC', libelle: 'Execution', ordre_affichage: 3, is_terminal: false, description: 'Project execution phase', is_active: true },
  { statut_id: '4', code: 'CLOT', libelle: 'Closed', ordre_affichage: 4, is_terminal: true, description: 'Project completed', is_active: true },
  { statut_id: '5', code: 'SUSP', libelle: 'Suspended', ordre_affichage: 5, is_terminal: true, description: 'Project suspended', is_active: true },
];

export const MOCK_HEALTH_STATUSES: HealthStatus[] = [
  { etat_id: '1', code: 'NORMAL', libelle: 'On Track', description: 'Project is on schedule', color: '#22c55e', is_active: true },
  { etat_id: '2', code: 'ADV', libelle: 'Ahead', description: 'Project is ahead of schedule', color: '#3b82f6', is_active: true },
  { etat_id: '3', code: 'LATE', libelle: 'Delayed', description: 'Project is behind schedule', color: '#f59e0b', is_active: true },
  { etat_id: '4', code: 'VLATE', libelle: 'Critical Delay', description: 'Project is significantly delayed', color: '#ef4444', is_active: true },
];

export const MOCK_PORTFOLIOS: Portfolio[] = [
  { portefeuille_id: '1', code: 'GLOBAL', libelle: 'Global Portfolio', description: 'Default global portfolio', is_default_global: true, is_active: true },
  { portefeuille_id: '2', code: 'IT', libelle: 'IT Portfolio', description: 'Information Technology projects', is_default_global: false, is_active: true },
  { portefeuille_id: '3', code: 'STRAT', libelle: 'Strategic Portfolio', description: 'Strategic initiatives', is_default_global: false, is_active: true },
];

export const MOCK_PROGRAMS: Program[] = [
  { programme_id: '1', code: 'DX2024', libelle: 'Digital Transformation 2024', description: 'Digital transformation program', portefeuille_id: '2', is_active: true },
  { programme_id: '2', code: 'CLOUD', libelle: 'Cloud Migration', description: 'Cloud infrastructure migration', portefeuille_id: '2', is_active: true },
  { programme_id: '3', code: 'INNOV', libelle: 'Innovation Lab', description: 'Innovation and R&D program', portefeuille_id: '3', is_active: true },
];

export const MOCK_LIFECYCLE_APPROACHES: LifecycleApproach[] = [
  { approche_id: '1', code: 'PRED', libelle: 'Predictive', description: 'Waterfall methodology with defined phases', is_active: true },
  { approche_id: '2', code: 'AGI', libelle: 'Agile', description: 'Iterative development with sprints', is_active: true },
  { approche_id: '3', code: 'HYB', libelle: 'Hybrid', description: 'Combination of predictive and agile approaches', is_active: true },
];

// ============================================
// SECTION 2: DELIVERABLE QUALIFICATIONS
// ============================================

export const MOCK_DELIVERABLE_TYPES: DeliverableType[] = [
  { type_livrable_id: '1', code: 'REP', libelle: 'Report', description: 'Documentation and reports', is_active: true },
  { type_livrable_id: '2', code: 'SW', libelle: 'Software', description: 'Software deliverables', is_active: true },
  { type_livrable_id: '3', code: 'SRV', libelle: 'Service', description: 'Service deliverables', is_active: true },
  { type_livrable_id: '4', code: 'DOC', libelle: 'Documentation', description: 'Technical documentation', is_active: true },
];

export const MOCK_DELIVERABLE_STATUSES: DeliverableStatus[] = [
  { statut_livrable_id: '1', code: 'OPEN', libelle: 'Open', ordre_affichage: 1, is_terminal: false, description: 'Deliverable created', is_active: true },
  { statut_livrable_id: '2', code: 'PLAN', libelle: 'Planned', ordre_affichage: 2, is_terminal: false, description: 'Deliverable planned', is_active: true },
  { statut_livrable_id: '3', code: 'IN_PROGRESS', libelle: 'In Progress', ordre_affichage: 3, is_terminal: false, description: 'Work in progress', is_active: true },
  { statut_livrable_id: '4', code: 'FINAL', libelle: 'Finalized', ordre_affichage: 4, is_terminal: false, description: 'Deliverable finalized', is_active: true },
  { statut_livrable_id: '5', code: 'DELIVERED', libelle: 'Delivered', ordre_affichage: 5, is_terminal: false, description: 'Deliverable submitted', is_active: true },
  { statut_livrable_id: '6', code: 'ACCEPTED', libelle: 'Accepted', ordre_affichage: 6, is_terminal: true, description: 'Deliverable accepted', is_active: true },
  { statut_livrable_id: '7', code: 'REJECTED', libelle: 'Rejected', ordre_affichage: 7, is_terminal: true, description: 'Deliverable rejected', is_active: true },
];

// ============================================
// SECTION 3: BUDGET
// ============================================

export const MOCK_BUDGET_TYPES: BudgetType[] = [
  { type_budget_id: '1', code: 'CAPEX', libelle: 'Capital Expenditure', description: 'Capital investments', is_active: true },
  { type_budget_id: '2', code: 'OPEX', libelle: 'Operating Expenditure', description: 'Operating costs', is_active: true },
  { type_budget_id: '3', code: 'ND', libelle: 'Not Defined', description: 'Unclassified expenses', is_active: true },
];

export const MOCK_CURRENCIES: Currency[] = [
  { devise_id: '1', code: 'DZD', libelle: 'Algerian Dinar', description: 'Local currency', is_default: true, taux_vs_default: 1.0, is_active: true },
  { devise_id: '2', code: 'USD', libelle: 'US Dollar', description: 'United States Dollar', is_default: false, taux_vs_default: 0.0074, is_active: true },
  { devise_id: '3', code: 'EUR', libelle: 'Euro', description: 'European Union', is_default: false, taux_vs_default: 0.0068, is_active: true },
  { devise_id: '4', code: 'SAR', libelle: 'Saudi Riyal', description: 'Saudi Arabia', is_default: false, taux_vs_default: 0.028, is_active: true },
];

export const MOCK_ENVELOPE_TYPES: EnvelopeType[] = [
  { type_enveloppe_id: '1', code: 'SAL', libelle: 'Salaries', description: 'Employee salaries', type_budget_id: '2', is_active: true },
  { type_enveloppe_id: '2', code: 'LIC', libelle: 'Licenses', description: 'Software licenses', type_budget_id: '2', is_active: true },
  { type_enveloppe_id: '3', code: 'EQP', libelle: 'Equipment', description: 'Hardware equipment', type_budget_id: '1', is_active: true },
  { type_enveloppe_id: '4', code: 'INF', libelle: 'Infrastructure', description: 'Infrastructure costs', type_budget_id: '1', is_active: true },
  { type_enveloppe_id: '5', code: 'COM', libelle: 'Communication', description: 'Communication expenses', type_budget_id: '2', is_active: true },
];

export const MOCK_FUNDING_SOURCES: FundingSource[] = [
  { source_financement_id: '1', code: 'ASSOC', libelle: 'Associates', description: 'Company shareholders', is_active: true },
  { source_financement_id: '2', code: 'BANK', libelle: 'Bank Loan', description: 'Bank financing', is_active: true },
  { source_financement_id: '3', code: 'DG', libelle: 'General Direction', description: 'Internal budget allocation', is_active: true },
  { source_financement_id: '4', code: 'SUBV', libelle: 'Subsidy', description: 'Government or external subsidy', is_active: true },
  { source_financement_id: '5', code: 'CLI', libelle: 'Client', description: 'Client funding', is_active: true },
];

// ============================================
// SECTION 4: LOCALIZATION
// ============================================

export const MOCK_GEO_ZONES: GeoZone[] = [
  { geo_zone_id: '1', code: 'NAFR', libelle: 'North Africa', description: 'North African region', is_active: true },
  { geo_zone_id: '2', code: 'SSA', libelle: 'Sub-Saharan Africa', description: 'Sub-Saharan Africa', is_active: true },
  { geo_zone_id: '3', code: 'EU', libelle: 'Europe', description: 'European Union', is_active: true },
  { geo_zone_id: '4', code: 'MENA', libelle: 'Middle East', description: 'Middle East and North Africa', is_active: true },
  { geo_zone_id: '5', code: 'ASIA', libelle: 'Asia Pacific', description: 'Asia and Pacific region', is_active: true },
];

export const MOCK_COUNTRIES: Country[] = [
  { country_id: '1', code_iso2: 'DZ', code_iso3: 'DZA', libelle_fr: 'Algérie', libelle_en: 'Algeria', geo_zone_id: '1', is_active: true },
  { country_id: '2', code_iso2: 'FR', code_iso3: 'FRA', libelle_fr: 'France', libelle_en: 'France', geo_zone_id: '3', is_active: true },
  { country_id: '3', code_iso2: 'SA', code_iso3: 'SAU', libelle_fr: 'Arabie Saoudite', libelle_en: 'Saudi Arabia', geo_zone_id: '4', is_active: true },
  { country_id: '4', code_iso2: 'US', code_iso3: 'USA', libelle_fr: 'États-Unis', libelle_en: 'United States', geo_zone_id: '5', is_active: true },
  { country_id: '5', code_iso2: 'DE', code_iso3: 'DEU', libelle_fr: 'Allemagne', libelle_en: 'Germany', geo_zone_id: '3', is_active: true },
];

// Additional Localization Data
export const MOCK_REGIONS: Region[] = [
  { region_id: '1', code: 'NORTH', libelle: 'North', country_id: '1', is_active: true },
  { region_id: '2', code: 'SOUTH', libelle: 'South', country_id: '1', is_active: true },
  { region_id: '3', code: 'EAST', libelle: 'East', country_id: '1', is_active: true },
  { region_id: '4', code: 'WEST', libelle: 'West', country_id: '1', is_active: true },
  { region_id: '5', code: 'IDF', libelle: 'Île-de-France', country_id: '2', is_active: true },
];

export const MOCK_PROVINCES: Province[] = [
  { province_id: '1', code: '16', libelle: 'Alger', country_id: '1', region_id: '1', is_active: true },
  { province_id: '2', code: '09', libelle: 'Blida', country_id: '1', region_id: '1', is_active: true },
  { province_id: '3', code: '31', libelle: 'Oran', country_id: '1', region_id: '4', is_active: true },
  { province_id: '4', code: '75', libelle: 'Paris', country_id: '2', region_id: '5', is_active: true },
];

export const MOCK_DISTRICTS: District[] = [
  { district_id: '1', code: 'DA-16-01', libelle: 'Bab El Oued', province_id: '1', country_id: '1', is_active: true },
  { district_id: '2', code: 'DA-16-02', libelle: 'Hussein Dey', province_id: '1', country_id: '1', is_active: true },
  { district_id: '3', code: 'DA-16-03', libelle: 'El Harrach', province_id: '1', country_id: '1', is_active: true },
];

export const MOCK_CITIES: City[] = [
  { city_id: '1', libelle: 'Algiers', district_id: '1', province_id: '1', country_id: '1', is_active: true },
  { city_id: '2', libelle: 'Hussein Dey', district_id: '2', province_id: '1', country_id: '1', is_active: true },
  { city_id: '3', libelle: 'El Harrach', district_id: '3', province_id: '1', country_id: '1', is_active: true },
];

// ============================================
// SECTION 5: ORGANIZATION
// ============================================

export const MOCK_ORG_STRUCTURES: OrgStructure[] = [
  { structure_id: '1', code: 'DG', libelle: 'General Direction', parent_id: undefined, description: 'Executive management', is_active: true },
  { structure_id: '2', code: 'DSI', libelle: 'IT Department', parent_id: '1', description: 'Information Systems', is_active: true },
  { structure_id: '3', code: 'DRH', libelle: 'HR Department', parent_id: '1', description: 'Human Resources', is_active: true },
  { structure_id: '4', code: 'BP', libelle: 'Project Office', parent_id: '2', description: 'PMO', is_active: true },
];

export const MOCK_JOB_POSITIONS: JobPosition[] = [
  { poste_id: '1', code: 'PM', libelle: 'Project Manager', description: 'Leads project execution', is_active: true },
  { poste_id: '2', code: 'DEV', libelle: 'Developer', description: 'Software development', is_active: true },
  { poste_id: '3', code: 'BA', libelle: 'Business Analyst', description: 'Requirements analysis', is_active: true },
  { poste_id: '4', code: 'ARCH', libelle: 'Architect', description: 'Technical architecture', is_active: true },
  { poste_id: '5', code: 'QA', libelle: 'Quality Analyst', description: 'Quality assurance', is_active: true },
];

export const MOCK_PROJECT_ROLES: ProjectRole[] = [
  { fonction_id: '1', code: 'SPONSOR', libelle: 'Sponsor', description: 'Project sponsor and champion', is_active: true },
  { fonction_id: '2', code: 'PMO', libelle: 'PMO', description: 'Project Management Office', is_active: true },
  { fonction_id: '3', code: 'EXP_TECH', libelle: 'Technical Expert', description: 'Subject matter expert', is_active: true },
  { fonction_id: '4', code: 'RISK_MGR', libelle: 'Risk Manager', description: 'Risk management', is_active: true },
];

export const MOCK_MEMBER_ROLES: MemberRole[] = [
  { member_role_id: '1', code: 'DEV_BACKEND', libelle: 'Backend Developer', description: 'Server-side development', is_active: true },
  { member_role_id: '2', code: 'DEV_FRONTEND', libelle: 'Frontend Developer', description: 'UI development', is_active: true },
  { member_role_id: '3', code: 'SCRUM_MASTER', libelle: 'Scrum Master', description: 'Agile facilitation', is_active: true },
  { member_role_id: '4', code: 'PRODUCT_OWNER', libelle: 'Product Owner', description: 'Product management', is_active: true },
];

export const MOCK_ACTIVITY_DOMAINS: ActivityDomain[] = [
  { domaine_id: '1', code: 'TELECOM', libelle: 'Telecommunications', description: 'Telecom industry', is_active: true },
  { domaine_id: '2', code: 'ENERGY', libelle: 'Energy', description: 'Energy sector', is_active: true },
  { domaine_id: '3', code: 'IT', libelle: 'Information Technology', description: 'IT services', is_active: true },
  { domaine_id: '4', code: 'FINANCE', libelle: 'Finance', description: 'Financial services', is_active: true },
];

export const MOCK_INSTANCE_DIMENSIONS: InstanceDimension[] = [
  { dimension_id: '1', code: 'GOV', libelle: 'Governance', description: 'Governance dimension', is_active: true },
  { dimension_id: '2', code: 'MGMT', libelle: 'Management', description: 'Management dimension', is_active: true },
  { dimension_id: '3', code: 'OPR', libelle: 'Operational', description: 'Operational dimension', is_active: true },
];

export const MOCK_ENTITY_POSITIONS: EntityPosition[] = [
  { position_id: '1', code: 'CLI', libelle: 'Client', description: 'Customer organization', is_active: true },
  { position_id: '2', code: 'FOU', libelle: 'Supplier', description: 'Vendor organization', is_active: true },
  { position_id: '3', code: 'REG', libelle: 'Regulator', description: 'Regulatory body', is_active: true },
  { position_id: '4', code: 'SPN', libelle: 'Sponsor', description: 'Sponsor organization', is_active: true },
  { position_id: '5', code: 'PRT', libelle: 'Partner', description: 'Partner organization', is_active: true },
];

// ============================================
// SECTION 6: RESOURCES
// ============================================

export const MOCK_RESOURCE_FAMILIES: ResourceFamily[] = [
  { famille_id: '1', code: 'IT', libelle: 'IT Equipment', description: 'Information technology resources', is_active: true },
  { famille_id: '2', code: 'TRANS', libelle: 'Transport', description: 'Vehicles and transport', is_active: true },
  { famille_id: '3', code: 'IMMO', libelle: 'Real Estate', description: 'Buildings and facilities', is_active: true },
  { famille_id: '4', code: 'OUT', libelle: 'Tools', description: 'Tools and equipment', is_active: true },
];

export const MOCK_RESOURCE_TYPES: ResourceType[] = [
  { type_id: '1', famille_id: '1', code: 'LAPTOP', libelle: 'Laptop', description: 'Portable computer', maintenance_required: true, is_active: true },
  { type_id: '2', famille_id: '1', code: 'SERVER', libelle: 'Server', description: 'Server hardware', maintenance_required: true, is_active: true },
  { type_id: '3', famille_id: '3', code: 'SALLE_REUNION', libelle: 'Meeting Room', description: 'Conference room', maintenance_required: false, is_active: true },
  { type_id: '4', famille_id: '2', code: 'VEHICULE', libelle: 'Vehicle', description: 'Company vehicle', maintenance_required: true, is_active: true },
];

// ============================================
// SECTION 7: RISKS & ISSUES
// ============================================

export const MOCK_RISK_ISSUE_TYPES: RiskIssueType[] = [
  { type_id: '1', code: 'LEGAL', libelle: 'Legal', description: 'Legal and compliance risks', is_active: true },
  { type_id: '2', code: 'TECH', libelle: 'Technical', description: 'Technical risks', is_active: true },
  { type_id: '3', code: 'ORG', libelle: 'Organizational', description: 'Organizational risks', is_active: true },
  { type_id: '4', code: 'FIN', libelle: 'Financial', description: 'Financial risks', is_active: true },
];

export const MOCK_RISK_RESPONSE_TYPES: RiskResponseType[] = [
  { type_reponse_id: '1', code: 'MITIG', libelle: 'Mitigation', description: 'Reduce probability or impact', is_active: true },
  { type_reponse_id: '2', code: 'TRANS', libelle: 'Transfer', description: 'Transfer to third party', is_active: true },
  { type_reponse_id: '3', code: 'AVOID', libelle: 'Avoidance', description: 'Eliminate the risk', is_active: true },
  { type_reponse_id: '4', code: 'ACCEPT', libelle: 'Acceptance', description: 'Accept the risk', is_active: true },
];

export const MOCK_RISK_RESPONSE_STATUSES: RiskResponseStatus[] = [
  { statut_reponse_id: '1', code: 'NOT_PLAN', libelle: 'Not Planned', ordre_affichage: 1, is_terminal: false, is_active: true },
  { statut_reponse_id: '2', code: 'PLAN', libelle: 'Planned', ordre_affichage: 2, is_terminal: false, is_active: true },
  { statut_reponse_id: '3', code: 'APPLIQUE', libelle: 'Applied', ordre_affichage: 3, is_terminal: true, is_active: true },
  { statut_reponse_id: '4', code: 'OBSOLETE', libelle: 'Obsolete', ordre_affichage: 4, is_terminal: true, is_active: true },
];

export const MOCK_ISSUE_STATUSES: IssueStatus[] = [
  { statut_point_id: '1', code: 'NEW', libelle: 'New', ordre_affichage: 1, is_terminal: false, is_active: true },
  { statut_point_id: '2', code: 'EN_COURS', libelle: 'In Progress', ordre_affichage: 2, is_terminal: false, is_active: true },
  { statut_point_id: '3', code: 'RESOLU', libelle: 'Resolved', ordre_affichage: 3, is_terminal: true, is_active: true },
  { statut_point_id: '4', code: 'NON_RESOLU', libelle: 'Unresolved', ordre_affichage: 4, is_terminal: true, is_active: true },
];

export const MOCK_PRIORITY_SCALES: PriorityScale[] = [
  { echelle_id: '1', usage: 'PRIORITE', score: 1, libelle: 'Very Low', description: 'Lowest priority', couleur_hex: '#94a3b8', ordre_affichage: 1, is_active: true },
  { echelle_id: '2', usage: 'PRIORITE', score: 3, libelle: 'Low', description: 'Low priority', couleur_hex: '#22c55e', ordre_affichage: 2, is_active: true },
  { echelle_id: '3', usage: 'PRIORITE', score: 5, libelle: 'Medium', description: 'Medium priority', couleur_hex: '#f59e0b', ordre_affichage: 3, is_active: true },
  { echelle_id: '4', usage: 'PRIORITE', score: 7, libelle: 'High', description: 'High priority', couleur_hex: '#f97316', ordre_affichage: 4, is_active: true },
  { echelle_id: '5', usage: 'PRIORITE', score: 10, libelle: 'Critical', description: 'Critical priority', couleur_hex: '#ef4444', ordre_affichage: 5, is_active: true },
];

// ============================================
// SECTION 8: AGILE
// ============================================

export const MOCK_REQUIREMENT_PRIORITIES: RequirementPriority[] = [
  { code: 'M', titre: 'Must Have', ordre: 1, description: 'Essential requirements', color: '#ef4444', is_active: true },
  { code: 'S', titre: 'Should Have', ordre: 2, description: 'Important requirements', color: '#f97316', is_active: true },
  { code: 'C', titre: 'Could Have', ordre: 3, description: 'Nice-to-have requirements', color: '#f59e0b', is_active: true },
  { code: 'W', titre: "Won't Have", ordre: 4, description: 'Not in scope', color: '#94a3b8', is_active: true },
];

// ============================================
// SECTION 9: CALENDARS
// ============================================

export const MOCK_CALENDAR_MODELS: CalendarModel[] = [
  { 
    model_id: '1', 
    code: 'STD35', 
    libelle: 'Standard 35h', 
    description: 'Standard 35-hour work week',
    is_default: true,
    daily_work_hours: 7,
    calculation_mode: 'working_days',
    weekend_days: ['Saturday', 'Sunday'],
    include_holidays: true,
    holiday_calendar_ids: [],
    is_active: true 
  },
  { 
    model_id: '2', 
    code: 'STD40', 
    libelle: 'Standard 40h', 
    description: 'Standard 40-hour work week',
    is_default: false,
    daily_work_hours: 8,
    calculation_mode: 'working_days',
    weekend_days: ['Saturday', 'Sunday'],
    include_holidays: true,
    holiday_calendar_ids: [],
    is_active: true 
  },
];

// Additional Organization Data
export const MOCK_EMPLOYEES: Employee[] = [
  { collaborateur_id: '1', nom: 'Benali', prenom: 'Ahmed', matricule: 'EMP001', structure_id: '2', poste_id: '1', email: 'ahmed.benali@company.dz', telephone: '+213 555 0001', is_active: true },
  { collaborateur_id: '2', nom: 'Kaci', prenom: 'Fatima', matricule: 'EMP002', structure_id: '4', poste_id: '2', email: 'fatima.kaci@company.dz', telephone: '+213 555 0002', is_active: true },
  { collaborateur_id: '3', nom: 'Hamdi', prenom: 'Karim', matricule: 'EMP003', structure_id: '2', poste_id: '4', email: 'karim.hamdi@company.dz', telephone: '+213 555 0003', is_active: true },
  { collaborateur_id: '4', nom: 'Saidi', prenom: 'Amina', matricule: 'EMP004', structure_id: '3', poste_id: '3', email: 'amina.saidi@company.dz', telephone: '+213 555 0004', is_active: true },
];

export const MOCK_EXTERNAL_ORGS: ExternalOrg[] = [
  { organisation_externe_id: '1', raison_sociale: 'TechVendor SARL', domaine_id: '3', natures: ['Private'], statut_juridique: 'SARL', taille: 'PME', nb_employes: 50, multi_site: false, vocational_roles: ['Fournisseur'], adresse: 'Algiers, Algeria', description: 'IT vendor', is_active: true },
  { organisation_externe_id: '2', raison_sociale: 'Global Partners Inc', domaine_id: '4', natures: ['Private'], statut_juridique: 'SPA', taille: 'Grande', nb_employes: 500, multi_site: true, vocational_roles: ['Partenaire'], adresse: 'Paris, France', description: 'Strategic partner', is_active: true },
  { organisation_externe_id: '3', raison_sociale: 'Ministry of Digital', domaine_id: '3', natures: ['Public'], statut_juridique: 'EPIC', taille: 'ETI', nb_employes: 200, multi_site: true, vocational_roles: ['Régulateur'], adresse: 'Algiers, Algeria', description: 'Government regulator', is_active: true },
];

export const MOCK_EXTERNAL_CONTACTS: ExternalContact[] = [
  { collaborateur_externe_id: '1', nom: 'Martin', prenom: 'Jean', organisation_externe_id: '2', poste_id: '1', email: 'jean.martin@globalpartners.com', telephone: '+33 1 23 45 67 89', is_active: true },
  { collaborateur_externe_id: '2', nom: 'Boudiaf', prenom: 'Mohamed', organisation_externe_id: '1', poste_id: '2', email: 'mohamed.boudiaf@techvendor.dz', telephone: '+213 555 1234', is_active: true },
];

// Additional Resources Data
export const MOCK_BRANDS: Brand[] = [
  { marque_id: '1', libelle: 'Dell', description: 'Computer manufacturer', site_web: 'https://dell.com', types_produits: ['1', '2'], is_active: true },
  { marque_id: '2', libelle: 'HP', description: 'Hardware and software', site_web: 'https://hp.com', types_produits: ['1', '2'], is_active: true },
  { marque_id: '3', libelle: 'Toyota', description: 'Automotive manufacturer', site_web: 'https://toyota.com', types_produits: ['4'], is_active: true },
];

export const MOCK_RESOURCES: Resource[] = [
  { ressource_id: '1', famille_id: '1', type_id: '1', intitule: 'Laptop Dell XPS 15', marque_id: '1', modele: 'XPS 15 9530', numero_serie: 'SN001234', statut: 'Disponible', condition_physique: 'Neuf', site_specifique: 'Building A, Floor 2', is_active: true },
  { ressource_id: '2', famille_id: '1', type_id: '2', intitule: 'Server HP ProLiant', marque_id: '2', modele: 'DL380 Gen10', numero_serie: 'SN005678', statut: 'Occupée', condition_physique: 'Bon état', site_specifique: 'Data Center', is_active: true },
  { ressource_id: '3', famille_id: '3', type_id: '3', intitule: 'Meeting Room Alpha', statut: 'Disponible', condition_physique: 'Bon état', site_specifique: 'Building A, Floor 1', is_active: true },
  { ressource_id: '4', famille_id: '2', type_id: '4', intitule: 'Toyota Hilux', marque_id: '3', modele: 'Hilux 2023', numero_serie: 'VIN123456', statut: 'En maintenance', condition_physique: 'Usagé', site_specifique: 'Parking Lot B', is_active: true },
];

// Holiday Calendar Data (placeholder for future)
export const MOCK_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  { 
    holiday_calendar_id: '1', 
    code: 'ALGERIA', 
    libelle: 'Algeria Holidays', 
    description: 'Public holidays in Algeria',
    country_id: '1',
    holidays: [
      { date: '2024-01-01', libelle: 'New Year', is_recurring: true },
      { date: '2024-07-05', libelle: 'Independence Day', is_recurring: true },
      { date: '2024-11-01', libelle: 'Revolution Day', is_recurring: true },
    ],
    is_active: true 
  },
];
