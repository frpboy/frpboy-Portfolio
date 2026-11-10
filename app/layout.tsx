import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SystemStatusBar from "@/components/os/SystemStatusBar";
import SystemLoader from "@/components/os/SystemLoader";
import ScrollEngine from "@/lib/animations/ScrollEngine";
import SystemActivityLog from "@/components/os/SystemActivityLog";
import VisitorTracker from "@/components/os/VisitorTracker";
import PortfolioAssistant from "@/components/os/PortfolioAssistant";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });
const siteUrl = "https://www.frpboy.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rahul Muraleedharan | Full Stack Developer & Automation Specialist",
    template: "%s | Rahul Muraleedharan",
  },
  description: "Official portfolio of Rahul Muraleedharan (K4NN4N / FrpBoy), a full-stack developer and automation specialist from Kerala, India. Explore web and Android apps, Python, APIs, and workflow automation.",
  applicationName: "Rahul Muraleedharan — Portfolio OS",
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
    siteName: "Rahul Muraleedharan | FrpBoy",
    title: "Rahul Muraleedharan | Full Stack Developer & Automation Specialist",
    description: "The official portfolio of Rahul Muraleedharan (K4NN4N / FrpBoy): practical software development, Android apps, and workflow automation.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Rahul Muraleedharan — Full Stack Developer and Automation Specialist" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Muraleedharan | FrpBoy",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-[100] focus:border focus:border-system-green focus:bg-black focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:text-system-green focus:outline-none focus:ring-2 focus:ring-system-green"
        >
          Skip to main content
        </a>
        <MotionConfig reducedMotion="user">
          <ScrollEngine>
            <SystemLoader />
            <SystemStatusBar />
            <main id="main-content" tabIndex={-1} className="relative flex min-h-screen flex-col pt-11 outline-none">
              <span id="top" className="sr-only" aria-hidden="true" />
              {children}
            </main>
            <SystemActivityLog />
            <VisitorTracker />
            <PortfolioAssistant />
          </ScrollEngine>
        </MotionConfig>
      </body>
    </html>
  );
}
