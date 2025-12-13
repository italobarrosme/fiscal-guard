import { useMemo } from 'react';
import { ValidationFilter } from '../types';

type FilterOption = {
  label: string;
  value: ValidationFilter;
};

/**
 * Hook responsável por gerenciar a lógica dos filtros de validação.
 * 
 * @param activeFilter - Filtro atualmente selecionado
 * @returns Objeto com a lista de filtros e função para obter classes CSS
 * 
 * @example
 * ```tsx
 * const { filters, getFilterClasses } = useValidationFilters(ValidationFilter.ALL);
 * 
 * {filters.map(f => (
 *   <button
 *     key={f.value}
 *     className={getFilterClasses(f.value)}
 *   >
 *     {f.label}
 *   </button>
 * ))}
 * ```
 */
export function useValidationFilters(activeFilter: ValidationFilter) {
  const filters: FilterOption[] = useMemo(
    () => [
      { label: 'Todos', value: ValidationFilter.ALL },
      { label: 'Apenas Válidos', value: ValidationFilter.VALID },
      { label: 'Situação Regular', value: ValidationFilter.REGULAR },
      { label: 'Inválidos', value: ValidationFilter.INVALID },
    ],
    []
  );

  const getFilterClasses = (filterValue: ValidationFilter): string => {
    const baseClasses = 'px-3 py-1.5 rounded-full text-xs font-medium transition-colors';
    
    if (activeFilter === filterValue) {
      return `${baseClasses} bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200`;
    }
    
    return `${baseClasses} text-slate-500 hover:bg-slate-50`;
  };

  return {
    filters,
    getFilterClasses,
  };
}

