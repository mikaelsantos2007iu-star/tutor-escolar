import React, { useState } from 'react';
import { Library, Search, ExternalLink, BookOpen, Quote } from 'lucide-react';
import { searchLibrary } from '../services/geminiService';
import { SearchResult } from '../types';
import { Button } from '../components/Button';
import ReactMarkdown from 'react-markdown';

export const LibraryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const data = await searchLibrary(query);
      setResult(data);
    } catch (e) {
      alert("Erro na pesquisa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Library className="text-amber-500" size={36} />
            Biblioteca Digital
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Pesquisa avançada com fontes reais e verificadas.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
             <Search className="text-gray-400" size={20} />
           </div>
           <input
             type="text"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
             placeholder="Pesquise sobre autores, teorias, eventos históricos..."
             className="w-full py-4 pl-12 pr-32 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-lg shadow-lg focus:ring-4 focus:ring-amber-500/20 outline-none text-gray-900 dark:text-white transition-shadow"
           />
           <div className="absolute right-2 top-2 bottom-2">
             <Button onClick={handleSearch} isLoading={isLoading} className="h-full rounded-full px-6 bg-amber-600 hover:bg-amber-700">
               Pesquisar
             </Button>
           </div>
        </div>

        {/* Results */}
        {result && (
          <div className="animate-slide-up space-y-8">
             {/* Main Content */}
             <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                <div className="flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-500 font-bold border-b border-gray-100 dark:border-slate-800 pb-4">
                   <BookOpen size={20} />
                   <span>Resumo da Pesquisa</span>
                </div>
                <div className="prose prose-lg prose-amber dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                   <ReactMarkdown>{result.text}</ReactMarkdown>
                </div>
             </div>

             {/* Sources/Citations */}
             {result.sources.length > 0 && (
               <div className="grid md:grid-cols-2 gap-4">
                  {result.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all flex items-start gap-3"
                    >
                      <div className="mt-1 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                         <Quote size={16} className="text-amber-500" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-amber-600 transition-colors">{source.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{source.uri}</p>
                      </div>
                      <ExternalLink size={14} className="text-gray-400 group-hover:text-amber-500" />
                    </a>
                  ))}
               </div>
             )}
          </div>
        )}

        {/* Empty State / Suggestions */}
        {!result && !isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
               {['Machado de Assis', 'Física Quântica', 'Guerra Fria', 'Mitocôndrias'].map(s => (
                 <button key={s} onClick={() => {setQuery(s);}} className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    {s}
                 </button>
               ))}
            </div>
        )}
      </div>
    </div>
  );
};