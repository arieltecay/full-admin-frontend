import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import type { PayrollFilters, PayrollFilterSetters } from '../../hooks/usePayrollFilters';

interface FilterBarProps {
  filters: PayrollFilters;
  setters: PayrollFilterSetters;
  uniqueSucursales: string[];
  uniqueConvenios: string[];
  onReset: () => void;
}

/**
 * Barra de filtros dinámica (v3.1).
 */
export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, setters, uniqueSucursales, uniqueConvenios, onReset 
}) => {
  return (
    <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm dark:bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Filtros Dinámicos</h3>
        <button 
          onClick={onReset}
          className="flex items-center space-x-1.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
        >
          <RotateCcw size={14} />
          <span>RESETEAR</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <select 
          value={filters.filterSucursal} 
          onChange={e => setters.setFilterSucursal(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        >
          <option value="">Todas las Sucursales</option>
          {uniqueSucursales.map((s, i) => <option key={i} value={s}>{s}</option>)}
        </select>
        
        <select 
          value={filters.filterConvenio} 
          onChange={e => setters.setFilterConvenio(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        >
          <option value="">Todos los Convenios</option>
          {uniqueConvenios.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>

        <select 
          value={filters.filterAntiguedad} 
          onChange={e => setters.setFilterAntiguedad(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        >
          <option value="">Rango (Cualquiera)</option>
          <option value="0-5">0 - 5 años</option>
          <option value="5-10">5 - 10 años</option>
          <option value="10-99">10+ años</option>
        </select>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o legajo..."
            value={filters.filterSearch}
            onChange={e => setters.setFilterSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
        </div>
      </div>
    </Card>
  );
};
