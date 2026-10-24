import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SystemStatusBar from "@/components/os/SystemStatusBar";
import SystemLoader from "@/components/os/SystemLoader";
import ScrollEngine from "@/lib/animations/ScrollEngine";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });
const siteUrl = "https://www.frpboy.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rahul Muraleedharan | Full Stack Developer & Automation Specialist",
    template: "%s | Rahul Muraleedharan",
  },
  description: "Portfolio of Rahul Muraleedharan: full-stack development, Android and desktop applications, Python, APIs, databases, and workflow automation.",
  applicationName: "Portfolio OS",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    url: siteUrl + "/",
    siteName: "Rahul Muraleedharan | Portfolio OS",
    title: "Rahul Muraleedharan | Full Stack Developer & Automation Specialist",
    description: "A practical engineering portfolio spanning troubleshooting, software development, and workflow automation.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Rahul Muraleedharan — Full Stack Developer and Automation Specialist" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Muraleedharan | Portfolio OS",
    description: "Full-stack software, practical troubleshooting, and workflow automation.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable + " " + jetbrainsMono.variable + " antialiased dark"}>
      <body className="min-h-screen bg-black text-white selection:bg-system-green/30">
        <MotionConfig reducedMotion="user">
          <ScrollEngine>
            <SystemLoader />
            <SystemStatusBar />
            <main className="relative flex min-h-screen flex-col pt-8">{children}</main>
          </ScrollEngine>
        </MotionConfig>
      </body>
    </html>
  );
}
