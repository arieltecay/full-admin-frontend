import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../../../../components/ui/Card';
import type { DistributionItem } from '../../types';

const CHART_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6', '#f43f5e'];

interface ObraSocialPieProps {
  data: DistributionItem[];
  total: number;
}

export const ObraSocialPie: React.FC<ObraSocialPieProps> = ({ data, total }) => {
  return (
    <Card className="p-6 space-y-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">📊 Distribución por Obra Social</h3>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Top 6 entidades con más afiliados</p>
      </div>
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data.slice(0, 6)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              innerRadius={55} 
              strokeWidth={4}
              stroke="transparent"
            >
              {data.slice(0, 6).map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800 dark:text-white">{total}</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Total Capitas</span>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        {data.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-800 dark:text-white">{item.value}</p>
              <p className="text-[8px] font-bold text-slate-400">{((item.value / (total || 1)) * 100).toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
