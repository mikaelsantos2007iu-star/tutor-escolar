import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, CheckCircle, AlertCircle, ScanLine } from 'lucide-react';
import { Button } from '../components/Button';
import { analyzeImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const UploadAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null); // Reset previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      const result = await analyzeImage(image);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Erro ao analisar a imagem. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white flex justify-center items-center gap-3">
            <ScanLine className="text-cyan-600 dark:text-cyan-400" size={36} />
            Scanner de Tarefas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Digitalize seus exercícios. A IA lê, entende e resolve.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Upload */}
          <div className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-3xl h-[400px] flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-sm group ${
                  image 
                  ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                  : 'border-gray-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-cyan-500/50'
              }`}
            >
              {image ? (
                <>
                    <img src={image} alt="Preview" className="w-full h-full object-contain relative z-10" />
                    <div className="absolute inset-0 bg-cyan-500/5 z-0 pointer-events-none"></div>
                    {/* Scanning Animation */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20 animate-[scan_2s_ease-in-out_infinite]"></div>
                    )}
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                     <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium text-lg mb-2">Upload de Imagem</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Arraste um arquivo ou clique para selecionar</p>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept="image/*"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                onClick={() => setImage(null)} 
                disabled={!image || isLoading}
                className="flex-1"
              >
                Limpar
              </Button>
              <Button 
                variant="glow" 
                onClick={handleAnalyze} 
                disabled={!image || isLoading}
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Processando...' : 'Analisar e Resolver'}
              </Button>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 flex flex-col h-[400px] md:h-auto overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-4 flex items-center gap-2">
                <FileText size={20} className="text-indigo-500" />
                Resultado da IA
            </h3>
            
            {analysis ? (
              <div className="prose prose-indigo dark:prose-invert max-w-none flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 pr-2">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                {isLoading ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="animate-pulse text-indigo-400">Interpretando pixels...</p>
                  </div>
                ) : (
                  <>
                    <ScanLine size={64} className="mb-4 opacity-20" />
                    <p>O resultado da análise aparecerá aqui.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};