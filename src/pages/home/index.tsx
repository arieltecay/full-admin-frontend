import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeService } from '../../services/api/home-service';
import { useAuth } from '../../hooks/use-auth';
import { 
  Sparkles, ShieldCheck, ArrowRight, CheckCircle2, 
  Briefcase, Target, Building2, ChevronRight, Loader2
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboards', { replace: true });
      return;
    }

    const fetchConfig = async () => {
      try {
        const data = await homeService.getHomeConfig();
        setConfig(data);
      } catch (error) {
        console.error('Error fetching home config', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Sparkles className="text-blue-400" size={16} />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Gestión Profesional 2026</span>
          </div>
          
          <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            {config?.companyName || 'Ecosistema de Nóminas'} <br />
            <span className="text-gradient">Inteligente.</span>
          </h1>
          
          <p className="max-w-2xl text-xl text-slate-400 font-medium leading-relaxed">
            {config?.mission || 'Bienvenido a tu panel de consulta salarial de vanguardia. Transparencia, seguridad y diseño en cada liquidación.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
            <button 
              onClick={() => navigate('/dashboards')}
              className="group relative px-12 py-6 bg-white text-slate-950 font-black rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 flex items-center space-x-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">ACCEDER A MIS NÓMINAS</span>
              <ArrowRight className="relative group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
            <div className="flex items-center space-x-3 px-8 py-6 glass-panel rounded-3xl border border-white/5">
              <ShieldCheck className="text-emerald-500" size={24} />
              <span className="text-sm font-bold tracking-tight text-slate-300 uppercase">Seguridad Bancaria Activa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services/Tasks Section - What we do */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000 delay-300">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Propuesta de Valor</h3>
                <h2 className="text-5xl font-black tracking-tight leading-none text-white">Lo que hacemos <br /> por tu empresa.</h2>
             </div>
             <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
               Gestionamos cada aspecto de tu administración con tecnología de punta para garantizar eficiencia absoluta en cada proceso.
             </p>
             
             <div className="flex items-center space-x-4 pt-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                <Building2 size={32} />
                <div className="h-8 w-[1px] bg-slate-800" />
                <Target size={32} />
                <div className="h-8 w-[1px] bg-slate-800" />
                <Briefcase size={32} />
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-12 duration-1000 delay-500">
            {config?.tasks?.map((task: string, idx: number) => (
              <div key={idx} className="glass-panel p-8 rounded-[2rem] border border-white/5 group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-500 cursor-default">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="text-blue-500" size={20} />
                </div>
                <p className="text-lg font-black tracking-tight text-white mb-2">{task}</p>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                   <span>GESTIONADO</span>
                   <ChevronRight size={10} />
                </div>
              </div>
            ))}
            {!config?.tasks?.length && (
              <div className="col-span-2 text-center py-12 text-slate-600 italic">
                Cargando servicios optimizados...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-blue-500" size={20} />
            </div>
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
              Tecnología de Encriptación de Punta <br />
              <span className="text-slate-700">© 2026 {config?.companyName}</span>
            </p>
         </div>
         
         <div className="flex items-center space-x-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Auditoría</a>
         </div>
      </footer>
    </div>
  );
};

export default Home;
