import { getTranslations } from 'next-intl/server';

export async function PortfolioFooter() {
  const tFooter = await getTranslations('Footer');

  return (
    <footer className="w-full max-w-[1380px] mx-auto mt-16 md:mt-20 pt-4 flex items-center justify-center text-center text-foreground/45 text-[10px] tracking-[0.2em] uppercase font-mono">
      <span>
        {tFooter('copyright', { year: new Date().getFullYear().toString() })}
      </span>
    </footer>
  );
}
