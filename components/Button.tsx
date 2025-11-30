import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'glow';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 border border-transparent",
    
    // Futuristic Glow Variant
    glow: "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] text-white hover:bg-[position:right_center] shadow-lg shadow-purple-600/40 hover:shadow-purple-600/60 border border-transparent animate-gradient",
    
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm border border-transparent",
    
    outline: "border-2 border-indigo-600 dark:border-cyan-500 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-cyan-950/30",
    
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-500 hover:text-white"
  };

  const selectedVariant = variant === 'primary' ? variants.glow : variants[variant];

  return (
    <button 
      className={`${baseStyles} ${selectedVariant} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Processando...</span>
        </>
      ) : children}
    </button>
  );
};