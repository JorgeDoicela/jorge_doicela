export function getPortfolioCvFilename(locale: string): string {
  return locale === 'en' ? 'Jorge_Doicela_CV_EN.pdf' : 'Jorge_Doicela_CV_ES.pdf';
}

export function getPortfolioCvPath(locale: string): string {
  return `/portfolio/cv/${getPortfolioCvFilename(locale)}`;
}
