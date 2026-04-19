export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  hint_seen?: boolean;
}

export interface ProfileFields {
  iin?: string;
  bin?: string;
  full_name?: string;
  company_name?: string;
  legal_address?: string;
  actual_address?: string;
  phone?: string;
  email?: string;
  iban?: string;
  bik?: string;
}

export interface UserProfile {
  id: string;
  label: string;
  type: 'individual' | 'legal_entity';
  fields: ProfileFields;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface FieldSchema {
  name: string;
  label: string;
  label_kz?: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'email';
  required: boolean;
}

export interface Template {
  id: string;
  type: string;
  name_ru: string;
  name_kz: string;
  category?: string;
  description?: string;
  html_body: string;
  content_json?: Record<string, unknown> | null;
  fields_schema: {
    fields: FieldSchema[];
  };
  version: number;
  is_active?: boolean;
}

export interface Contract {
  id: string;
  title: string;
  status: 'draft' | 'generated' | 'failed';
  pdf_url: string;
  template_id: string;
  created_at: string;
}

export interface ContractDetail extends Contract {
  template_type: string;
  form_data: Record<string, string>;
  content_json?: Record<string, unknown> | null;
  rendered_html: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminContract {
  id: string;
  title: string;
  status: 'draft' | 'generated' | 'failed';
  template_type: string;
  user_id: string;
  created_at: string;
}

export interface ContractVersionDetail {
  version_number: number;
  form_data: Record<string, string>;
  content_json?: Record<string, unknown> | null;
  rendered_html: string;
  created_at: string;
}

export interface AdminTemplate {
  id: string;
  type: string;
  name_ru: string;
  name_kz: string;
  html_body: string;
  content_json?: Record<string, unknown> | null;
  fields_schema: { fields: FieldSchema[] } | Record<string, unknown>;
  version: number;
  is_active: boolean;
  created_at?: string;
}

// Document / Folder types (Phase 1)

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  status: 'draft' | 'generated' | 'failed';
  source: 'template' | 'upload' | 'blank';
  folder_id: string | null;
  thumbnail_path?: string;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FolderContents {
  folder: Folder | null;
  folders: Folder[];
  documents: Document[];
}

export interface ContractVersion {
  version_number: number;
  version_name?: string;
  created_at: string;
}

// Funnel / hypothesis testing types

export type FunnelStage =
  | 'registered'
  | 'agreement'
  | 'prefill_add'
  | 'prefill_used'
  | 'agreement_5';

export interface FunnelUser {
  user_id: string;
  email: string;
  full_name: string;
  registered_at: string;
  first_agree_at: string | null;
  prefill_add_at: string | null;
  prefill_used_at: string | null;
  agree5_at: string | null;
  total_agreements: number;
  funnel_stage: FunnelStage;
}

export interface FunnelSummary {
  visits: number;
  registered: number;
  agreement: number;
  prefill_add: number;
  prefill_used: number;
  agreement_5: number;
}

export interface FunnelConversion {
  visit_to_register: number;
  register_to_agreement: number;
  agreement_to_prefill: number;
  prefill_to_used: number;
  prefill_used_to_agree5: number;
}

export interface FunnelResponse {
  summary: FunnelSummary;
  conversion: FunnelConversion;
  users: FunnelUser[];
}