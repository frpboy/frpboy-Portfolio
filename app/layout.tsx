import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SystemStatusBar from "@/components/os/SystemStatusBar";
import SystemLoader from "@/components/os/SystemLoader";
import SystemActivityLog from "@/components/os/SystemActivityLog";
import ScrollEngine from "@/lib/animations/ScrollEngine";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rahul OS | frpboy.in",
  description: "Systems Architect & Product Builder Portfolio. Replacing manual chaos with automated control.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-black text-white selection:bg-system-green/30">
        <ScrollEngine>
          <SystemLoader />
          <SystemStatusBar />
          <SystemActivityLog />
          <main className="relative pt-8 min-h-screen flex flex-col">
            {children}
          </main>
        </ScrollEngine>
      </body>
    </html>
  );
}
