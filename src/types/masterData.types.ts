// ============================================
// MASTER DATA TYPES - 40+ Reference Tables
// ============================================

// Base interface for all master data entities
export interface BaseMasterData {
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// SECTION 1: PROJECT QUALIFICATIONS
// ============================================

export interface ProjType extends BaseMasterData {
  type_projet_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface ProjNature extends BaseMasterData {
  nature_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface ProjSize extends BaseMasterData {
  taille_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface ProjStatus extends BaseMasterData {
  statut_id: string;
  code: string;
  libelle: string;
  ordre_affichage: number;
  is_terminal: boolean;
  description: string;
}

export interface HealthStatus extends BaseMasterData {
  etat_id: string;
  code: string;
  libelle: string;
  description: string;
  color: string;
}

export interface Portfolio extends BaseMasterData {
  portefeuille_id: string;
  code: string;
  libelle: string;
  description: string;
  is_default_global: boolean;
}

export interface Program extends BaseMasterData {
  programme_id: string;
  code: string;
  libelle: string;
  description: string;
  portefeuille_id: string;
}

export interface LifecycleApproach extends BaseMasterData {
  approche_id: string;
  code: string;
  libelle: string;
  description: string;
}

// ============================================
// SECTION 2: DELIVERABLE QUALIFICATIONS
// ============================================

export interface DeliverableType extends BaseMasterData {
  type_livrable_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface DeliverableStatus extends BaseMasterData {
  statut_livrable_id: string;
  code: string;
  libelle: string;
  ordre_affichage: number;
  is_terminal: boolean;
  description: string;
}

// ============================================
// SECTION 3: BUDGET
// ============================================

export interface BudgetType extends BaseMasterData {
  type_budget_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface Currency extends BaseMasterData {
  devise_id: string;
  code: string;
  libelle: string;
  description: string;
  is_default: boolean;
  taux_vs_default: number;
}

export interface EnvelopeType extends BaseMasterData {
  type_enveloppe_id: string;
  code: string;
  libelle: string;
  description: string;
  type_budget_id: string;
}

export interface FundingSource extends BaseMasterData {
  source_financement_id: string;
  code: string;
  libelle: string;
  description: string;
}

// ============================================
// SECTION 4: LOCALIZATION
// ============================================

export interface GeoZone extends BaseMasterData {
  geo_zone_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface Country extends BaseMasterData {
  country_id: string;
  code_iso2: string;
  code_iso3: string;
  libelle_fr: string;
  libelle_en: string;
  geo_zone_id: string;
}

export interface Region extends BaseMasterData {
  region_id: string;
  code: string;
  libelle: string;
  country_id: string;
}

export interface Province extends BaseMasterData {
  province_id: string;
  code: string;
  libelle: string;
  country_id: string;
  region_id?: string;
}

export interface District extends BaseMasterData {
  district_id: string;
  code: string;
  libelle: string;
  province_id: string;
  country_id: string;
}

export interface City extends BaseMasterData {
  city_id: string;
  libelle: string;
  district_id: string;
  province_id: string;
  country_id: string;
}

// ============================================
// SECTION 5: ORGANIZATION & STAKEHOLDERS
// ============================================

export interface OrgStructure extends BaseMasterData {
  structure_id: string;
  code: string;
  libelle: string;
  parent_id?: string;
  description: string;
}

export interface Employee extends BaseMasterData {
  collaborateur_id: string;
  nom: string;
  prenom: string;
  matricule: string;
  structure_id: string;
  poste_id: string;
  email: string;
  telephone: string;
}

export interface JobPosition extends BaseMasterData {
  poste_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface ProjectRole extends BaseMasterData {
  fonction_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface MemberRole extends BaseMasterData {
  member_role_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface ExternalOrg extends BaseMasterData {
  organisation_externe_id: string;
  raison_sociale: string;
  domaine_id: string;
  natures: string[];
  statut_juridique: string;
  taille: string;
  nb_employes: number;
  multi_site: boolean;
  vocational_roles: string[];
  adresse: string;
  description: string;
}

export interface ExternalContact extends BaseMasterData {
  collaborateur_externe_id: string;
  nom: string;
  prenom: string;
  organisation_externe_id: string;
  poste_id: string;
  email: string;
  telephone: string;
}

export interface InstanceDimension extends BaseMasterData {
  dimension_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface EntityPosition extends BaseMasterData {
  position_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface ActivityDomain extends BaseMasterData {
  domaine_id: string;
  code: string;
  libelle: string;
  description: string;
}

// ============================================
// SECTION 6: RESOURCES
// ============================================

export interface ResourceFamily extends BaseMasterData {
  famille_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface ResourceType extends BaseMasterData {
  type_id: string;
  famille_id: string;
  code: string;
  libelle: string;
  description: string;
  maintenance_required: boolean;
}

export interface Brand extends BaseMasterData {
  marque_id: string;
  libelle: string;
  image_url?: string;
  description: string;
  pays_origine_id?: string;
  site_web?: string;
  types_produits: string[];
}

export interface Resource extends BaseMasterData {
  ressource_id: string;
  famille_id: string;
  type_id: string;
  intitule: string;
  marque_id?: string;
  modele?: string;
  numero_serie?: string;
  caracteristiques?: Record<string, unknown>;
  statut: 'Disponible' | 'Occupée' | 'En maintenance' | 'Hors service' | 'En réparation';
  condition_physique: 'Neuf' | 'Bon état' | 'Usagé' | 'Défaillant';
  localisation_id?: string;
  site_specifique?: string;
  date_acquisition?: string;
  valeur_acquisition?: number;
  duree_amortissement?: number;
  responsable_id?: string;
}

// ============================================
// SECTION 7: RISKS & ISSUES
// ============================================

export interface RiskIssueType extends BaseMasterData {
  type_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface RiskResponseType extends BaseMasterData {
  type_reponse_id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface RiskResponseStatus extends BaseMasterData {
  statut_reponse_id: string;
  code: string;
  libelle: string;
  ordre_affichage: number;
  is_terminal: boolean;
}

export interface IssueStatus extends BaseMasterData {
  statut_point_id: string;
  code: string;
  libelle: string;
  ordre_affichage: number;
  is_terminal: boolean;
}

export interface PriorityScale extends BaseMasterData {
  echelle_id: string;
  usage: 'PRIORITE' | 'IMPORTANCE';
  score: number;
  libelle: string;
  description: string;
  couleur_hex: string;
  icone?: string;
  ordre_affichage: number;
}

// ============================================
// SECTION 8: AGILE
// ============================================

export interface RequirementPriority extends BaseMasterData {
  code: string;
  titre: string;
  ordre: number;
  description: string;
  color: string;
}

// ============================================
// SECTION 9: TIME & CALENDARS
// ============================================

export interface CalendarModel extends BaseMasterData {
  model_id: string;
  code: string;
  libelle: string;
  description: string;
  is_default: boolean;
  daily_work_hours: number;
  calculation_mode: 'working_days' | 'calendars';
  weekend_days: string[];
  include_holidays: boolean;
  holiday_calendar_ids: string[];
}

export interface HolidayCalendar extends BaseMasterData {
  holiday_calendar_id: string;
  code: string;
  libelle: string;
  description: string;
  country_id: string;
  holidays: Array<{
    date: string;
    libelle: string;
    is_recurring: boolean;
  }>;
}

// ============================================
// TABLE METADATA
// ============================================

export interface TableConfig {
  id: string;
  name: string;
  description: string;
  isFrozen: boolean; // Read-only tables
  section: MasterDataSection;
  columns: ColumnConfig[];
}

export interface ColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date';
  required?: boolean;
  editable?: boolean;
  options?: { value: string; label: string }[];
}

export type MasterDataSection =
  | 'project-qualifications'
  | 'deliverable-qualifications'
  | 'budget'
  | 'localization'
  | 'organization'
  | 'resources'
  | 'risks-issues'
  | 'agile'
  | 'calendars';
