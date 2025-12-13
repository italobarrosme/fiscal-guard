import { CPFStatus } from "../modules/cpf-validator/types";

// Simula uma chamada de API para verificar o status na Receita
// Em produção, isso seria uma chamada para um backend real com certificado e-CNPJ
export const checkReceitaStatus = async (cpf: string, isValid: boolean): Promise<CPFStatus> => {
  return new Promise((resolve) => {
    // Simula latência de rede aleatória entre 200ms e 800ms
    const delay = Math.random() * 600 + 200;

    setTimeout(() => {
      if (!isValid) {
        resolve('NULO');
        return;
      }

      // Simulação probabilística de status
      const rand = Math.random();
      if (rand > 0.9) resolve('SUSPENSO');
      else if (rand > 0.95) resolve('CANCELADO');
      else resolve('REGULAR');
    }, delay);
  });
};