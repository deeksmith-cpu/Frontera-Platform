import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers";
import { PostHogPageView } from "./PostHogPageView";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <PostHogProvider>
          <PostHogPageView />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
