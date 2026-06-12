import type { PayrollRow, PayrollStats, PayrollMetadata } from '../../types';

export interface BaseTabProps {
  rows: PayrollRow[];
  formatCurrency: (v: number) => string;
}

export interface TabWithStatsProps extends BaseTabProps {
  stats: PayrollStats;
}

export interface TabFichaProps {
  rows: PayrollRow[];
  meta: PayrollMetadata;
  clientName: string;
  selectedEmployee: string;
  onSelectEmployee: (v: string) => void;
}
