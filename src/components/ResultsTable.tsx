import { useMemo } from 'react';
import { CheckCircle2, XCircle, MapPin, AlertCircle, Download } from 'lucide-react';
import type { CPFData } from '../modules/valid-guard/types';
import { ValidationFilter } from '../modules/valid-guard/types';
import { formatCPF } from '../modules/valid-guard/extractUserDataFromText';

interface ResultsTableProps {
  data: CPFData[];
  filter: ValidationFilter;
  setFilter: (filter: ValidationFilter) => void;
}

export const ResultsTable = ({ data, filter, setFilter }: ResultsTableProps) => {
  const filteredData = useMemo(() => {
    switch (filter) {
      case ValidationFilter.VALID:
        return data.filter(d => d.isValid);
      case ValidationFilter.INVALID:
        return data.filter(d => !d.isValid);
      default:
        return data;
    }
  }, [data, filter]);

  const stats = useMemo(() => {
    const valid = data.filter(d => d.isValid).length;
    return {
      total: data.length,
      valid,
      invalid: data.length - valid
    };
  }, [data]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Original,Formatado,Valido,Regiao\n"
      + filteredData.map(row => {
        const formatted = row.isValid ? formatCPF(row.cpf) : row.cpf;
        return `${row.cpf},${formatted},${row.isValid ? 'SIM' : 'NAO'},"${row.region || '-'}"`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "resultado_cpfs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter(ValidationFilter.ALL)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === ValidationFilter.ALL 
                ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-300' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setFilter(ValidationFilter.VALID)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === ValidationFilter.VALID 
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Válidos ({stats.valid})
          </button>
          <button
            type="button"
            onClick={() => setFilter(ValidationFilter.INVALID)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === ValidationFilter.INVALID 
                ? 'bg-red-50 text-red-700 ring-1 ring-red-200' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Inválidos ({stats.invalid})
          </button>
        </div>

        <button 
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">CPF</th>
              <th className="px-6 py-3">Algoritmo</th>
              <th className="px-6 py-3">Data de Nascimento</th>
              <th className="px-6 py-3">Origem Fiscal</th>
              <th className="px-6 py-3">Status Receita*</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => {
              const formatted = item.isValid ? formatCPF(item.cpf) : item.cpf;
              return (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-mono font-medium text-slate-700">
                  {item.name}
                </td>
                <td className="px-6 py-3 font-mono font-medium text-slate-700">
                  {formatted}
                </td>
                <td className="px-6 py-3">
                  {item.dataNascimento}
                </td>
                <td className="px-6 py-3">
                  {item.isValid ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Válido
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      Inválido
                    </span>
                  )}
                </td>
                <td className="px-6 py-3">
                   {item.isValid ? (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.region}
                      </div>
                   ) : (
                     <span className="text-slate-400">-</span>
                   )}
                </td>
                <td className="px-6 py-3">
                  {/* Disclaimer: We cannot check Real Receita status without credentials */}
                  {item.isValid ? (
                    <span className="text-slate-400 text-xs italic flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Requer Certificado Digital
                    </span>
                  ) : (
                     <span className="text-slate-300">-</span>
                  )}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};