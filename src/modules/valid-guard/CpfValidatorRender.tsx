import { useState } from 'react';
import { CpfDashboard } from './CpfDashboard';
import type { CPFData } from './types';
import { validateCPF, getCPFRegion } from './extractUserDataFromText';
import { checkReceitaStatus } from '../../services/receita';
import type { UserInputData } from '@/types';

/**
 * Container Component (Render Component)
 * Responsável por gerenciar o estado bruto (Raw Data), efeitos colaterais (API Calls)
 * e orquestração.
 */
export default function CpfValidatorRender() {
  const [data, setData] = useState<CPFData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Função que orquestra a validação lógica e a chamada ao serviço da Receita
  const handleProcess = async (rawList: UserInputData[]) => {
    setIsProcessing(true);
    
    // 1. Processamento Local (Imediato)
    const initialProcessed: CPFData[] = rawList.map(({ name, cpf, dataNascimento }, index) => {
      const isValid = validateCPF(cpf);
      return {
        id: `${Date.now()}-${index}`,
        name: name,
        cpf: cpf,
        dataNascimento: dataNascimento,
        isValid,
        region: isValid ? getCPFRegion(cpf) : null,
        receitaStatus: 'PENDING',
        checkedAt: new Date()
      };
    });

    // Atualiza estado inicial com status PENDING
    setData(prev => [...initialProcessed, ...prev]);

    // 2. Verificação Assíncrona (Simulando API RFB)
    // Disparamos as verificações sem bloquear a UI
    const verifyPromises = initialProcessed.map(async ({ cpf, isValid }) => {
      const status = await checkReceitaStatus(cpf, isValid);
      
      // Atualiza o item específico no estado assim que a promessa resolve
      setData(currentData => 
        currentData.map(d => d.id === cpf ? { ...d, receitaStatus: status } : d)
      );
    });

    // Aguardamos todas apenas para limpar o flag de processamento global,
    // embora a UI atualize progressivamente.
    await Promise.all(verifyPromises);
    setIsProcessing(false);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      <CpfDashboard 
        data={data} 
        onProcess={handleProcess} 
        isProcessing={isProcessing} 
      />
    </section>
  );
}