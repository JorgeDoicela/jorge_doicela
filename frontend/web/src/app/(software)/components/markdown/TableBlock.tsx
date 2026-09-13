import React from 'react';

export function TableBlock({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl glass-concave-panel border border-black/5 dark:border-white/5 shadow-inner scrollbar-thin select-text">
      <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse" {...props}>
        {children}
      </table>
    </div>
  );
}
