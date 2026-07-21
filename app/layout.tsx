import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Anton, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { TabBar } from "@/components/TabBar";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stakk",
  description: "Stack your sessions. Raise your score.",
};

export const viewport: Viewport = {
  themeColor: "#0C0D10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${anton.variable} ${grotesk.variable} ${plexMono.variable}`}
    >
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          {/* Colonne mobile : l'app vit dans 430px max, centrée sur desktop */}
          <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col">
            <main className="flex-1 px-6 pb-32 pt-4">{children}</main>
            <Suspense fallback={null}>
              <TabBar />
            </Suspense>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
