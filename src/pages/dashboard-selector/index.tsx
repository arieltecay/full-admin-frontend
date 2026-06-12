import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/api/dashboard-service';
import type { DashboardItem } from '../../services/api/dashboard-service';
import { useAuth } from '../../hooks/use-auth';
import { useTheme } from '../../hooks/use-theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  LayoutDashboard, Calendar, ChevronRight, Loader2,
  Sun, Moon, LogOut, Sparkles, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardSelector = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<DashboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const data = await dashboardService.getMyDashboards();
      setDashboards(data);
    } catch (error) {
      toast.error('Error al cargar los tableros');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={48} />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Cargando tableros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white" size={22} />
            </div>
            <div>
              <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Panel de Control</span>
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">Auditoría BI</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sesión Activa</span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-400 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-full">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={14} />
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Mis Tableros</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Bienvenido, <span className="text-indigo-600 dark:text-indigo-400">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Seleccioná el tablero de nómina que deseas consultar. Cada tablero contiene el análisis completo del período correspondiente.
          </p>
        </div>

        {/* Dashboards Grid */}
        {dashboards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <Card
                key={dashboard._id}
                hoverEffect
                className="p-6 cursor-pointer group"
                onClick={() => navigate(`/dashboard/${dashboard._id}`)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${dashboard.theme?.primaryColor || '#6366f1'}15`,
                        color: dashboard.theme?.primaryColor || '#6366f1'
                      }}
                    >
                      <LayoutDashboard size={22} />
                    </div>
                    <Badge variant="success">Activo</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {dashboard.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar size={14} />
                      <span className="font-semibold">{dashboard.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">
                      Creado: {new Date(dashboard.createdAt).toLocaleDateString('es-AR')}
                    </span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-16 text-center">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <LayoutDashboard className="text-slate-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Sin tableros asignados</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Tu administrador aún no ha creado tableros para tu cuenta. Contactalo para solicitar acceso a los informes de nómina.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardSelector;
