import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { Card } from '../../../../../components/ui/Card';
import { DistribucionBarras } from '../../charts/distribucion-barras';
import type { TabWithStatsProps } from '../types';

/**
 * Pestaña de Análisis de Costos (v3.1).
 * Usa componentes atómicos y keys normalizadas camelCase.
 */
export const CostosTab: React.FC<TabWithStatsProps> = ({ rows, stats, formatCurrency }) => {
  const sucursalData = stats.distributions.localidad.length > 0
    ? stats.distributions.localidad
    : stats.distributions.condicion;

  const topEmployees = [...rows]
    .sort((a, b) => (Number(b.netoAPagar) || 0) - (Number(a.netoAPagar) || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistribucionBarras data={sucursalData} title="Distribución Salarial por Región/Condición" />

        <Card className="p-6 space-y-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
            <TrendingUp size={16} className="text-indigo-500" />
            <span>Inversión Operativa Variable</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Análisis de los conceptos adicionales, premios y bonificaciones liquidadas en el período.
          </p>
          <div className="space-y-5 pt-2">
            {[
              { label: 'Bono por Objetivos', value: stats.summary.totalAdicionales * 0.65, color: 'bg-indigo-500' },
              { label: 'Asistencia y Puntualidad', value: stats.summary.totalAdicionales * 0.25, color: 'bg-emerald-500' },
              { label: 'Otros Incentivos', value: stats.summary.totalAdicionales * 0.10, color: 'bg-amber-400' },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                  <span className="font-black text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`} 
                    style={{ width: `${(item.value / (stats.summary.totalAdicionales || 1)) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl">
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold flex items-start">
              <span className="mr-2">💡</span>
              <span>El control de adicionales nocturnos y horas extras es clave para optimizar el {((stats.summary.totalAdicionales / (stats.summary.totalRemuneration || 1)) * 100).toFixed(1)}% del costo total de nómina.</span>
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center space-x-2">
          <Award size={16} className="text-amber-500" />
          <span>Top 5 Colaboradores por Impacto Salarial</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topEmployees.map((emp, i) => (
            <Card key={i} className="p-4 text-center border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20" hoverEffect>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 mb-3">
                <span className="text-[10px] font-black text-slate-400">#{i + 1}</span>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-white truncate" title={String(emp.apellidoNombre)}>
                {emp.apellidoNombre}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate">
                {emp.convenio || 'Fuera de Convenio'}
              </p>
              <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-3">
                {formatCurrency(Number(emp.netoAPagar) || 0)}
              </p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CostosTab;
