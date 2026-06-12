import React from 'react';
import { EmployeeTable } from '../../table/employee-table';
import { ObraSocialPie } from '../../charts/obra-social-pie';
import type { TabWithStatsProps } from '../types';

/**
 * Pestaña de Estructura de Personal (v3.1).
 * Delega la renderización a componentes atómicos normalizados.
 */
export const PersonalTab: React.FC<TabWithStatsProps> = ({ rows, stats, formatCurrency }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
    <div className="lg:col-span-2">
      <EmployeeTable rows={rows} formatCurrency={formatCurrency} />
    </div>
    <div>
      <ObraSocialPie data={stats.distributions.obraSocial} total={rows.length} />
    </div>
  </div>
);

export default PersonalTab;
