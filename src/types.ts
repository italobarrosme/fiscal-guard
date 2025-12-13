export type CPFData = {
  id: string;
  original: string;
  formatted: string;
  isValid: boolean;
  region: string | null;
  status: 'pending' | 'verified' | 'error';
  message?: string;
}

export type UserInputData = {
  name: string;
  cpf: string;
  dataNascimento: string;
  isValid?: boolean;
}


export enum ValidationFilter {
  ALL = 'ALL',
  VALID = 'VALID',
  INVALID = 'INVALID'
}