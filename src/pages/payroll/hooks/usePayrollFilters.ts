import { useState, useMemo, useEffect } from 'react';
import type { PayrollRow, PayrollStats } from '../types';
import { payrollService } from '../../../services/api/payroll-service';

export interface PayrollFilters {
  filterSucursal: string;
  filterConvenio: string;
  filterAntiguedad: string;
  filterSearch: string;
}

export interface PayrollFilterSetters {
  setFilterSucursal: (val: string) => void;
  setFilterConvenio: (val: string) => void;
  setFilterAntiguedad: (val: string) => void;
  setFilterSearch: (val: string) => void;
}

/**
 * Hook para manejar la lógica de filtrado de nómina (v2 Server-Driven).
 */
export const usePayrollFilters = (rows: PayrollRow[], clientId?: string, period?: string, initialStats?: PayrollStats | null) => {
  const [filterSucursal, setFilterSucursal] = useState<string>('');
  const [filterConvenio, setFilterConvenio] = useState<string>('');
  const [filterAntiguedad, setFilterAntiguedad] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState<string>('');
  
  const [filteredStats, setFilteredStats] = useState<PayrollStats | null>(initialStats || null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Filtrado local para la tabla (rápido)
  const filteredRows = useMemo<PayrollRow[]>(() => {
    return rows.filter((row: PayrollRow) => {
      const sucursal = String(row.sucursal || '');
      const convenio = String(row.convenio || '');
      const antiguedad = Number(row.antiguedad || 0);
      
      const searchStr = `${row.apellidoNombre} ${row.legajo}`.toLowerCase();

      if (filterSucursal && sucursal !== filterSucursal) return false;
      if (filterConvenio && convenio !== filterConvenio) return false;
      
      if (filterAntiguedad) {
        const [min, max] = filterAntiguedad.split('-').map(Number);
        if (antiguedad < min || (max && antiguedad > max)) return false;
      }
      
      if (filterSearch && !searchStr.includes(filterSearch.toLowerCase())) return false;
      
      return true;
    });
  }, [rows, filterSucursal, filterConvenio, filterAntiguedad, filterSearch]);

  // Actualizar stats desde el servidor (v2)
  useEffect(() => {
    if (!clientId || !period) return;

    const fetchFilteredStats = async () => {
      try {
        setIsLoadingStats(true);
        const stats = await payrollService.getPayrollStats(clientId, period, {
          sucursal: filterSucursal,
          convenio: filterConvenio,
          antiguedadRange: filterAntiguedad,
          searchTerm: filterSearch
        });
        setFilteredStats(stats);
      } catch (error) {
        console.error('Error fetching filtered stats', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    // Debounce para búsqueda
    const timer = setTimeout(fetchFilteredStats, filterSearch ? 400 : 0);
    return () => clearTimeout(timer);
  }, [clientId, period, filterSucursal, filterConvenio, filterAntiguedad, filterSearch]);

  const resetFilters = () => {
    setFilterSucursal('');
    setFilterConvenio('');
    setFilterAntiguedad('');
    setFilterSearch('');
  };

  return {
    filters: { filterSucursal, filterConvenio, filterAntiguedad, filterSearch } as PayrollFilters,
    setters: { 
      setFilterSucursal, 
      setFilterConvenio, 
      setFilterAntiguedad, 
      setFilterSearch 
    } as PayrollFilterSetters,
    filteredRows,
    filteredStats,
    isLoadingStats,
    resetFilters
  };
};
