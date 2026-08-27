import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider } from "./context/LanguageContext";
import { PerformanceProvider } from "./context/PerformanceContext";
import PwaRegister from "./components/PwaRegister";
import PersonJsonLd from "./components/PersonJsonLd";
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
        metadataBase: new URL("https://jorgedoicela.com"),
        title: {
            default: t("title"),
            template: "%s | Jorge Doicela",
        },
        description: t("description"),
        keywords: [
            "Jorge Doicela",
            "Full Stack Developer",
            "AI Engineer",
            "Ciberseguridad",
            "DevSecOps",
            "Ecuador",
            "Quito",
            "Portafolio",
            "Biblia",
            "Software",
        ],
        authors: [{ name: "Jorge Doicela", url: "https://jorgedoicela.com" }],
        creator: "Jorge Doicela",
        publisher: "Jorge Doicela",
        manifest: "/manifest.json",
        verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
            other: {
                "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "en" ? "en_US" : "es_EC",
            alternateLocale: locale === "en" ? ["es_EC"] : ["en_US"],
            url: "https://jorgedoicela.com",
            title: t("ogTitle"),
            description: t("ogDescription"),
            siteName: "Jorge Doicela",
            images: [
                {
                    url: "/landing/logo/logo_color.png",
                    width: 1200,
                    height: 630,
                    alt: "Jorge Doicela — Logo Oficial",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: ["/landing/logo/logo_color.png"],
        },
        appleWebApp: {
            capable: true,
            statusBarStyle: "black-translucent",
            title: "Jorge Doicela",
        },
        icons: {
            icon: "/landing/logo/logo_fondo_circular_color_.png",
            apple: "/landing/logo/logo_fondo_circular_color_.png",
        },
        alternates: {
            canonical: "https://jorgedoicela.com",
            languages: {
                "es-EC": "https://jorgedoicela.com",
                "en-US": "https://jorgedoicela.com",
            },
        },
    };
}

export default async function LandingLayout({
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
        >
            <head>
                <ResourceErrorFallback />
            </head>
            <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-indigo-500 selection:text-white">
                <CancelFallback />
                <PerformanceProvider>
                    <NextIntlClientProvider messages={messages} locale={locale}>
                        <LanguageProvider>
                            <PwaRegister />
                            <PersonJsonLd />
                            {children}
                        </LanguageProvider>
                    </NextIntlClientProvider>
                </PerformanceProvider>
            </body>
        </html>
    );
}

