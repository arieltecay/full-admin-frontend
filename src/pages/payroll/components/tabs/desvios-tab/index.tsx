import React from 'react';
import { TrendingUp, AlertCircle, Clock, Zap } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../../../../../components/ui/Card';
import type { TabWithStatsProps } from '../types';

const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#6366f1'];

/**
 * Pestaña de Desvíos y Variables (v3.1).
 * Usa keys normalizadas camelCase.
 */
export const DesviosTab: React.FC<TabWithStatsProps> = ({ rows, formatCurrency }) => {
  // Simulación de desvíos basada en datos reales (adicionales vs neto)
  const totalAdicionales = rows.reduce((sum, r) => sum + (r.adicionales || 0), 0);
  const totalNeto = rows.reduce((sum, r) => sum + (r.netoAPagar || 0), 0);
  const ratioDesvio = totalNeto > 0 ? (totalAdicionales / totalNeto) * 100 : 0;

  const asistenciaData = [
    { name: 'Presentismo', value: 92 },
    { name: 'Inasistencias', value: 8 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center space-x-2">
            <Clock size={16} className="text-amber-500" />
            <span>Índice de Asistencia</span>
          </h3>
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={asistenciaData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {asistenciaData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800 dark:text-white">92%</span>
              <span className="text-[8px] font-black text-slate-400 uppercase">Efectividad</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center space-x-2">
            <TrendingUp size={16} className="text-indigo-500" />
            <span>Análisis de Desvíos Presupuestarios</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impacto de Adicionales</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{ratioDesvio.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(ratioDesvio * 2, 100)}%` }} />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  El desvío actual representa un costo de <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(totalAdicionales)}</span> sobre el neto liquidado. Se recomienda auditar las horas extras del periodo.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                <AlertCircle size={20} className="text-emerald-500 mb-2" />
                <p className="text-[10px] font-black text-emerald-600/60 uppercase">Alertas</p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">0</p>
              </div>
              <div className="p-4 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
                <Zap size={20} className="text-amber-500 mb-2" />
                <p className="text-[10px] font-black text-amber-600/60 uppercase">Revisiones</p>
                <p className="text-xl font-black text-amber-700 dark:text-amber-400">12</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DesviosTab;
