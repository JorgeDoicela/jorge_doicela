import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import ResourceErrorFallback from "../components/ResourceErrorFallback";
import CancelFallback from "../components/CancelFallback";

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
    <html lang={locale} className={`${plusJakartaSans.variable} dark h-full scroll-smooth theme-software`}>
      <head>
        <ResourceErrorFallback />
      </head>
      <body className="font-sans min-h-full theme-software bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-zinc-300 dark:selection:bg-zinc-800 transition-colors duration-400 relative">
        <CancelFallback />
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

