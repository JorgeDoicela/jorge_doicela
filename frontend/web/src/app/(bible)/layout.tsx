import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import ResourceErrorFallback from "../components/ResourceErrorFallback";
import CancelFallback from "../components/CancelFallback";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bible.jorgedoicela.com"),
  title: "Biblia Modular",
  description: "Módulo de Biblia con soporte de modo claro y oscuro al estilo Vercel.com",
  icons: {
    icon: "/bible/logo/logo_fondo_circular_color_.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ResourceErrorFallback />
      </head>
      <body className="min-h-full flex flex-col">
        <CancelFallback />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

