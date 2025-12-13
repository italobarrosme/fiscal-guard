import React from 'react';
import { Download, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { FormattedCPF, ValidationFilter } from '../types';

interface ResultsTableProps {
  data: FormattedCPF[];
  filter: ValidationFilter;
  setFilter: (f: ValidationFilter) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, filter, setFilter }) => {
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "CPF,Valido,Regiao,Status_Receita\n"
      + data.map(row => `${row.formatted},${row.isValid ? 'SIM' : 'NAO'},"${row.region || ''}",${row.receitaStatus}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cpfs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (data.length === 0) return null;

  const filters = [
    { label: 'Todos', value: ValidationFilter.ALL },
    { label: 'Apenas Válidos', value: ValidationFilter.VALID },
    { label: 'Situação Regular', value: ValidationFilter.REGULAR },
    { label: 'Inválidos', value: ValidationFilter.INVALID },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button 
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
              <th className="px-6 py-3">CPF</th>
              <th className="px-6 py-3">Validação Algorítmica</th>
              <th className="px-6 py-3">Origem Fiscal</th>
              <th className="px-6 py-3">Situação Cadastral (RFB)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-mono font-medium text-slate-700">
                  {item.formatted}
                </td>
                <td className="px-6 py-3">
                  <div className={`flex items-center gap-1.5 ${item.statusColor}`}>
                    {item.isValid ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                    {item.statusLabel}
                  </div>
                </td>
                <td className="px-6 py-3">
                  {item.isValid ? (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.region}
                    </div>
                  ) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${item.receitaColor}`}>
                    {item.receitaLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};