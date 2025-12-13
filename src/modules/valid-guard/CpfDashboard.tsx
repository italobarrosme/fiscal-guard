import React from 'react';
import { InputArea } from './components/InputArea';
import { ResultsTable } from './components/ResultsTable';
import { StatsSummary } from './components/StatsSummary';
import { useCpfLogic } from './hooks/useCpfLogic';
import { CPFData } from './types';

interface CpfDashboardProps {
  data: CPFData[];
  onProcess: (rawList: string[]) => void;
  isProcessing: boolean;
}

/**
 * Presentational Component
 * Responsável apenas por desenhar a tela usando os dados que recebe e o hook de lógica de visualização.
 */
export const CpfDashboard: React.FC<CpfDashboardProps> = ({ data, onProcess, isProcessing }) => {
  // O hook useCpfLogic cuida da formatação, estatísticas e filtragem visual
  const { formatted, summary, filter, setFilter } = useCpfLogic(data);

  return (
    <div className="space-y-6">
      <InputArea onProcess={onProcess} isProcessing={isProcessing} />
      
      {data.length > 0 && (
        <>
          <StatsSummary summary={summary} />
          <ResultsTable data={formatted} filter={filter} setFilter={setFilter} />
        </>
      )}
    </div>
  );
};