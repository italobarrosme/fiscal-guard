export interface CPFData {
  id: string;
  original: string;
  formatted: string;
  isValid: boolean;
  region: string | null;
  status: 'pending' | 'verified' | 'error';
  message?: string;
}

export interface ExtractionResult {
  cpfs: string[];
}

export enum ValidationFilter {
  ALL = 'ALL',
  VALID = 'VALID',
  INVALID = 'INVALID'
}