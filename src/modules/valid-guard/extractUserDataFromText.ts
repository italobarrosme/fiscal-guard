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
  if (cleanCPF.length !== 11) return cpf;
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const getCPFRegion = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return 'Desconhecido';

  const regionDigit = parseInt(cleanCPF.charAt(8), 10);

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

/**
 * Tipo para dados extraídos de uma linha de texto
 */
export type ExtractedUserData = {
  name: string;
  cpf: string;
  dataNascimento: string;
  isValid: boolean;
};

/**
 * Extrai dados de usuário (nome, CPF e data de nascimento) de um texto.
 * Formato esperado: "NOME COMPLETO CPF DD/MM/AAAA"
 * 
 * Inclui TODOS os CPFs encontrados, mesmo os inválidos, marcando-os com isValid: false.
 * 
 * @example
 * "MARIA SUELY DA SILVA ARAUJO BRITO 06819885253 08/07/1957"
 * 
 * @param text - Texto contendo linhas com nome, CPF e data
 * @returns Array de objetos com nome, cpf, dataNascimento e isValid
 */
export const extractUserDataFromText = (text: string): ExtractedUserData[] => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const results: ExtractedUserData[] = [];

  for (const line of lines) {
    // Regex para encontrar CPF (11 dígitos) e data (DD/MM/AAAA)
    // Formato: NOME CPF DD/MM/AAAA
    // O nome pode conter múltiplos espaços, então capturamos tudo até encontrar 11 dígitos seguidos
    const pattern = /^(.+?)\s+(\d{11})\s+(\d{2}\/\d{2}\/\d{4})$/;
    const match = line.match(pattern);

    if (match) {
      const [, name, cpf, dataNascimento] = match;
      // Remove espaços extras do nome e normaliza
      const normalizedName = name.replace(/\s+/g, ' ').trim();
      const cleanCPF = cpf.trim();
      
      // Valida o CPF, mas inclui mesmo os inválidos no resultado (não formata se inválido)
      const isValid = validateCPF(cleanCPF);
      
      results.push({
        name: normalizedName,
        cpf: cleanCPF,
        dataNascimento: dataNascimento.trim(),
        isValid,
      });
    } else {
      // Se não corresponder ao padrão completo, tenta extrair CPF com quantidade variável de dígitos
      // Inclui mesmo CPFs inválidos ou fora do padrão (com quantidade errada de dígitos), apenas sem formatação
      // Procura por sequências de 8 a 15 dígitos (CPF pode ter de 8 a 11 dígitos, mas aceitamos mais para não perder dados)
      const flexiblePattern = /^(.+?)\s+(\d{8,15})\s+(\d{2}\/\d{2}\/\d{4})$/;
      const flexibleMatch = line.match(flexiblePattern);
      
      if (flexibleMatch) {
        const [, name, cpf, dataNascimento] = flexibleMatch;
        const normalizedName = name.replace(/\s+/g, ' ').trim();
        const cleanCPF = cpf.trim();
        
        // Valida o CPF (será false se não tiver 11 dígitos ou for inválido)
        const isValid = validateCPF(cleanCPF);
        
        results.push({
          name: normalizedName,
          cpf: cleanCPF,
          dataNascimento: dataNascimento.trim(),
          isValid,
        });
      } else {
        // Última tentativa: procura qualquer sequência de dígitos que possa ser um CPF
        // Procura por padrão: texto + dígitos + possível data
        const lastResortPattern = /^(.+?)\s+(\d{8,15})(?:\s+(\d{2}\/\d{2}\/\d{4}))?$/;
        const lastResortMatch = line.match(lastResortPattern);
        
        if (lastResortMatch) {
          const [, name, cpf, dataNascimento] = lastResortMatch;
          const normalizedName = name.replace(/\s+/g, ' ').trim();
          const cleanCPF = cpf.trim();
          
          // Valida o CPF (será false se não tiver 11 dígitos ou for inválido)
          const isValid = validateCPF(cleanCPF);
          
          results.push({
            name: normalizedName,
            cpf: cleanCPF,
            dataNascimento: dataNascimento ? dataNascimento.trim() : '',
            isValid,
          });
        }
      }
    }
  }

  return results;
};

/**
 * Extrai CPFs de um texto, suportando formatos:
 * - 12345678901 (11 dígitos)
 * - 123.456.789-01 (formatado)
 * - Listas separadas por vírgula, quebra de linha, etc.
 */
export const extractCPFsFromText = (text: string): string[] => {
  // Remove caracteres especiais e normaliza espaços
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  // Regex para encontrar CPFs formatados (123.456.789-01)
  const formattedRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}/g;
  const formattedMatches = normalized.match(formattedRegex) || [];
  
  // Remove os CPFs formatados do texto para evitar duplicatas
  let remainingText = normalized;
  formattedMatches.forEach(match => {
    remainingText = remainingText.replace(match, '');
  });
  
  // Regex para encontrar CPFs sem formatação (11 dígitos consecutivos)
  // Usa word boundary para evitar pegar números maiores
  const unformattedRegex = /\b\d{11}\b/g;
  const unformattedMatches = remainingText.match(unformattedRegex) || [];
  
  // Combina e remove duplicatas
  const allCPFs = [...formattedMatches, ...unformattedMatches];
  const uniqueCPFs = Array.from(new Set(allCPFs));
  
  // Remove formatação para normalizar
  return uniqueCPFs.map(cpf => cpf.replace(/\D/g, ''));
};
