import React from 'react';
import { FileText, Download, User } from 'lucide-react';
import { Card } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/Button';
import type { TabFichaProps } from '../types';
import toast from 'react-hot-toast';

/**
 * Pestaña de Ficha Individual (v3.1).
 * Simula un recibo de haberes basado en keys normalizadas camelCase.
 */
export const FichaTab: React.FC<TabFichaProps> = ({ 
  rows, meta, clientName, selectedEmployee, onSelectEmployee 
}) => {
  const employeeOptions = rows.map((r, i) => ({
    id: String(i),
    label: `#${r.legajo || i} - ${r.apellidoNombre || 'Sin Nombre'}`,
    data: r
  }));

  const selected = selectedEmployee ? employeeOptions.find(e => e.id === selectedEmployee) : employeeOptions[0];
  const emp = selected?.data || {};

  // Descubrimiento dinámico de conceptos (Haberes vs Retenciones) usando camelCase
  const haberesKeys = Object.keys(emp).filter(k =>
    (typeof emp[k] === 'number') && (emp[k] as number) > 0 && 
    !k.toLowerCase().includes('deducc') && !k.toLowerCase().includes('retenc') &&
    k !== 'remuneracionTotal' && k !== 'totalNeto' && k !== 'masaSalarial' && k !== 'netoAPagar'
  ).slice(0, 10);
  
  const retencionesKeys = Object.keys(emp).filter(k =>
    (typeof emp[k] === 'number') && 
    (k.toLowerCase().includes('deducc') || k.toLowerCase().includes('retenc') || k.toLowerCase().includes('jubila') || k.toLowerCase().includes('social'))
  ).slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      <Card className="p-6 space-y-6 border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
            <User size={16} className="text-indigo-500" />
            <span>Selección de Empleado</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-medium leading-tight">Selecciona un colaborador para visualizar su recibo de haberes simulado.</p>
        </div>
        
        <div className="space-y-4">
          <select
            value={selectedEmployee || '0'}
            onChange={e => onSelectEmployee(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all dark:text-white"
          >
            {employeeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
          </select>
          
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
             <div className="flex justify-between text-[10px] font-bold">
               <span className="text-slate-400">ANTIGÜEDAD:</span>
               <span className="text-slate-800 dark:text-slate-200">{emp.antiguedad || '0'} años</span>
             </div>
             <div className="flex justify-between text-[10px] font-bold">
               <span className="text-slate-400">SUCURSAL:</span>
               <span className="text-slate-800 dark:text-slate-200 truncate ml-2">{emp.sucursal || '-'}</span>
             </div>
          </div>

          <Button 
            variant="secondary" 
            className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
            onClick={() => toast.success('Función de impresión en desarrollo')}
          >
            <Download size={14} className="mr-2" />
            Imprimir Recibo
          </Button>
        </div>
      </Card>

      <Card className="lg:col-span-3 p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden bg-white dark:bg-slate-900">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
          <FileText size={200} className="text-slate-900 dark:text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{clientName?.toUpperCase()}</h2>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">CUIT: {meta?.cuit || '30-XXXXXXXX-1'}</p>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg inline-block mb-2 uppercase tracking-widest">Recibo de Haberes</div>
              <p className="text-xs font-bold text-slate-500 tracking-wider">PERÍODO: {meta?.period || '01-2026'}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">
                  <th className="px-4 py-4 text-left">Concepto / Descripción</th>
                  <th className="px-4 py-4 text-right">Haberes (R)</th>
                  <th className="px-4 py-4 text-right">Retenciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {haberesKeys.map((k, i) => (
                  <tr key={`h-${i}`} className="group">
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{k}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-800 dark:text-slate-200">${Number(emp[k]).toLocaleString('es-AR')}</td>
                    <td className="px-4 py-3.5 text-right text-slate-300 dark:text-slate-700">-</td>
                  </tr>
                ))}
                {retencionesKeys.map((k, i) => (
                  <tr key={`r-${i}`} className="group">
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{k}</td>
                    <td className="px-4 py-3.5 text-right text-slate-300 dark:text-slate-700">-</td>
                    <td className="px-4 py-3.5 text-right font-bold text-rose-600 dark:text-rose-400">${Math.abs(Number(emp[k])).toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <td className="px-4 py-6 font-black text-slate-900 dark:text-white uppercase tracking-widest text-[11px]">Neto Final a Cobrar</td>
                  <td colSpan={2} className="px-4 py-6 text-right font-black text-emerald-600 dark:text-emerald-400 text-2xl tracking-tighter">
                    ${(Number(emp.netoAPagar) || 0).toLocaleString('es-AR')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FichaTab;
