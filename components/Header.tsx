import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, MessageSquare, Presentation, Upload, Menu, X, Sun, Moon, Library, BrainCircuit, Gamepad2, FileEdit } from 'lucide-react';
import { AppRoute } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Tutor', path: AppRoute.CHAT, icon: <MessageSquare size={18} /> },
    { label: 'Scanner', path: AppRoute.UPLOAD, icon: <Upload size={18} /> },
    { label: 'Slides', path: AppRoute.SLIDES, icon: <Presentation size={18} /> },
    { label: 'Quiz', path: AppRoute.QUIZ, icon: <Gamepad2 size={18} /> },
    { label: 'Mapas', path: AppRoute.MINDMAP, icon: <BrainCircuit size={18} /> },
    { label: 'Redação', path: AppRoute.ESSAY, icon: <FileEdit size={18} /> },
    { label: 'Biblioteca', path: AppRoute.LIBRARY, icon: <Library size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={AppRoute.HOME} className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                <GraduationCap size={22} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all hidden sm:block">
                Tutor Escolar
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-2"></div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 absolute w-full z-50 shadow-xl">
          <div className="pt-2 pb-3 space-y-1 px-4 grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-cyan-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
             <Link
                to={AppRoute.ABOUT}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium col-span-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <GraduationCap size={18} />
                Sobre
              </Link>
          </div>
        </div>
      )}
    </header>
  );
};