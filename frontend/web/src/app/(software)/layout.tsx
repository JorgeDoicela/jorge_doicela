import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./providers";
import SoftwareJsonLd from './shared/seo/SoftwareJsonLd';
import { ScrollToTopButton } from './shared/ui/ScrollToTopButton';
import { SpotlightProvider } from './features/spotlight-search';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");


  return {
    metadataBase: new URL("https://software.jorgedoicela.com"),
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/software/logo/logo_fondo_circular_color_.png",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://software.jorgedoicela.com",
      siteName: "Software | Jorge Doicela",
      locale: locale === "es" ? "es_EC" : "en_US",
      type: "website",
      images: [
        {
          url: "/software/logo/logo_fondo_circular_color_.png",
          width: 512,
          height: 512,
          alt: "Software - Jorge Doicela",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
      images: ["/software/logo/logo_fondo_circular_color_.png"],
    },
    alternates: {
      canonical: "https://software.jorgedoicela.com",
      languages: {
        "es-EC": "https://software.jorgedoicela.com",
        "en-US": "https://software.jorgedoicela.com",
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
      className={`${plusJakartaSans.variable} h-full scroll-smooth theme-software`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Knowledge Base (llms.txt)" />
        <link rel="icon" href="/software/logo/logo_fondo_circular_color_.png" />
        <SoftwareJsonLd locale={locale} />
      </head>
      <body className="font-sans min-h-full theme-software bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-zinc-300 dark:selection:bg-zinc-800 transition-colors duration-400 relative" suppressHydrationWarning>
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

