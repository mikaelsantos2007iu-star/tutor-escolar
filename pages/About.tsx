import React from 'react';
import { Brain, Heart, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-16 text-center relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
             <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
            
            <h1 className="text-4xl font-display font-extrabold text-white relative z-10">Sobre o Tutor Escolar</h1>
            <p className="mt-4 text-indigo-100 text-lg max-w-2xl mx-auto relative z-10">Democratizando o acesso à educação de qualidade com o poder da Inteligência Artificial Generativa.</p>
          </div>
          
          <div className="px-8 py-10 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-indigo-500 rounded-full"></span>
                  Nossa Missão
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Acreditamos que todo estudante merece ter um tutor paciente, inteligente e disponível 24 horas por dia. 
                Nosso objetivo é utilizar a tecnologia de ponta do Google Gemini para oferecer explicações claras, 
                resolver dúvidas complexas e inspirar o aprendizado contínuo, independente da condição social ou localização.
              </p>
            </section>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 hover:transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Inteligência</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Domínio de diversas matérias, com raciocínio lógico avançado.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 hover:transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={28} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Empatia</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Uma IA programada para ser paciente, didática e motivadora.</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 hover:transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Segurança</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Conteúdo seguro, sem alucinações perigosas, focado no currículo escolar.</p>
              </div>
            </div>

            <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Stack Tecnológico</h2>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Modelo de Linguagem: <strong className="text-indigo-600 dark:text-indigo-400">Gemini 2.5 Flash</strong> (Velocidade e Raciocínio)</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Geração de Imagens: <strong className="text-purple-600 dark:text-purple-400">Imagen 3 / 4</strong> (Visualização de conceitos)</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span>Visão Computacional: Análise multimodal de fotos de cadernos e livros.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};