import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { chatWithGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Olá! Sou seu Tutor Escolar. Em que matéria posso te ajudar hoje? Posso resolver exercícios, explicar conceitos ou revisar textos.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await chatWithGemini(apiHistory, userMessage.content, userMessage.image);

      setMessages(prev => [...prev, {
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        content: "Desculpe, tive um problema ao processar sua resposta. Tente novamente.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative">
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-slate-700">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-5 shadow-lg backdrop-blur-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                    : 'bg-white/80 dark:bg-slate-800/80 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-white/10 rounded-bl-none'
                }`}
              >
                {msg.image && (
                  <div className="mb-3">
                    <img src={msg.image} alt="User upload" className="max-h-64 rounded-lg border border-white/20" />
                  </div>
                )}
                <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'prose-indigo dark:prose-invert'} max-w-none text-sm md:text-base leading-relaxed`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-gray-200 dark:border-slate-700 shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-200 dark:border-white/10 p-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-3 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 p-2 rounded-lg inline-block border border-indigo-100 dark:border-indigo-800">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Imagem anexada</span>
              <button onClick={() => setSelectedImage(null)} className="text-indigo-400 hover:text-indigo-600">
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all shadow-inner">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Enviar imagem"
            >
              <ImageIcon size={22} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida aqui..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 max-h-32 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500"
              rows={1}
              style={{ minHeight: '48px' }}
            />

            <button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-3 flex items-center justify-center gap-1">
            <Sparkles size={12} />
            Tutor Escolar IA pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};