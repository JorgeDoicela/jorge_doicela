import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./providers";
import DoiceladevJsonLd from './shared/seo/DoiceladevJsonLd';
import { ScrollToTopButton } from './shared/ui/ScrollToTopButton';
import { SpotlightProvider } from './features/spotlight-search';

const plusJakartaSans = localFont({
  src: [
    {
      path: "./fonts/PlusJakartaSans-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/PlusJakartaSans-Italic-Variable.woff2",
      style: "italic",
    },
  ],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: "200 800",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");


  return {
    metadataBase: new URL("https://doiceladev.jorgedoicela.com"),
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/doiceladev/logo/logo_fondo_circular_color_.png",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://doiceladev.jorgedoicela.com",
      siteName: "DoicelaDev",
      locale: locale === "es" ? "es_EC" : "en_US",
      type: "website",
      images: [
        {
          url: "/doiceladev/logo/logo_fondo_circular_color_.png",
          width: 512,
          height: 512,
          alt: "DoicelaDev - Jorge Doicela",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
      images: ["/doiceladev/logo/logo_fondo_circular_color_.png"],
    },
    alternates: {
      canonical: "https://doiceladev.jorgedoicela.com",
      languages: {
        "es-EC": "https://doiceladev.jorgedoicela.com",
        "en-US": "https://doiceladev.jorgedoicela.com",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full scroll-smooth theme-doiceladev`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Knowledge Base (llms.txt)" />
        <link rel="icon" href="/doiceladev/logo/logo_fondo_circular_color_.png" />
        <DoiceladevJsonLd locale={locale} />
      </head>
      <body className="font-sans min-h-full theme-doiceladev bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-zinc-300 dark:selection:bg-zinc-800 transition-colors duration-400 relative" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <SpotlightProvider>
              {children}
            </SpotlightProvider>
            <ScrollToTopButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

