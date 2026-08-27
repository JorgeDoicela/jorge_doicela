import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
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

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations("Metadata");


    return {
        metadataBase: new URL("https://portfolio.jorgedoicela.com"),
        title: t("title"),
        description: t("description"),
        icons: {
            icon: "/portfolio/logo/logo_fondo_circular_color_.png",
        },
        alternates: {
            canonical: "https://portfolio.jorgedoicela.com",
            languages: {
                "es-EC": "https://portfolio.jorgedoicela.com",
                "en-US": "https://portfolio.jorgedoicela.com",
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
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <head>
                <ResourceErrorFallback />
            </head>
            <body className="min-h-full flex flex-col">
                <CancelFallback />
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                        {children}
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}


