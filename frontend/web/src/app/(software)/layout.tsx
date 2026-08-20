import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ResourceErrorFallback from "../components/ResourceErrorFallback";
import CancelFallback from "../components/CancelFallback";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://software.jorgedoicela.com"),
  title: "Software Hub | Jorge Doicela",
  description: "Galería de proyectos de software, IA y ciberseguridad con base de datos SQLite aislada.",
  icons: {
    icon: "/software/logo/logo_fondo_circular_color_.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${plusJakartaSans.variable} h-full scroll-smooth theme-software`}>
      <head>
        <ResourceErrorFallback />
      </head>
      <body className="font-sans min-h-full theme-software bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-zinc-300 dark:selection:bg-zinc-800 transition-colors duration-400 relative">
        <CancelFallback />
        {/* Capa de Orbes de Brillo de Fondo */}
        <div className="tech-glow-container">
          <div className="tech-glow-orb orb-violet" />
          <div className="tech-glow-orb orb-cyan" />
          <div className="tech-glow-orb orb-magenta" />
        </div>
        {children}
      </body>
    </html>
  );
}
