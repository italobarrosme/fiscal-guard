import React from 'react';
import { CpfSummary } from '../types';
import { Users, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StatsSummary: React.FC<{ summary: CpfSummary }> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Total</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{summary.total}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Válidos</span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-800">{summary.validCount}</p>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
            {summary.validRate}
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Situação Regular</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{summary.regularCount}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-rose-500 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Inválidos</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{summary.invalidCount}</p>
      </div>
    </div>
  );
};