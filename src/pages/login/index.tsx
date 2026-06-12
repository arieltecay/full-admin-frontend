import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import apiClient from '../../services/api/api-client';
import { Lock, Mail, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10 m-4 lg:m-8 overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm">
        
        {/* Left Side: Branding & Experience */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute inset-0 animate-mesh" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-12">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="text-white font-black tracking-tighter text-xl uppercase">Nómina Cloud Pro</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-white leading-tight">
                La nueva era de la <br /> 
                <span className="text-blue-200 italic">gestión salarial.</span>
              </h2>
              <p className="text-blue-100/80 text-lg font-medium max-w-sm leading-relaxed">
                Accede a una experiencia visual revolucionaria para consultar tus reportes y liquidaciones oficiales.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center space-x-4">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-500 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-100 font-bold tracking-wide">
              +1,200 usuarios confían en nosotros
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="bg-slate-900/40 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 lg:hidden text-center">
              <h1 className="text-3xl font-black text-white mb-2">Portal Clientes</h1>
              <p className="text-slate-400 font-medium">Ingresa a tu cuenta corporativa</p>
            </div>

            <div className="mb-10 hidden lg:block">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                <Sparkles className="text-blue-400" size={14} />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Acceso Seguro</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Iniciar Sesión</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl text-xs font-bold border border-rose-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              <div className="space-y-2 group">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-400 transition-colors">Email del Colaborador</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-800/60 focus:border-blue-500/50 transition-all text-white font-medium"
                    placeholder="nombre@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-400 transition-colors">Contraseña Segura</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-800/60 focus:border-blue-500/50 transition-all text-white font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center space-x-3 overflow-hidden">
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span>Ingresar al Portal</span>
                      <ShieldCheck size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                Sincronizado con RRHH • 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
