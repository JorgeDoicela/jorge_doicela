import React from 'react';

export function TableBlock({ children, className = '', ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className={`my-6 overflow-x-auto rounded-2xl glass-convex-panel border border-black/10 dark:border-white/10 shadow-lg scrollbar-thin select-text ${className}`}>
      <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse" {...props}>
        {children}
      </table>
    </div>
  );
}

