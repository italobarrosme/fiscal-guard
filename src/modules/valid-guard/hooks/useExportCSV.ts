import type { FormattedCPF } from '../types';

/**
 * Hook responsável por exportar dados de CPFs para CSV.
 * 
 * @param data - Array de CPFs formatados para exportar
 * @returns Função para executar a exportação
 * 
 * @example
 * ```tsx
 * const exportCSV = useExportCSV(data);
 * 
 * <button onClick={exportCSV}>Exportar CSV</button>
 * ```
 */
export function useExportCSV(data: FormattedCPF[]) {
  const exportToCSV = () => {
    if (data.length === 0) {
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + "CPF,Valido,Regiao,Status_Receita\n"
      + data.map(row => 
          `${row.formatted},${row.isValid ? 'SIM' : 'NAO'},"${row.region || ''}",${row.receitaStatus}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cpfs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return exportToCSV;
}

