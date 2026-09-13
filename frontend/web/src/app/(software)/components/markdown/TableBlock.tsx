import React from 'react';

export function TableBlock({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-black/30 shadow-inner scrollbar-thin">
      <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse" {...props}>
        {children}
      </table>
    </div>
  );
}
