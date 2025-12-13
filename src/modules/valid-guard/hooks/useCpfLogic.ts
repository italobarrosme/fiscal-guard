import { useMemo, useState } from 'react';
import type { CPFData, FormattedCPF } from '../types';
import { ValidationFilter } from '../types';
import { formatCPF } from '../extractUserDataFromText';

/**
 * Hook responsável por aplicar regras de negócio, formatação,
 * filtragem e cálculo de estatísticas sobre a lista de CPFs.
 */
export function useCpfLogic(cpfs: CPFData[]) {
  const [filter, setFilter] = useState<ValidationFilter>(ValidationFilter.ALL);

  const result = useMemo(() => {
    // 1. Formatação e Enriquecimento Visual
    const enriched: FormattedCPF[] = cpfs.map((item) => {
      const formatted = item.isValid ? formatCPF(item.original) : item.original;
      
      let receitaColor = 'text-slate-400 bg-slate-100';
      if (item.receitaStatus === 'REGULAR') receitaColor = 'text-indigo-700 bg-indigo-50 ring-indigo-600/20';
      if (item.receitaStatus === 'SUSPENSO') receitaColor = 'text-amber-700 bg-amber-50 ring-amber-600/20';
      if (item.receitaStatus === 'CANCELADO') receitaColor = 'text-red-700 bg-red-50 ring-red-600/20';
      if (item.receitaStatus === 'PENDING') receitaColor = 'text-slate-500 bg-slate-100 animate-pulse';

      return {
        ...item,
        name: item.original,
        formatted,
        statusLabel: item.isValid ? 'Válido' : 'Inválido',
        statusColor: item.isValid ? 'text-emerald-600' : 'text-rose-600',
        receitaLabel: item.receitaStatus,
        receitaColor
      };
    });

    // 2. Filtragem
    const filtered = enriched.filter(item => {
      if (filter === ValidationFilter.ALL) return true;
      if (filter === ValidationFilter.VALID) return item.isValid;
      if (filter === ValidationFilter.INVALID) return !item.isValid;
      if (filter === ValidationFilter.REGULAR) return item.receitaStatus === 'REGULAR';
      return true;
    });

    // 3. Estatísticas (Summary)
    const total = cpfs.length;
    const validCount = cpfs.filter(c => c.isValid).length;
    const invalidCount = total - validCount;
    const regularCount = cpfs.filter(c => c.receitaStatus === 'REGULAR').length;
    const validRate = total > 0 ? `${((validCount / total) * 100).toFixed(1)}%` : '0%';

    return {
      formatted: filtered,
      summary: {
        total,
        validCount,
        invalidCount,
        regularCount,
        validRate
      }
    };
  }, [cpfs, filter]);

  return {
    ...result,
    filter,
    setFilter
  };
}