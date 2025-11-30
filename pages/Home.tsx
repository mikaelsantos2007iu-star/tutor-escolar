import React from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../types';
import { MessageSquare, Presentation, Upload, Brain, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left animate-float">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                        <Sparkles size={14} />
                        <span>Potencializado por IA Google Gemini</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white leading-[1.1]">
                        O Futuro da <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Educação.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Seu assistente pessoal inteligente. Resolve exercícios, cria slides e ensina com paciência infinita.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <Link to={AppRoute.CHAT}>
                            <Button variant="glow" className="w-full sm:w-auto text-lg px-8 py-4">
                                <MessageSquare className="mr-2" size={20} />
                                Começar Agora
                            </Button>
                        </Link>
                        <Link to={AppRoute.SLIDES}>
                            <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                                <Presentation className="mr-2" size={20} />
                                Criar Apresentação
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Hero Image / 3D Element */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-[80px] opacity-30 dark:opacity-40 animate-pulse-slow"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" 
                        alt="Futuristic AI Learning" 
                        className="relative rounded-3xl shadow-2xl shadow-indigo-500/20 border border-white/20 dark:border-white/10 w-full object-cover h-[500px] transform hover:scale-[1.02] transition-transform duration-500"
                    />
                    
                    {/* Floating Cards */}
                    <div className="absolute top-10 -right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 dark:border-white/10 animate-float hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">Exercício Resolvido</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Ferramentas de Última Geração</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
             Tecnologia avançada simplificada para o seu aprendizado diário.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-3xl hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 transition-all duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[22px] p-8 h-full border border-gray-100 dark:border-white/5 transition-all group-hover:border-transparent">
                <div className="h-48 mb-6 rounded-xl overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500" alt="Coding" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-4 left-4 w-12 h-12 bg-indigo-600/90 backdrop-blur text-white rounded-lg flex items-center justify-center">
                        <Brain size={24} />
                     </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Tutor IA</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                Converse naturalmente. Tire dúvidas de qualquer matéria com explicações adaptadas ao seu nível.
                </p>
                <Link to={AppRoute.CHAT} className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Acessar Chat <ArrowRight size={16} className="ml-2" />
                </Link>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-3xl hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 transition-all duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[22px] p-8 h-full border border-gray-100 dark:border-white/5 transition-all group-hover:border-transparent">
                <div className="h-48 mb-6 rounded-xl overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500" alt="Scanning" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-4 left-4 w-12 h-12 bg-cyan-600/90 backdrop-blur text-white rounded-lg flex items-center justify-center">
                        <Upload size={24} />
                     </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Scanner Inteligente</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tire foto do caderno. A IA lê sua letra, entende a questão e resolve passo a passo.
                </p>
                <Link to={AppRoute.UPLOAD} className="inline-flex items-center text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Escanear Agora <ArrowRight size={16} className="ml-2" />
                </Link>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-3xl hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-600 transition-all duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[22px] p-8 h-full border border-gray-100 dark:border-white/5 transition-all group-hover:border-transparent">
                <div className="h-48 mb-6 rounded-xl overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=500" alt="Presentation" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-4 left-4 w-12 h-12 bg-purple-600/90 backdrop-blur text-white rounded-lg flex items-center justify-center">
                        <Presentation size={24} />
                     </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Gerador de Slides</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                Crie apresentações completas com imagens geradas por IA em segundos.
                </p>
                <Link to={AppRoute.SLIDES} className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Criar Slides <ArrowRight size={16} className="ml-2" />
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};