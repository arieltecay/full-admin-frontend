import React from 'react';
import { Card } from '../../../../components/ui/Card';

export interface KpiCardProps {
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'indigo' | 'amber' | 'rose';
  label: string;
  value: string | number;
  sub: string;
  negative?: boolean;
}

/**
 * Tarjeta de métricas (KPI) para el tablero de nómina con tipado estricto.
 */
export const KpiCard: React.FC<KpiCardProps> = ({ 
  icon, color, label, value, sub, negative 
}) => {
  const bgMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  };

  return (
    <Card className="p-4 flex items-center space-x-4 border border-slate-100 dark:border-slate-800 shadow-sm" hoverEffect>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className={`text-xl font-black tracking-tight dark:text-white ${negative ? 'text-rose-600 dark:text-rose-400' : ''}`}>
          {value}
        </p>
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
          {sub}
        </p>
      </div>
    </Card>
  );
};

export default KpiCard;
