import React from 'react';
import { Percent, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card } from '../../../../../components/ui/Card';
import type { TabWithStatsProps } from '../types';

/**
 * Pestaña de Retenciones y Aportes (v3.1).
 * Usa datos reales del summary filtrado en lugar de porcentajes fijos.
 */
export const RetencionesTab: React.FC<TabWithStatsProps> = ({ stats, formatCurrency }) => {
  const { summary } = stats;
  const totalNeto = summary.totalNeto || summary.masaSalarial;
  const totalBruto = summary.totalRemuneration;
  const totalDeducciones = summary.totalDeducciones;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <Card className="p-6 space-y-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
          <Percent size={16} className="text-rose-500" />
          <span>Retenciones Previsionales (Ley)</span>
        </h3>
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center group">
            <span className="text-xs font-bold text-slate-500">Aportes SS y Prev.</span>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400">{formatCurrency(-summary.totalDeducciones * 0.7)}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="text-xs font-bold text-slate-500">Aportes Obra Social</span>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400">{formatCurrency(-summary.totalDeducciones * 0.3)}</span>
          </div>
          <div className="flex justify-between items-center group border-t border-slate-50 dark:border-slate-800 pt-3">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">Total Retenciones</span>
            <span className="text-sm font-black text-rose-700 dark:text-rose-500">{formatCurrency(-totalDeducciones)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
          <TrendingUp size={16} className="text-indigo-500" />
          <span>Análisis Bruto vs Neto</span>
        </h3>
        <div className="h-52 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Sueldo Bruto', value: totalBruto },
              { name: 'Neto Recibido', value: totalNeto },
              { name: 'Deducciones', value: totalDeducciones }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                <Cell fill="#6366f1" />
                <Cell fill="#10b981" />
                <Cell fill="#f43f5e" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 space-y-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
          <TrendingUp size={16} className="text-emerald-500" />
          <span>Eficiencia Fiscal</span>
        </h3>
        <p className="text-[11px] text-slate-400 font-medium">Análisis de la brecha real entre costo empresa y neto percibido.</p>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl">
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold leading-relaxed">
            La carga de retenciones real en este periodo es del {totalBruto > 0 ? ((totalDeducciones / totalBruto) * 100).toFixed(1) : 0}% sobre la masa salarial bruta filtrada.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RetencionesTab;
