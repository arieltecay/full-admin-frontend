import React from 'react';
import { Users, DollarSign, TrendingUp, Award, Percent } from 'lucide-react';
import { KpiCard } from '../kpi-card';
import type { PayrollStats } from '../../types';
import { formatShortCurrency } from '../../utils/payrollCalculations';

interface KpiRowProps {
  summary: PayrollStats['summary'];
  isLoading: boolean;
}

/**
 * Fila superior de 5 KPI cards (v3.1).
 */
export const KpiRow: React.FC<KpiRowProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      <KpiCard 
        icon={<Users size={20} />} 
        color="blue" 
        label="DOTACIÓN" 
        value={summary.totalEmployees} 
        sub="Nómina Activa" 
      />
      <KpiCard 
        icon={<DollarSign size={20} />} 
        color="emerald" 
        label="MASA SALARIAL" 
        value={formatShortCurrency(summary.masaSalarial)} 
        sub="Neto Liquidado" 
      />
      <KpiCard 
        icon={<TrendingUp size={20} />} 
        color="indigo" 
        label="PROMEDIO" 
        value={formatShortCurrency(summary.promedioNeto)} 
        sub="Por empleado" 
      />
      <KpiCard 
        icon={<Award size={20} />} 
        color="amber" 
        label="ADICIONALES" 
        value={formatShortCurrency(summary.totalAdicionales)} 
        sub="Variables" 
      />
      <KpiCard 
        icon={<Percent size={20} />} 
        color="rose" 
        label="RETENCIONES" 
        value={formatShortCurrency(Math.abs(summary.totalDeducciones))} 
        sub="Aportes Ley" 
        negative 
      />
    </div>
  );
};
