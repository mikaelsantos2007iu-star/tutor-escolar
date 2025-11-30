import React, { useState } from 'react';
import { FileEdit, Check, AlertTriangle, RefreshCcw } from 'lucide-react';
import { gradeEssay } from '../services/geminiService';
import { EssayResult } from '../types';
import { Button } from '../components/Button';
import ReactMarkdown from 'react-markdown';

export const EssayGrader: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [essayText, setEssayText] = useState('');
  const [result, setResult] = useState<EssayResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGrade = async () => {
    if (!topic.trim() || !essayText.trim()) return;
    setIsLoading(true);
    try {
      const data = await gradeEssay(topic, essayText);
      setResult(data);
    } catch (e) {
      alert("Erro ao corrigir redação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <FileEdit className="text-green-500" size={36} />
            Corretor de Redação
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Avaliação detalhada com critérios do ENEM.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tema da Redação</label>
               <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Desafios para a formação educacional de surdos..."
                className="w-full rounded-xl border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu Texto</label>
               <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Cole sua redação aqui..."
                className="w-full h-[500px] rounded-xl border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 resize-none font-sans leading-relaxed"
              />
            </div>

            <Button onClick={handleGrade} isLoading={isLoading} variant="glow" className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/30">
               Avaliar Redação
            </Button>
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 h-full overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
            {result ? (
              <div className="animate-fade-in space-y-8">
                {/* Score Header */}
                <div className="text-center relative">
                   <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-green-500 bg-green-50 dark:bg-green-900/20 mb-4">
                      <span className="text-4xl font-bold text-green-700 dark:text-green-400">{result.score}</span>
                   </div>
                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pontuação Total</h2>
                   <p className="text-gray-500 text-sm mt-2 italic">"{result.feedback}"</p>
                </div>

                {/* Competencies */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">Competências</h3>
                    {result.competencies.map((comp, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{comp.name}</span>
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded font-bold">{comp.score}/200</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">{comp.comment}</p>
                        </div>
                    ))}
                </div>

                {/* Corrected Version */}
                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                        <RefreshCcw size={16} /> Versão Melhorada
                    </h3>
                    <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        <ReactMarkdown>{result.correctedVersion}</ReactMarkdown>
                    </div>
                </div>

              </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FileEdit size={32} />
                    </div>
                    <p>Escreva e envie sua redação para ver a nota.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};