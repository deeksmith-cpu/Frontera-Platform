import type { Metadata } from "next";
import { Inter, Crimson_Pro, IBM_Plex_Mono } from "next/font/google";
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
      <html lang="en" className="scroll-smooth">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet" />
        </head>
        <body className={`${inter.variable} ${crimsonPro.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
          <PostHogProvider>
            <PostHogPageView />
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
