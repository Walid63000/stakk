import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
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
  description: "Empile tes séances. Monte ton score.",
};

export const viewport: Viewport = {
  themeColor: "#101114",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${anton.variable} ${grotesk.variable} ${plexMono.variable}`}>
      <body className="font-sans">
        {/* Colonne mobile : l'app vit dans 430px max, centrée sur desktop */}
        <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col">
          <main className="flex-1 px-6 pb-32 pt-4">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
