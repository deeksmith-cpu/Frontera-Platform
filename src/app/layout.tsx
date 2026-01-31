import type { Metadata, Viewport } from "next";
import { Inter, Crimson_Pro, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./providers";
import { PostHogPageView } from "./PostHogPageView";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Strategy Coach v2 Fonts
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a1f3a',
};

export const metadata: Metadata = {
  title: "Frontera | AI-Powered Product Strategy Coaching for Enterprise Transformations",
  description: "Transform your enterprise with AI-powered product strategy coaching. Frontera helps C-suite leaders navigate product model transformations with confidence.",
  keywords: ["product strategy", "enterprise transformation", "AI coaching", "product operating model", "digital transformation"],
  authors: [{ name: "Frontera" }],
  openGraph: {
    title: "Frontera | AI-Powered Product Strategy Coaching",
    description: "Transform your enterprise with AI-powered product strategy coaching.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontera | AI-Powered Product Strategy Coaching",
    description: "Transform your enterprise with AI-powered product strategy coaching.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body className={`${inter.variable} ${crimsonPro.variable} ${ibmPlexMono.variable} ${newsreader.variable} font-sans antialiased`} suppressHydrationWarning>
          <PostHogProvider>
            <PostHogPageView />
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
