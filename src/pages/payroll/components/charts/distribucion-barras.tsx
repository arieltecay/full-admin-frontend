import React from 'react';
import { DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card } from '../../../../components/ui/Card';
import type { DistributionItem } from '../../types';

const CHART_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6', '#f43f5e'];

interface DistribucionBarrasProps {
  data: DistributionItem[];
  title: string;
  icon?: React.ReactNode;
}

export const DistribucionBarras: React.FC<DistribucionBarrasProps> = ({ data, title, icon }) => {
  return (
    <Card className="p-6 space-y-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
        {icon || <DollarSign size={16} className="text-emerald-500" />}
        <span>{title}</span>
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <Tooltip 
              cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
