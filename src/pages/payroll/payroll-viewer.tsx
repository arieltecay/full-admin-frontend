import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users, DollarSign, TrendingUp, Award, Percent,
  Search, ChevronLeft, Sun, Moon, RotateCcw, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Servicios y Hooks
import { dashboardService } from '../../services/api/dashboard-service';
import { useTheme } from '../../hooks/use-theme';
import { usePayrollFilters } from './hooks/usePayrollFilters';
import { formatCurrency, formatShortCurrency } from './utils/payrollCalculations';

// Tipos
import type { DashboardDetailsResponse, ChatMessage, TabKey } from './types';

// Componentes UI Atómicos
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { KpiCard } from './components/kpi-card';

// Pestañas Modulares
import { PersonalTab } from './components/tabs/personal-tab';
import { CostosTab } from './components/tabs/costos-tab';
import { DesviosTab } from './components/tabs/desvios-tab';
import { RetencionesTab } from './components/tabs/retenciones-tab';
import { FichaTab } from './components/tabs/ficha-tab';

const TAB_KEYS: TabKey[] = ['personal', 'costos', 'desvios', 'retenciones', 'ficha'];

const TAB_LABELS: Record<TabKey, { icon: React.ReactNode; label: string }> = {
  personal: { icon: <Users size={16} />, label: 'Estructura' },
  costos: { icon: <DollarSign size={16} />, label: 'Costos' },
  desvios: { icon: <TrendingUp size={16} />, label: 'Desvíos' },
  retenciones: { icon: <Percent size={16} />, label: 'Retenciones' },
  ficha: { icon: <Users size={16} />, label: 'Ficha' },
};

/**
 * Orquestador principal del Visor de Nómina.
 */
const PayrollViewer = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [details, setDetails] = useState<DashboardDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const [isAiOpen, setIsAiOpen] = useState(true);

  const {
    filters, setters, filteredRows, filteredStats,
    isLoadingStats, resetFilters
  } = usePayrollFilters(details?.rows || [], details?.dashboard.clientId, details?.dashboard.period, details?.stats);

  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // 1. Definimos la función de carga ANTES del useEffect y la memorizamos
  const fetchDetails = useCallback(async () => {
    if (!dashboardId) return;

    try {
      setIsLoading(true);
      const data = await dashboardService.getDashboardDetails(dashboardId);
      setDetails(data);
      setChatMessages([{
        role: 'assistant',
        content: `¡Hola! He cargado el tablero de **${data.clientName}**. ¿Qué análisis deseas realizar?`
      }]);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId]);

  // 2. Ejecutamos el efecto de sincronización
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || !dashboardId) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsSendingChat(true);
    try {
      const result = await dashboardService.queryDashboardAI(dashboardId, userMsg);
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error.' }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  if (isLoading || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  const stats = filteredStats || details.stats;
  const currentSummary = stats.summary;

  const uniqueSucursales = [...new Set(details.rows.map(r => String(r.sucursal || '')).filter(Boolean))];
  const uniqueConvenios = [...new Set(details.rows.map(r => String(r.convenio || '')).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/dashboards')} className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tighter">{details.clientName?.toUpperCase()}</span>
            <Badge variant="info">Auditoría BI</Badge>
          </div>
          <button onClick={toggleTheme} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Filtros Dinámicos</h3>
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
            >
              <RotateCcw size={14} />
              <span>RESETEAR</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <select value={filters.filterSucursal} onChange={e => setters.setFilterSucursal(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">Todas las Sucursales</option>
              {uniqueSucursales.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
            <select value={filters.filterConvenio} onChange={e => setters.setFilterConvenio(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">Todos los Convenios</option>
              {uniqueConvenios.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <select value={filters.filterAntiguedad} onChange={e => setters.setFilterAntiguedad(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">Rango (Cualquiera)</option>
              <option value="0-5">0 - 5 años</option>
              <option value="5-10">5 - 10 años</option>
              <option value="10-99">10+ años</option>
            </select>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.filterSearch}
                onChange={e => setters.setFilterSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {isLoadingStats ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
            ))
          ) : (
            <>
              <KpiCard icon={<Users size={20} />} color="blue" label="DOTACIÓN" value={currentSummary.totalEmployees} sub="Nómina Activa" />
              <KpiCard icon={<DollarSign size={20} />} color="emerald" label="MASA SALARIAL" value={formatShortCurrency(currentSummary.totalNeto || currentSummary.masaSalarial)} sub="Neto Liquidado" />
              <KpiCard icon={<TrendingUp size={20} />} color="indigo" label="PROMEDIO" value={formatShortCurrency(currentSummary.promedioNeto || currentSummary.averageRemuneration)} sub="Por empleado" />
              <KpiCard icon={<Award size={20} />} color="amber" label="ADICIONALES" value={formatShortCurrency(currentSummary.totalAdicionales)} sub="Variables" />
              <KpiCard icon={<Percent size={20} />} color="rose" label="RETENCIONES" value={formatShortCurrency(Math.abs(currentSummary.totalDeducciones))} sub="Aportes Ley" negative />
            </>
          )}
        </div>

        <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
          {TAB_KEYS.map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                ${activeTab === key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {TAB_LABELS[key].label}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'personal' && <PersonalTab rows={filteredRows} stats={stats} formatCurrency={formatCurrency} />}
          {activeTab === 'costos' && <CostosTab rows={filteredRows} stats={stats} formatCurrency={formatCurrency} />}
          {activeTab === 'desvios' && <DesviosTab rows={filteredRows} stats={stats} formatCurrency={formatCurrency} />}
          {activeTab === 'retenciones' && <RetencionesTab rows={filteredRows} stats={stats} formatCurrency={formatCurrency} />}
          {activeTab === 'ficha' && (
            <FichaTab
              rows={details.rows}
              meta={details.metadata}
              clientName={details.clientName}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={setSelectedEmployee}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollViewer;
