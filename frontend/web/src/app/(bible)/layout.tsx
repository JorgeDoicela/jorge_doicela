import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./theme-provider";
import BibleJsonLd from "./components/BibleJsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");


  return {
    metadataBase: new URL("https://bible.jorgedoicela.com"),
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/bible/logo/logo_fondo_circular_color_.png",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://bible.jorgedoicela.com",
      siteName: "Biblia Modular | Jorge Doicela",
      locale: locale === "es" ? "es_EC" : "en_US",
      type: "website",
      images: [
        {
          url: "/bible/logo/logo_fondo_circular_color_.png",
          width: 512,
          height: 512,
          alt: "Biblia Modular - Jorge Doicela",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
      images: ["/bible/logo/logo_fondo_circular_color_.png"],
    },
    alternates: {
      canonical: "https://bible.jorgedoicela.com",
      languages: {
        "es-EC": "https://bible.jorgedoicela.com",
        "en-US": "https://bible.jorgedoicela.com",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Knowledge Base (llms.txt)" />
        <BibleJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


