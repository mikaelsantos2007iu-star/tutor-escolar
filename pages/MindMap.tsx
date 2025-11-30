import React, { useState } from 'react';
import { BrainCircuit, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { generateMindMap } from '../services/geminiService';
import { MindMapNode } from '../types';
import { Button } from '../components/Button';
import jsPDF from 'jspdf';

// Recursive Component for Tree Nodes
const TreeNode: React.FC<{ node: MindMapNode; depth?: number }> = ({ node, depth = 0 }) => {
  const colors = [
    'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-200', // Root
    'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-200', // Level 1
    'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-200', // Level 2
    'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-200', // Level 3
  ];
  
  const colorClass = colors[Math.min(depth, colors.length - 1)];

  return (
    <div className="flex flex-col items-center">
      <div className={`
        relative px-6 py-3 rounded-2xl border-2 shadow-lg backdrop-blur-sm z-10 transition-all hover:scale-105 cursor-default
        ${colorClass}
        ${depth === 0 ? 'text-2xl font-bold' : 'text-sm font-medium'}
      `}>
        {node.label}
        {/* Connector Line UP */}
        {depth > 0 && (
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-300 dark:bg-gray-600"></div>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="flex gap-4 mt-8 relative">
           {/* Horizontal Connector Line */}
           {node.children.length > 1 && (
             <div className="absolute top-[-16px] left-[10%] right-[10%] h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
           )}
           
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center relative">
               {/* Vertical Connector Down to Child */}
               <div className="h-4 w-0.5 bg-gray-300 dark:bg-gray-600 absolute -top-8"></div>
               <TreeNode node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MindMap: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [rootNode, setRootNode] = useState<MindMapNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const data = await generateMindMap(topic);
      setRootNode(data);
      setScale(1); // Reset zoom
    } catch (e) {
      alert("Erro ao criar mapa mental.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <BrainCircuit className="text-pink-500" size={36} />
          Gerador de Mapas Mentais
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visualize conceitos complexos em estruturas simples.</p>
      </div>

      {/* Input */}
      <div className="max-w-xl mx-auto w-full mb-8 flex gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex: Sistema Solar, Verbos no Passado..."
          className="flex-1 rounded-xl border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
        />
        <Button onClick={handleGenerate} isLoading={isLoading} variant="glow">
          Gerar
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-gray-50 dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-800 relative overflow-hidden shadow-inner min-h-[500px] flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {rootNode ? (
          <div 
            className="transition-transform duration-300 ease-out p-10 origin-center"
            style={{ transform: `scale(${scale})` }}
          >
            <TreeNode node={rootNode} />
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-600 flex flex-col items-center">
             <BrainCircuit size={64} className="mb-4 opacity-20" />
             <p>Seu mapa aparecerá aqui</p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300">
                <ZoomOut size={20} />
            </button>
            <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300">
                <ZoomIn size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};