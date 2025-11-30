import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-white/5 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">Powered by mikaelzn7</span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1 text-center md:text-left">
            <p className="text-base text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} Tutor Escolar. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};