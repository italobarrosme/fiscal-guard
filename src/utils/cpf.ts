// Logic to calculate verification digits
const calculateDigit = (digits: number[], factor: number): number => {
  let sum = 0;
  for (const digit of digits) {
    sum += digit * factor--;
  }
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
};

export const validateCPF = (cpf: string): boolean => {
  // Remove non-digits
  const cleanCPF = cpf.replace(/\D/g, '');

  // Check length and known invalid patterns (all digits equal)
  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) {
    return false;
  }

  const digits = cleanCPF.split('').map(Number);
  const digit1 = calculateDigit(digits.slice(0, 9), 10);
  const digit2 = calculateDigit(digits.slice(0, 10), 11);

  return digit1 === digits[9] && digit2 === digits[10];
};

export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const getCPFRegion = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return 'Desconhecido';

  const regionDigit = parseInt(cleanCPF.charAt(8));

  const regions: Record<number, string> = {
    1: 'DF, GO, MS, MT, TO',
    2: 'AC, AM, AP, PA, RO, RR',
    3: 'CE, MA, PI',
    4: 'AL, PB, PE, RN',
    5: 'BA, SE',
    6: 'MG',
    7: 'ES, RJ',
    8: 'SP',
    9: 'PR, SC',
    0: 'RS',
  };

  return regions[regionDigit] || 'Desconhecido';
};