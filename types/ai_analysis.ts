// AI Document Verification types

export interface AIIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category:
    | 'missing_clause'
    | 'ambiguous_term'
    | 'illegal_term'
    | 'one_sided'
    | 'missing_details'
    | 'compliance';
  clause: string;
  explanation: string;
}

export interface AnalysisResult {
  analysis_id: string;
  document_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  health_score: number; // 0-100
  issues: AIIssue[];
  recommendations: string[];
  summary: string;
}