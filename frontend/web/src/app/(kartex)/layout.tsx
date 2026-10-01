import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./providers";
import { KartexJsonLd } from "./shared/seo";

const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

const lora = localFont({
  src: [
    {
      path: "./fonts/Lora-Variable.ttf",
      style: "normal",
    },
    {
      path: "./fonts/Lora-Italic-Variable.ttf",
      style: "italic",
    },
  ],
  variable: "--font-lora",
  display: "swap",
  weight: "400 700",
});

const frankRuhl = localFont({
  src: "./fonts/FrankRuhlLibre-Variable.ttf",
  variable: "--font-hebrew",
  display: "swap",
  weight: "300 900",
});

const cardo = localFont({
  src: "./fonts/Cardo-Regular.ttf",
  variable: "--font-greek",
  display: "swap",
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");


  return {
    metadataBase: new URL("https://kartex.jorgedoicela.com"),
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/kartex/logo/logo_fondo_circular_color_.png",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://kartex.jorgedoicela.com",
      siteName: "KARTEX | Jorge Doicela",
      locale: locale === "es" ? "es_EC" : "en_US",
      type: "website",
      images: [
        {
          url: "/kartex/logo/logo_fondo_circular_color_.png",
          width: 512,
          height: 512,
          alt: "KARTEX - Jorge Doicela",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
      images: ["/kartex/logo/logo_fondo_circular_color_.png"],
    },
    alternates: {
      canonical: "https://kartex.jorgedoicela.com",
      languages: {
        "es-EC": "https://kartex.jorgedoicela.com",
        "en-US": "https://kartex.jorgedoicela.com",
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
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${frankRuhl.variable} ${cardo.variable} h-full antialiased overflow-x-clip`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Knowledge Base (llms.txt)" />
        <KartexJsonLd />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


